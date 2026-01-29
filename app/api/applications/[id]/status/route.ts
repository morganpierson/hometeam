import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'

interface RouteParams {
  params: { id: string }
}

// PATCH - Update application status
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the application first
    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: {
        jobPosting: {
          select: {
            employerId: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Verify the user belongs to this employer
    const employee = await prisma.employee.findFirst({
      where: {
        clerkId: userId,
        employerId: application.jobPosting.employerId,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'You do not have permission to update this application' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'reviewing', 'interviewed', 'offered', 'hired', 'rejected']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({
      application: {
        id: updatedApplication.id,
        status: updatedApplication.status,
      }
    })
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    )
  }
}
