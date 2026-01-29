import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { JobStatus } from '@prisma/client'

interface RouteParams {
  params: { id: string }
}

// PATCH - Update job status (publish/unpublish)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the job first
    const existingJob = await prisma.jobPosting.findUnique({
      where: { id: params.id },
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Verify the user belongs to this employer
    const employee = await prisma.employee.findFirst({
      where: {
        clerkId: userId,
        employerId: existingJob.employerId,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'You do not have permission to update this job' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status } = body

    // Validate status
    const validStatuses: JobStatus[] = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'FILLED']
    if (!status || !validStatuses.includes(status as JobStatus)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: DRAFT, ACTIVE, PAUSED, CLOSED, FILLED' },
        { status: 400 }
      )
    }

    const updatedJob = await prisma.jobPosting.update({
      where: { id: params.id },
      data: { status: status as JobStatus },
    })

    return NextResponse.json({
      job: {
        id: updatedJob.id,
        status: updatedJob.status,
      }
    })
  } catch (error) {
    console.error('Error updating job status:', error)
    return NextResponse.json(
      { error: 'Failed to update job status' },
      { status: 500 }
    )
  }
}
