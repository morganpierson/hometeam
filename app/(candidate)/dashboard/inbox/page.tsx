import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

// Messages need to be fresh - revalidate on each request
export const revalidate = 0

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function CandidateInbox() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const employee = await prisma.employee.findUnique({
    where: { clerkId: userId },
    include: {
      conversations: {
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          employers: {
            select: {
              id: true,
              name: true,
              logo: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
    },
  })

  if (!employee) {
    redirect('/new-user')
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Conversations with employers
        </p>
      </div>

      {/* Conversations List */}
      {employee.conversations.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {employee.conversations.map((conversation) => {
            const employer = conversation.employers[0]
            const lastMessage = conversation.messages[0]
            const isUnread = lastMessage && !lastMessage.readAt && lastMessage.senderId !== employee.id

            return (
              <Link
                key={conversation.id}
                href={`/dashboard/inbox/${conversation.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Company Logo */}
                <div className="relative flex-shrink-0">
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
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {isUnread && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-amber-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}`}>
                      {employer?.name || 'Unknown Company'}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTimeAgo(new Date(lastMessage.createdAt))}
                      </span>
                    )}
                  </div>
                  {employer?.city && employer?.state && (
                    <p className="text-xs text-gray-500 mb-1">
                      {employer.city}, {employer.state}
                    </p>
                  )}
                  {lastMessage && (
                    <p className={`text-sm truncate ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
                      {lastMessage.senderId === employee.id && (
                        <span className="text-gray-400">You: </span>
                      )}
                      {lastMessage.content}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <ChevronRightIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-lg mb-4">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            When employers reach out to you, their messages will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
