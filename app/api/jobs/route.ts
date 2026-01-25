import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { TradeCategory, JobType, JobStatus, PayType } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      // Basic Info
      title,
      description,
      jobType,
      status,

      // Role Requirements
      primaryTrade,
      requiredCertifications,
      minYearsExperience,
      maxYearsExperience,

      // Location
      city,
      state,
      zipCode,
      isRemote,

      // Compensation
      payType,
      payRangeMin,
      payRangeMax,

      // Benefits
      benefits,

      // Contact
      contactName,
      contactEmail,
      contactPhone,

      // Company
      companyDescription,

      // Relations
      employerId,
    } = body

    // Validate required fields
    if (!title || !description || !primaryTrade || !city || !state || !employerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the user belongs to this employer
    const employee = await prisma.employee.findFirst({
      where: {
        clerkId: userId,
        employerId: employerId,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'You do not have permission to post jobs for this company' },
        { status: 403 }
      )
    }

    // Create the job posting
    const jobPosting = await prisma.jobPosting.create({
      data: {
        title,
        description,
        jobType: jobType as JobType,
        status: (status as JobStatus) || 'DRAFT',

        primaryTrade: primaryTrade as TradeCategory,
        requiredCertifications: requiredCertifications || [],
        minYearsExperience: minYearsExperience ? parseInt(minYearsExperience) : null,
        maxYearsExperience: maxYearsExperience ? parseInt(maxYearsExperience) : null,

        city,
        state,
        zipCode: zipCode || null,
        isRemote: isRemote || false,

        payType: payType as PayType,
        payRangeMin: payRangeMin ? parseFloat(payRangeMin) : null,
        payRangeMax: payRangeMax ? parseFloat(payRangeMax) : null,

        benefits: benefits || [],

        contactName: contactName || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,

        companyDescription: companyDescription || null,

        employerId,
        postedById: employee.id,
      },
    })

    return NextResponse.json({ jobId: jobPosting.id }, { status: 201 })
  } catch (error) {
    console.error('Job posting error:', error)
    return NextResponse.json(
      { error: 'Failed to create job posting' },
      { status: 500 }
    )
  }
}

// GET - Fetch jobs for an employer
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const employerId = searchParams.get('employerId')

    if (!employerId) {
      return NextResponse.json(
        { error: 'Employer ID is required' },
        { status: 400 }
      )
    }

    // Verify the user belongs to this employer
    const employee = await prisma.employee.findFirst({
      where: {
        clerkId: userId,
        employerId: employerId,
      },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'You do not have permission to view jobs for this company' },
        { status: 403 }
      )
    }

    const jobs = await prisma.jobPosting.findMany({
      where: {
        employerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}
