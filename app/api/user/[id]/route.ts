import { prisma } from '@/utils/db'
import { getEmployeeByClerkID, AuthenticationError } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { TradeCategory, Availability } from '@prisma/client'

const updateEmployeeSchema = z.object({
  content: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    isAvailableForHire: z.boolean().optional(),
    resume: z.string().optional(),
    resumeSummary: z.string().optional(),
    profileImage: z.string().optional(),
    tradeCategory: z.nativeEnum(TradeCategory).optional(),
    yearsExperience: z.number().optional(),
    hourlyRate: z.number().optional(),
    availability: z.nativeEnum(Availability).optional(),
    isBackgroundChecked: z.boolean().optional(),
    isInsured: z.boolean().optional(),
  }),
})

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const requester = await getEmployeeByClerkID()

    const employeeProfile = await prisma.employee.findUnique({
      where: {
        id: params.id,
      },
      include: {
        employer: true,
        certifications: true,
        ownedPortfolioItems: true,
        contributions: true,
        serviceAreas: true,
      },
    })

    if (!employeeProfile) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Verify requester belongs to same employer
    if (requester.employerId !== employeeProfile.employerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    revalidatePath('/admin/org')
    return NextResponse.json({ data: employeeProfile })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Error fetching employee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const requester = await getEmployeeByClerkID()

    // Verify employee to update exists and belongs to same employer
    const targetEmployee = await prisma.employee.findUnique({
      where: { id: params.id },
    })

    if (!targetEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    if (requester.employerId !== targetEmployee.employerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validation = updateEmployeeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { content } = validation.data

    const updatedEmployee = await prisma.employee.update({
      where: {
        id: params.id,
      },
      data: content,
    })

    revalidatePath('/admin/org')
    return NextResponse.json({ data: updatedEmployee })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Error updating employee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const requester = await getEmployeeByClerkID()

    const req = await request.json()

    const currentEmployee = await prisma.employee.findFirst({
      where: {
        id: params.id,
      },
      include: {
        hireOffers: true,
      },
    })

    if (!currentEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Verify requester belongs to same employer
    if (requester.employerId !== currentEmployee.employerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete associated hire offers first
    if (currentEmployee?.hireOffers && currentEmployee.hireOffers.length > 0) {
      await prisma.hireOffer.deleteMany({
        where: {
          employeeId: params.id,
        },
      })
    }

    const deletedEmployee = await prisma.employee.delete({
      where: {
        id: params.id,
      },
    })

    revalidatePath(`/org/${req.employerId}`)
    return NextResponse.json({ data: deletedEmployee })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Error deleting employee:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
