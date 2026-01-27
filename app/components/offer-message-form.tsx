'use client'

import { sendMessage } from '@/utils/actions'

interface OfferMessageFormProps {
  setOpen: (open: boolean) => void
  candidate: {
    id: string
    firstName?: string | null
    lastName?: string | null
    employer?: {
      id: string
      name: string
    } | null
  }
  employer?: {
    id: string
    name: string
  } | null
}

export default function OfferMessageForm({
  setOpen,
  candidate,
  employer,
}: OfferMessageFormProps) {
  const displayEmployerName = candidate.employer?.name || employer?.name || 'Independent'

  return (
    <div className="flex flex-col">
      <form action={sendMessage}>
        <input type="hidden" name="candidateId" value={candidate.id} />

        <div className="flex flex-col mb-4">
          <label className="font-semibold">Candidate Name:</label>
          <span className="text-gray-700">
            {candidate.firstName} {candidate.lastName}
          </span>
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-semibold">Current Employer:</label>
          <span className="text-gray-700">{displayEmployerName}</span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="message" className="font-semibold mb-2">
            Message:
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6"
            placeholder="Introduce yourself and explain why you're interested in this candidate..."
            required
          />
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:col-start-2"
          >
            Send Message
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
