import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content, employerId } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
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

    // Verify the conversation exists and the employer is part of it
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.conversationId,
        employers: {
          some: {
            id: employerId,
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: currentUser.id,
        senderType: 'EMPLOYER',
        conversationId: params.conversationId,
      },
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: params.conversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      messageId: message.id,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
