import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { sendApplicationAcceptedEmail } from '@/utils/email'

interface RouteParams {
  params: { id: string }
}

// POST - Accept a candidate and create/return conversation
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the application with job posting and applicant info
    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            employerId: true,
            employer: {
              select: {
                name: true,
              },
            },
          },
        },
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        conversation: true,
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
        { error: 'You do not have permission to accept this application' },
        { status: 403 }
      )
    }

    // If conversation already exists, just return it
    if (application.conversation) {
      // Update status to reviewing if still pending and send notification
      if (application.status === 'pending') {
        await prisma.jobApplication.update({
          where: { id: params.id },
          data: { status: 'reviewing' },
        })

        // Send email notification to candidate (fire-and-forget)
        if (application.applicant.email) {
          const candidateName = [application.applicant.firstName, application.applicant.lastName].filter(Boolean).join(' ') || 'Candidate'
          sendApplicationAcceptedEmail({
            candidateEmail: application.applicant.email,
            candidateName,
            employerName: application.jobPosting.employer.name,
            jobTitle: application.jobPosting.title,
            conversationId: application.conversation.id,
          })
        }
      }

      return NextResponse.json({
        conversationId: application.conversation.id,
        isNew: false,
      })
    }

    // Create a new conversation
    const conversation = await prisma.$transaction(async (tx) => {
      // Create the conversation
      const newConversation = await tx.conversation.create({
        data: {
          employers: {
            connect: { id: application.jobPosting.employerId },
          },
          employees: {
            connect: { id: application.applicant.id },
          },
          messages: {
            create: {
              content: `Thank you for your interest in the ${application.jobPosting.title} position! We'd like to learn more about you.`,
              senderId: employee.id,
              senderType: 'EMPLOYER',
            },
          },
        },
      })

      // Link the conversation to the application and update status
      await tx.jobApplication.update({
        where: { id: params.id },
        data: {
          conversationId: newConversation.id,
          status: 'reviewing',
        },
      })

      return newConversation
    })

    // Send email notification to candidate (fire-and-forget)
    if (application.applicant.email) {
      const candidateName = [application.applicant.firstName, application.applicant.lastName].filter(Boolean).join(' ') || 'Candidate'
      sendApplicationAcceptedEmail({
        candidateEmail: application.applicant.email,
        candidateName,
        employerName: application.jobPosting.employer.name,
        jobTitle: application.jobPosting.title,
        conversationId: conversation.id,
      })
    }

    return NextResponse.json({
      conversationId: conversation.id,
      isNew: true,
    })
  } catch (error) {
    console.error('Error accepting application:', error)
    return NextResponse.json(
      { error: 'Failed to accept application' },
      { status: 500 }
    )
  }
}
