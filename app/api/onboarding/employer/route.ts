import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { TradeCategory } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      companyName,
      companySize,
      contactEmail,
      contactPhone,
      city,
      state,
      zipCode,
      specialties,
      description,
    } = body

    // Validate required fields
    if (!companyName || !companySize || !contactEmail || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!specialties || specialties.length === 0) {
      return NextResponse.json(
        { error: 'At least one specialty is required' },
        { status: 400 }
      )
    }

    // Find the employee record by clerkId first
    let employee = await prisma.employee.findUnique({
      where: { clerkId: userId },
    })

    // If not found by clerkId, check by email from the request body
    if (!employee && contactEmail) {
      employee = await prisma.employee.findUnique({
        where: { email: contactEmail },
      })

      // If found by email, update with clerkId
      if (employee && !employee.clerkId) {
        employee = await prisma.employee.update({
          where: { id: employee.id },
          data: { clerkId: userId },
        })
      }
    }

    // If still not found, create a new employee record
    if (!employee) {
      employee = await prisma.employee.create({
        data: {
          clerkId: userId,
          email: contactEmail,
        },
      })
    }

    // Check if employee already has an employer
    if (employee.employerId) {
      return NextResponse.json(
        { error: 'You are already associated with a company' },
        { status: 400 }
      )
    }

    // Create employer and update employee in a transaction
    const employer = await prisma.$transaction(async (tx) => {
      // Create the employer
      const newEmployer = await tx.employer.create({
        data: {
          name: companyName,
          size: companySize,
          contactEmail,
          contactPhone: contactPhone || null,
          city,
          state,
          zipCode,
          description: description || null,
          specialties: specialties as TradeCategory[],
        },
      })

      // Update the employee to be linked to this employer and set as admin
      await tx.employee.update({
        where: { id: employee.id },
        data: {
          employerId: newEmployer.id,
          isAdmin: true,
          employmentStart: new Date(),
        },
      })

      // Create a service area for the employer
      await tx.serviceArea.create({
        data: {
          city,
          state,
          zipCode,
          radiusMiles: 25, // Default 25 mile radius
          employers: {
            connect: { id: newEmployer.id },
          },
          employees: {
            connect: { id: employee.id },
          },
        },
      })

      return newEmployer
    })

    return NextResponse.json({ employerId: employer.id }, { status: 201 })
  } catch (error) {
    console.error('Employer onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}
