import { fetchConversationDetails } from '@/utils/actions'
import { getEmployeeByClerkID } from '@/utils/auth'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircleIcon,
  ArrowLeftIcon,
  MapPinIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline'
import MessageInput from './message-input'

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

export default async function ConversationThread({
  params,
}: {
  params: { id: string; threadId: string }
}) {
  const conversationDetails = await fetchConversationDetails(params.threadId)
  const currentUser = await getEmployeeByClerkID()

  if (!conversationDetails) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-500">Conversation not found</p>
        <Link
          href={`/org/${params.id}/inbox`}
          className="text-emerald-600 hover:text-emerald-700 mt-4 inline-block"
        >
          Back to messages
        </Link>
      </div>
    )
  }

  // Get the candidate (employee in the conversation)
  const candidate = conversationDetails.employees[0]
  const candidateName = candidate
    ? [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || 'Unknown'
    : 'Unknown Candidate'

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/org/${params.id}/inbox`}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>

          <Link
            href={candidate ? `/marketplace/user/${candidate.id}` : '#'}
            className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
          >
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

            <div>
              <h2 className="font-semibold text-gray-900">{candidateName}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {candidate?.tradeCategory && (
                  <span className="flex items-center gap-1">
                    <BriefcaseIcon className="h-3 w-3" />
                    {candidate.tradeCategory.replace(/_/g, ' ')}
                  </span>
                )}
                {candidate?.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3" />
                    {candidate.location}
                  </span>
                )}
              </div>
            </div>
          </Link>

          {candidate && (
            <Link
              href={`/marketplace/user/${candidate.id}`}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View Profile
            </Link>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-gray-50 border-x border-gray-200 overflow-y-auto p-4 space-y-4">
        {conversationDetails.messages.map((message) => {
          const isOwnMessage = message.senderId === currentUser.id
          const senderEmployee = conversationDetails.employees.find(
            (emp) => emp.id === message.senderId
          )

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
                    {senderEmployee?.profileImage ? (
                      <Image
                        src={senderEmployee.profileImage}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-emerald-600 text-white rounded-br-md'
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
      <MessageInput
        conversationId={params.threadId}
        employerId={params.id}
      />
    </div>
  )
}
