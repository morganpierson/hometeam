import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircleIcon,
  ArrowLeftIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'
import CandidateMessageInput from './message-input'

// Messages need to be fresh - revalidate on each request
export const revalidate = 0

function formatMessageTime(date: Date): string {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isYesterday) {
    return `Yesterday ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function CandidateConversationThread({
  params,
}: {
  params: { threadId: string }
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const employee = await prisma.employee.findUnique({
    where: { clerkId: userId },
  })

  if (!employee) {
    redirect('/new-user')
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: params.threadId,
      employees: {
        some: { id: employee.id },
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      employers: {
        select: {
          id: true,
          name: true,
          logo: true,
          city: true,
          state: true,
          description: true,
        },
      },
    },
  })

  if (!conversation) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-500">Conversation not found</p>
        <Link
          href="/dashboard/inbox"
          className="text-amber-600 hover:text-amber-700 mt-4 inline-block"
        >
          Back to messages
        </Link>
      </div>
    )
  }

  const employer = conversation.employers[0]

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: {
      conversationId: params.threadId,
      senderId: { not: employee.id },
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  })

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/inbox"
            className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-3 flex-1">
            {employer?.logo ? (
              <Image
                src={employer.logo}
                alt={employer.name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}

            <div>
              <h2 className="font-semibold text-gray-900">{employer?.name || 'Unknown Company'}</h2>
              {employer?.city && employer?.state && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  {employer.city}, {employer.state}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-gray-50 border-x border-gray-200 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message) => {
          const isOwnMessage = message.senderId === employee.id

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  isOwnMessage ? 'flex-row-reverse' : ''
                }`}
              >
                {!isOwnMessage && (
                  <div className="flex-shrink-0">
                    {employer?.logo ? (
                      <Image
                        src={employer.logo}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-amber-500 text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p
                    className={`text-xs text-gray-400 mt-1 ${
                      isOwnMessage ? 'text-right' : ''
                    }`}
                  >
                    {formatMessageTime(new Date(message.createdAt))}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Message Input */}
      <CandidateMessageInput
        conversationId={params.threadId}
        employeeId={employee.id}
      />
    </div>
  )
}
