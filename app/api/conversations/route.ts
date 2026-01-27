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

    const { employerId, employeeId, message } = await request.json()

    if (!employerId || !employeeId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the current user belongs to the employer
    const currentUser = await prisma.employee.findFirst({
      where: {
        clerkId: userId,
        employerId: employerId,
      },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'You are not authorized to send messages for this organization' },
        { status: 403 }
      )
    }

    // Check if a conversation already exists between this employer and employee
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { employers: { some: { id: employerId } } },
          { employees: { some: { id: employeeId } } },
        ],
      },
    })

    let conversation

    if (existingConversation) {
      // Add message to existing conversation
      conversation = existingConversation

      await prisma.message.create({
        data: {
          content: message,
          senderId: currentUser.id,
          senderType: 'EMPLOYER',
          conversationId: conversation.id,
        },
      })

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      })
    } else {
      // Create new conversation with initial message
      conversation = await prisma.conversation.create({
        data: {
          employers: {
            connect: { id: employerId },
          },
          employees: {
            connect: { id: employeeId },
          },
          messages: {
            create: {
              content: message,
              senderId: currentUser.id,
              senderType: 'EMPLOYER',
            },
          },
        },
        include: {
          messages: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
