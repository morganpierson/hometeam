import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'

export const dynamic = 'force-dynamic'

interface WorkExperienceInput {
  title: string
  company: string
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  description: string | null
  highlights: string[]
  location: string | null
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { employeeId, experiences } = body as {
      employeeId: string
      experiences: WorkExperienceInput[]
    }

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }

    if (!experiences || !Array.isArray(experiences)) {
      return NextResponse.json(
        { error: 'Experiences array is required' },
        { status: 400 }
      )
    }

    // Verify the employee exists and belongs to the current user
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    if (employee.clerkId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete existing work experiences for this employee (replace with new ones)
    await prisma.workExperience.deleteMany({
      where: { employeeId },
    })

    // Create new work experiences
    const createdExperiences = await prisma.workExperience.createMany({
      data: experiences.map((exp, index) => ({
        employeeId,
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate ? new Date(exp.startDate) : null,
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        isCurrent: exp.isCurrent,
        description: exp.description,
        highlights: exp.highlights,
        location: exp.location,
        sortOrder: index,
      })),
    })

    return NextResponse.json({
      success: true,
      count: createdExperiences.count,
    })
  } catch (error) {
    console.error('Error saving work experiences:', error)

    return NextResponse.json(
      { error: 'Failed to save work experiences' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }

    // Get the employee to verify ownership
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Allow access if user is the employee or if we want public access
    if (employee.clerkId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const experiences = await prisma.workExperience.findMany({
      where: { employeeId },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ experiences })
  } catch (error) {
    console.error('Error fetching work experiences:', error)

    return NextResponse.json(
      { error: 'Failed to fetch work experiences' },
      { status: 500 }
    )
  }
}
