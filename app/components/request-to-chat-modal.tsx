'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import {
  XMarkIcon,
  UserCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface Certification {
  id: string
  name: string
  verified: boolean
}

interface Prospect {
  id: string
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
  tradeCategory?: string | null
  yearsExperience?: number | null
  location?: string | null
  isBackgroundChecked?: boolean
  isInsured?: boolean
  bio?: string | null
  resumeSummary?: string | null
  hourlyRate?: number | null
  certifications?: Certification[]
}

interface RequestToChatModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  prospect: Prospect
  employerId: string
}

const tradeCategoryLabels: Record<string, string> = {
  ELECTRICIAN: 'Electrician',
  PLUMBER: 'Plumber',
  HVAC: 'HVAC Technician',
  CARPENTER: 'Carpenter',
  ROOFER: 'Roofer',
  PAINTER: 'Painter',
  MASON: 'Mason',
  WELDER: 'Welder',
  GENERAL_CONTRACTOR: 'General Contractor',
  LANDSCAPER: 'Landscaper',
  CONCRETE: 'Concrete Specialist',
  DRYWALL: 'Drywall Installer',
  FLOORING: 'Flooring Specialist',
  GLAZIER: 'Glazier',
  INSULATION: 'Insulation Installer',
  IRONWORKER: 'Ironworker',
  SHEET_METAL: 'Sheet Metal Worker',
  TILE_SETTER: 'Tile Setter',
  OTHER: 'Trade Professional',
}

export default function RequestToChatModal({
  open,
  setOpen,
  prospect,
  employerId,
}: RequestToChatModalProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fullName = [prospect.firstName, prospect.lastName]
    .filter(Boolean)
    .join(' ') || 'Anonymous'

  const tradeLabel = prospect.tradeCategory
    ? tradeCategoryLabels[prospect.tradeCategory]
    : 'Trade Professional'

  const handleSend = async () => {
    if (!message.trim()) return

    setIsSending(true)
    setError(null)

    try {
      // TODO: Implement API call to send message/create conversation
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerId,
          employeeId: prospect.id,
          message: message.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setMessage('')
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Request to Chat
                  </Dialog.Title>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  {/* Left Column - Candidate Summary */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-start gap-4 mb-6">
                      {prospect.profileImage ? (
                        <Image
                          src={prospect.profileImage}
                          alt={fullName}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserCircleIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xl font-semibold text-gray-900">{fullName}</h4>
                          {prospect.isBackgroundChecked && (
                            <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{tradeLabel}</p>
                        {prospect.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPinIcon className="h-4 w-4" />
                            {prospect.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bio / Looking for */}
                    {(prospect.bio || prospect.resumeSummary) && (
                      <div className="mb-6">
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          About
                        </h5>
                        <p className="text-sm text-gray-700 line-clamp-4">
                          {prospect.bio || prospect.resumeSummary}
                        </p>
                      </div>
                    )}

                    {/* Experience */}
                    <div className="mb-6">
                      <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Experience
                      </h5>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-white border border-gray-200 flex items-center justify-center">
                          <BriefcaseIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tradeLabel}</p>
                          <p className="text-xs text-gray-500">
                            {prospect.yearsExperience
                              ? `${prospect.yearsExperience} years experience`
                              : 'Experience not specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    {prospect.certifications && prospect.certifications.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Certifications
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {prospect.certifications.map((cert) => (
                            <span
                              key={cert.id}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                                cert.verified
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {cert.verified && <CheckBadgeIcon className="h-3.5 w-3.5" />}
                              {cert.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-2">
                      {prospect.hourlyRate && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-white border border-gray-200 text-gray-700">
                          <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                          ${prospect.hourlyRate}/hr
                        </span>
                      )}
                      {prospect.isInsured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircleIcon className="h-4 w-4" />
                          Insured
                        </span>
                      )}
                      {prospect.isBackgroundChecked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircleIcon className="h-4 w-4" />
                          Background Checked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Message Input */}
                  <div className="p-6 flex flex-col">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">
                      Send a message to {prospect.firstName || 'this candidate'}
                    </h5>
                    <p className="text-sm text-gray-500 mb-4">
                      Introduce yourself and let them know why you&apos;re interested in connecting.
                    </p>

                    {error && (
                      <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Hi ${prospect.firstName || 'there'}, I came across your profile and I'm impressed by your experience...`}
                      rows={8}
                      className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm"
                    />

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSend}
                        disabled={isSending || !message.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
