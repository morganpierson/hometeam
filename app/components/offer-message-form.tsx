import { sendMessage } from '@/utils/actions'
import { currentUser } from '@clerk/nextjs'

export default async function OfferMessageForm({
  setOpen,
  candidate,
  company,
}) {
  //create a form that allows an admin to send a message to another company about a candidate

  return (
    <div className="flex flex-col ">
      <form action={sendMessage}>
        <input
          type="hidden"
          name="receivingCompany"
          value={candidate.company.id}
        />
        <input type="hidden" name="candidate" value={candidate.id} />
        <div className="flex flex-col mb-4">
          <label className="font-semibold">Candidate Name:</label>
          {/* <input type="text" name="name" className="rounded-sm" /> */}
          {candidate.firstName} {candidate.lastName}
        </div>
        <div className="flex flex-col mb-4">
          <label className="font-semibold">Company Name:</label>
          {/* <input type="text" name="company" /> */}
          {candidate.company.name}
        </div>
        <div className="flex flex-col">
          <label>Message:</label>
          <input
            type="text-area"
            name="message"
            className="h-24 border border-grey-500 rounded-md px-2 py-0 align-top justify-start"
            required
          />
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
          >
            Send
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
