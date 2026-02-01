import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { sendNewMessageEmail } from '@/utils/email'

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

    // Fetch conversation with all participant details for notifications
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.conversationId,
      },
      include: {
        employers: {
          select: {
            id: true,
            name: true,
            contactEmail: true,
          },
        },
        employees: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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

    if (isEmployerSending) {
      // Verify the current user belongs to the employer
      if (currentUser.employerId !== employerId) {
        return NextResponse.json(
          { error: 'You are not authorized to send messages for this organization' },
          { status: 403 }
        )
      }

      // Verify the employer is part of this conversation
      const isParticipant = conversation.employers.some(e => e.id === employerId)
      if (!isParticipant) {
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

      // Verify the employee is part of this conversation
      const isParticipant = conversation.employees.some(e => e.id === employeeId)
      if (!isParticipant) {
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

    // Send email notification to the recipient (fire-and-forget)
    if (isEmployerSending) {
      // Notify all employees in the conversation (typically just one candidate)
      const sender = conversation.employers.find(e => e.id === employerId)
      const senderName = sender?.name || 'An employer'

      for (const employee of conversation.employees) {
        if (employee.email) {
          const recipientName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'there'
          sendNewMessageEmail({
            recipientEmail: employee.email,
            recipientName,
            senderName,
            messagePreview: content,
            conversationId: params.conversationId,
            isEmployerRecipient: false,
          })
        }
      }
    } else if (isEmployeeSending) {
      // Notify all employers in the conversation (typically just one)
      const sender = conversation.employees.find(e => e.id === employeeId)
      const senderName = [sender?.firstName, sender?.lastName].filter(Boolean).join(' ') || 'A candidate'

      for (const employer of conversation.employers) {
        if (employer.contactEmail) {
          sendNewMessageEmail({
            recipientEmail: employer.contactEmail,
            recipientName: employer.name,
            senderName,
            messagePreview: content,
            conversationId: params.conversationId,
            isEmployerRecipient: true,
            employerId: employer.id,
          })
        }
      }
    }

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
