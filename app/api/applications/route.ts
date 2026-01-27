import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { jobId, message } = await request.json()

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Get the current user (candidate)
    const candidate = await prisma.employee.findUnique({
      where: { clerkId: userId },
    })

    if (!candidate) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get the job posting with employer info
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: jobId },
      include: {
        employer: true,
      },
    })

    if (!jobPosting) {
      return NextResponse.json(
        { error: 'Job posting not found' },
        { status: 404 }
      )
    }

    // Check if the candidate has already applied to this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobPostingId: jobId,
        applicantId: candidate.id,
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      )
    }

    // Create conversation and application in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the conversation first
      const conversation = await tx.conversation.create({
        data: {
          employers: {
            connect: { id: jobPosting.employerId },
          },
          employees: {
            connect: { id: candidate.id },
          },
          messages: {
            create: {
              content: message || `Hi! I'm interested in the ${jobPosting.title} position and would love to discuss the opportunity with you.`,
              senderId: candidate.id,
              senderType: 'EMPLOYEE',
            },
          },
        },
      })

      // Create the job application with link to conversation
      const application = await tx.jobApplication.create({
        data: {
          jobPostingId: jobId,
          applicantId: candidate.id,
          coverLetter: message || null,
          conversationId: conversation.id,
          status: 'pending',
        },
      })

      return { application, conversation }
    })

    return NextResponse.json({
      success: true,
      applicationId: result.application.id,
      conversationId: result.conversation.id,
    })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

// GET - Fetch applications for the current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the current user
    const employee = await prisma.employee.findUnique({
      where: { clerkId: userId },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Fetch all applications for this candidate
    const applications = await prisma.jobApplication.findMany({
      where: {
        applicantId: employee.id,
      },
      include: {
        jobPosting: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                logo: true,
                city: true,
                state: true,
              },
            },
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}
