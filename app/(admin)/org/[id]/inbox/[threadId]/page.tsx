import { fetchConversationDetails } from '@/utils/actions'
import Image from 'next/image'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default async function MessageDetails({ params }: { params: { threadId: string } }) {
  const conversationDetails = await fetchConversationDetails(params.threadId)
  console.log('CONVERSATION DETAILS ', conversationDetails)

  return (
    <div className="flex flex-col justify-end">
      {conversationDetails?.messages.map((message) => {
        // Find the sender info based on senderId
        const senderEmployee = conversationDetails.employees.find(
          (emp) => emp.id === message.senderId
        )
        const senderEmployer = conversationDetails.employers.find(
          (emp) => emp.id === message.senderId
        )

        const senderName = senderEmployee
          ? `${senderEmployee.firstName} ${senderEmployee.lastName}`
          : senderEmployer?.name || 'Unknown'
        const senderImage = senderEmployee?.profileImage || senderEmployer?.logo

        return (
          <div key={message.id} className="flex items-center justify-between border-b-gray-300 border-b-2">
            <div className="flex px-8">
              {senderImage ? (
                <Image
                  src={senderImage}
                  height={40}
                  width={40}
                  alt="Sender"
                  className="rounded-full min-h-12 min-w-12 mr-4 mb-4"
                />
              ) : (
                <UserCircleIcon className="h-12 w-12 text-gray-400 mr-4 mb-4" />
              )}
              <div className="flex flex-col">
                <p className="font-medium text-md">{senderName}</p>
                <p className="font-light text-sm">{message.content}</p>
              </div>
            </div>
            <div className="mb-4 px-8">
              <p className="font-light text-xs text-gray-700">
                {message.createdAt.toDateString()}
              </p>
            </div>
          </div>
        )
      })}
      <div className="flex justify-end gap-4 mt-4 pr-8">
        <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Delete Conversation
        </button>
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Reply
        </button>
      </div>
    </div>
  )
}
