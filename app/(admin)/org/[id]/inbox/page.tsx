import { fetchOrgData, fetchMessageThreads } from '@/utils/actions'
import Image from 'next/image'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const items = [
  { id: 1 },
  // More items...
]

export default async function Inbox({ params }: { params: any }) {
  const orgData = await fetchOrgData()
  const messageThreads = await fetchMessageThreads(params.id)

  return (
    <div className="border-b border-gray-200 pb-5 sm:pb-0">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Offers Inbox
      </h3>
      <div className="mt-3 sm:mt-4">
        <ul role="list" className="divide-y divide-gray-200">
          {messageThreads.map((thread) => (
            <li key={thread.id} className="py-4">
              {thread.messages.map((message) => (
                <div>
                  <div className="flex items-center gap-4 mb-3 justify-between px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-4 items-end">
                        {message.sendingCompany.logo ? (
                          <Image
                            src={message.sendingCompany.logo}
                            alt="Profile Picture"
                            width={64}
                            height={64}
                            className="rounded-full min-h-16 min-w-16"
                          />
                        ) : (
                          <UserCircleIcon />
                        )}
                        {thread.offer.user?.profileImage ? (
                          <Image
                            src={thread.offer.user.profileImage}
                            alt="Profile Picture"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <UserCircleIcon />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xl font-semibold">
                          {message.sendingCompany.name}
                        </p>
                        <p>{thread.offer.user.firstName}</p>
                      </div>
                      <p className="ml-16 text-gray-600">{message.message}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Delete
                      </button>
                      <Link
                        href={`/org/${orgData?.id}/inbox/${thread.id}`}
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
