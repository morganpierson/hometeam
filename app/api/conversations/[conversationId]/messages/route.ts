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

    const { content, employerId, employeeId, senderType } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Get the current user
    const currentUser = await prisma.employee.findFirst({
      where: { clerkId: userId },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Determine if this is an employer or employee sending
    const isEmployerSending = employerId && senderType === 'EMPLOYER'
    const isEmployeeSending = employeeId && senderType === 'EMPLOYEE'

    if (isEmployerSending) {
      // Verify the current user belongs to the employer
      if (currentUser.employerId !== employerId) {
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
            some: { id: employerId },
          },
        },
      })

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }
    } else if (isEmployeeSending) {
      // Verify the current user is the employee
      if (currentUser.id !== employeeId) {
        return NextResponse.json(
          { error: 'You are not authorized to send messages as this user' },
          { status: 403 }
        )
      }

      // Verify the conversation exists and the employee is part of it
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: params.conversationId,
          employees: {
            some: { id: employeeId },
          },
        },
      })

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid sender information' },
        { status: 400 }
      )
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: currentUser.id,
        senderType: isEmployerSending ? 'EMPLOYER' : 'EMPLOYEE',
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
