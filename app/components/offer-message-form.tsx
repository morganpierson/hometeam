'use client'

import { useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { sendMessage } from '@/utils/actions'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

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

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </>
      ) : (
        'Send Message'
      )}
    </button>
  )
}

export default function OfferMessageForm({
  setOpen,
  candidate,
  employer,
}: OfferMessageFormProps) {
  const displayEmployerName = candidate.employer?.name || employer?.name || 'Independent'
  const [state, formAction] = useFormState(sendMessage, { success: false })
  const formRef = useRef<HTMLFormElement>(null)

  // Close modal on success after a short delay
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        setOpen(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state.success, setOpen])

  // Show success state
  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-sm text-gray-500 text-center">
          Your message has been sent to {candidate.firstName} {candidate.lastName}.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="candidateId" value={candidate.id} />

        {state.error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

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
          <SubmitButton />
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
