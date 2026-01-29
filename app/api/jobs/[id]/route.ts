import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { TradeCategory, JobType, JobStatus, PayType } from '@prisma/client'

interface RouteParams {
  params: { id: string }
}

// GET - Fetch a single job
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.jobPosting.findUnique({
      where: { id: params.id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Verify the user belongs to this employer
    const employee = await prisma.employee.findFirst({
      where: {
        clerkId: userId,
        employerId: job.employerId,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'You do not have permission to view this job' },
        { status: 403 }
      )
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// PATCH - Update a job
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
        { error: 'You do not have permission to edit this job' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      jobType,
      status,
      primaryTrade,
      requiredCertifications,
      minYearsExperience,
      maxYearsExperience,
      city,
      state,
      zipCode,
      isRemote,
      payType,
      payRangeMin,
      payRangeMax,
      benefits,
      contactName,
      contactEmail,
      contactPhone,
      companyDescription,
    } = body

    // Build update data object with only provided fields
    const updateData: Record<string, unknown> = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (jobType !== undefined) updateData.jobType = jobType as JobType
    if (status !== undefined) updateData.status = status as JobStatus
    if (primaryTrade !== undefined) updateData.primaryTrade = primaryTrade as TradeCategory
    if (requiredCertifications !== undefined) updateData.requiredCertifications = requiredCertifications
    if (minYearsExperience !== undefined) updateData.minYearsExperience = minYearsExperience ? parseInt(minYearsExperience) : null
    if (maxYearsExperience !== undefined) updateData.maxYearsExperience = maxYearsExperience ? parseInt(maxYearsExperience) : null
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (zipCode !== undefined) updateData.zipCode = zipCode || null
    if (isRemote !== undefined) updateData.isRemote = isRemote
    if (payType !== undefined) updateData.payType = payType as PayType
    if (payRangeMin !== undefined) updateData.payRangeMin = payRangeMin ? parseFloat(payRangeMin) : null
    if (payRangeMax !== undefined) updateData.payRangeMax = payRangeMax ? parseFloat(payRangeMax) : null
    if (benefits !== undefined) updateData.benefits = benefits
    if (contactName !== undefined) updateData.contactName = contactName || null
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail || null
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone || null
    if (companyDescription !== undefined) updateData.companyDescription = companyDescription || null

    const updatedJob = await prisma.jobPosting.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ job: updatedJob })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a job
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
        { error: 'You do not have permission to delete this job' },
        { status: 403 }
      )
    }

    // Delete the job (this will cascade delete applications if configured in schema)
    await prisma.jobPosting.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
