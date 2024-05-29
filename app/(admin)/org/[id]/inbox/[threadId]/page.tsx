import { fetchThreadDetails } from '@/utils/actions'
import Image from 'next/image'

export default async function MessageDetails({ params }: { params: any }) {
  const threadDetails = await fetchThreadDetails(params.threadId)
  console.log('THREAD DETAILS ', threadDetails)
  return (
    <div className="flex flex-col justify-end">
      {threadDetails?.messages.map((message) => (
        <div className="flex items-center justify-between border-b-gray-300 border-b-2">
          <div className="flex px-8">
            <Image
              src={message.sendingCompany.logo}
              height={40}
              width={40}
              className="rounded-full min-h-12 min-w-12 mr-4 mb-4"
            />
            <div className="flex flex-col">
              <p className="font-medium text-md">
                {message.sendingCompany.name}
              </p>
              <p className="font-light text-sm">{message.message}</p>
            </div>
          </div>
          <div className="mb-4 px-8">
            <p className="font-light text-xs text-gray-700">
              {message.createdAt.toDateString()}
            </p>
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-4 mt-4 pr-8">
        <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Delete Thread
        </button>
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Reply
        </button>
      </div>
    </div>
  )
}
