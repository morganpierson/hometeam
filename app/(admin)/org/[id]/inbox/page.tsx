import { fetchConversations } from '@/utils/actions'
import { getEmployeeByClerkID } from '@/utils/auth'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

// Cache inbox list for 1 minute - messages need freshness
export const revalidate = 60

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

export default async function Inbox({ params }: { params: { id: string } }) {
  const conversations = await fetchConversations(params.id)
  const currentUser = await getEmployeeByClerkID()

  // Sort conversations by most recent message
  const sortedConversations = [...conversations].sort((a, b) => {
    const aDate = a.messages[0]?.createdAt || a.createdAt
    const bDate = b.messages[0]?.createdAt || b.createdAt
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  })

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your conversations with candidates
        </p>
      </div>

      {/* Conversations List */}
      {sortedConversations.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {sortedConversations.map((conversation) => {
            // Get the other participant (employee/candidate)
            const candidate = conversation.employees[0]
            const lastMessage = conversation.messages[0]
            const isUnread = lastMessage && !lastMessage.readAt && lastMessage.senderId !== currentUser.id

            const candidateName = candidate
              ? [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || 'Unknown'
              : 'Unknown Candidate'

            return (
              <Link
                key={conversation.id}
                href={`/org/${params.id}/inbox/${conversation.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  {candidate?.profileImage ? (
                    <Image
                      src={candidate.profileImage}
                      alt={candidateName}
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
                    <span className="absolute top-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}`}>
                      {candidateName}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTimeAgo(new Date(lastMessage.createdAt))}
                      </span>
                    )}
                  </div>
                  {candidate?.tradeCategory && (
                    <p className="text-xs text-gray-500 mb-1">
                      {candidate.tradeCategory.replace(/_/g, ' ')}
                    </p>
                  )}
                  {lastMessage && (
                    <p className={`text-sm truncate ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
                      {lastMessage.senderId === currentUser.id && (
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
            When you start a conversation with a candidate or receive a message, it will appear here.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
          >
            Find Candidates
          </Link>
        </div>
      )}
    </div>
  )
}
