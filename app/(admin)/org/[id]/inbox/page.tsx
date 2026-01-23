import { fetchEmployerData, fetchConversations } from '@/utils/actions'
import Image from 'next/image'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default async function Inbox({ params }: { params: { id: string } }) {
  const employerData = await fetchEmployerData()
  const conversations = await fetchConversations(params.id)

  return (
    <div className="border-b border-gray-200 pb-5 sm:pb-0">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Hire Offers Inbox
      </h3>
      <div className="mt-3 sm:mt-4">
        <ul role="list" className="divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <li key={conversation.id} className="py-4">
              {conversation.messages.map((message) => (
                <div key={message.id}>
                  <div className="flex items-center gap-4 mb-3 justify-between px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-4 items-end">
                        {conversation.employers[0]?.logo ? (
                          <Image
                            src={conversation.employers[0].logo}
                            alt="Employer Logo"
                            width={64}
                            height={64}
                            className="rounded-full min-h-16 min-w-16"
                          />
                        ) : (
                          <UserCircleIcon className="h-16 w-16 text-gray-400" />
                        )}
                        {conversation.hireOffer?.employee?.profileImage ? (
                          <Image
                            src={conversation.hireOffer.employee.profileImage}
                            alt="Employee Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xl font-semibold">
                          {conversation.employers[0]?.name || 'Unknown Employer'}
                        </p>
                        <p>{conversation.hireOffer?.employee?.firstName}</p>
                      </div>
                      <p className="ml-16 text-gray-600">{message.content}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Delete
                      </button>
                      <Link
                        href={`/org/${employerData?.id}/inbox/${conversation.id}`}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
