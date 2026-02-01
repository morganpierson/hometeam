'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircleIcon,
  MapPinIcon,
  ClockIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  CheckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'

interface Applicant {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  profileImage: string | null
  tradeCategory: string | null
  yearsExperience: number | null
  location: string | null
  hourlyRate: number | string | null
  isBackgroundChecked: boolean
  isInsured: boolean
  bio: string | null
  resume: string | null
  resumeSummary: string | null
  phone: string | null
}

interface Application {
  id: string
  status: string
  coverLetter: string | null
  createdAt: string | Date
  applicant: Applicant
  conversation: {
    id: string
    messages: { readAt: string | null; senderType: string }[]
  } | null
}

interface ApplicantsContentProps {
  applications: Application[]
  orgId: string
  jobId: string
  jobTitle: string
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  reviewing: { bg: 'bg-blue-50', text: 'text-blue-700' },
  interviewed: { bg: 'bg-purple-50', text: 'text-purple-700' },
  offered: { bg: 'bg-green-50', text: 'text-green-700' },
  hired: { bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700' },
}

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  reviewing: 'Under Review',
  interviewed: 'Interviewed',
  offered: 'Offer Extended',
  hired: 'Hired',
  rejected: 'Not Selected',
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

function formatTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}

export default function ApplicantsContent({
  applications,
  orgId,
  jobId,
  jobTitle,
}: ApplicantsContentProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'resume'>('profile')
  const [isUpdating, setIsUpdating] = useState(false)

  const selectedIndex = selectedApplication
    ? applications.findIndex((a) => a.id === selectedApplication.id)
    : -1

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedApplication(applications[selectedIndex - 1])
    }
  }

  const handleNext = () => {
    if (selectedIndex < applications.length - 1) {
      setSelectedApplication(applications[selectedIndex + 1])
    }
  }

  const handleAccept = async () => {
    if (!selectedApplication) return
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/applications/${selectedApplication.id}/accept`, {
        method: 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        // Redirect to the conversation
        window.location.href = `/org/${orgId}/inbox/${data.conversationId}`
      }
    } catch (error) {
      console.error('Error accepting application:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async () => {
    if (!selectedApplication) return
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/applications/${selectedApplication.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })
      if (response.ok) {
        setSelectedApplication(null)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error rejecting application:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      {/* Applicant Cards */}
      <div className="space-y-4">
        {applications.map((application) => {
          const applicant = application.applicant
          const status = statusColors[application.status] || statusColors.pending

          return (
            <div
              key={application.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {applicant.profileImage ? (
                    <Image
                      src={applicant.profileImage}
                      alt={`${applicant.firstName} ${applicant.lastName}`}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {applicant.firstName} {applicant.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {applicant.tradeCategory
                        ? tradeCategoryLabels[applicant.tradeCategory] || applicant.tradeCategory
                        : 'Trade Professional'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      {applicant.location && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          {applicant.location}
                        </span>
                      )}
                      {applicant.yearsExperience && (
                        <span>{applicant.yearsExperience} years exp.</span>
                      )}
                      {applicant.hourlyRate && (
                        <span className="text-green-600 font-medium">
                          ${Number(applicant.hourlyRate).toFixed(0)}/hr
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        Applied {formatTimeAgo(application.createdAt)}
                      </span>
                    </div>

                    {/* Trust badges */}
                    <div className="flex gap-2 mt-2">
                      {applicant.isBackgroundChecked && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded">
                          Background Checked
                        </span>
                      )}
                      {applicant.isInsured && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                          Insured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                  >
                    {statusLabels[application.status] || application.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedApplication(application)
                      setActiveTab('profile')
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <DocumentTextIcon className="h-4 w-4" />
                    View Application
                  </button>
                </div>
              </div>

              {application.coverLetter && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium text-gray-700">Application message: </span>
                    {application.coverLetter}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Slider Drawer */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 transition-opacity"
            onClick={() => setSelectedApplication(null)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <div className="w-screen max-w-2xl">
              <div className="flex h-full flex-col bg-white shadow-xl">
                {/* Header with navigation */}
                <div className="border-b border-gray-200">
                  <div className="flex items-center justify-between px-6 py-4">
                    <button
                      onClick={handlePrevious}
                      disabled={selectedIndex === 0}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      Previous applicant
                    </button>

                    <span className="text-sm font-medium text-gray-900">
                      {jobTitle}: {selectedIndex + 1} of {applications.length}
                    </span>

                    <button
                      onClick={handleNext}
                      disabled={selectedIndex === applications.length - 1}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next applicant
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-6 px-6">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'profile'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('resume')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'resume'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Resume
                    </button>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      {/* Applicant Header */}
                      <div className="flex items-start gap-4">
                        {selectedApplication.applicant.profileImage ? (
                          <Image
                            src={selectedApplication.applicant.profileImage}
                            alt={`${selectedApplication.applicant.firstName} ${selectedApplication.applicant.lastName}`}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserCircleIcon className="h-14 w-14 text-gray-400" />
                          </div>
                        )}

                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedApplication.applicant.firstName}{' '}
                            {selectedApplication.applicant.lastName}
                          </h2>
                          <p className="text-gray-600">
                            {selectedApplication.applicant.tradeCategory
                              ? tradeCategoryLabels[selectedApplication.applicant.tradeCategory] ||
                                selectedApplication.applicant.tradeCategory
                              : 'Trade Professional'}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            {selectedApplication.applicant.location && (
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4" />
                                {selectedApplication.applicant.location}
                              </span>
                            )}
                            {selectedApplication.applicant.yearsExperience && (
                              <span>
                                {selectedApplication.applicant.yearsExperience} years experience
                              </span>
                            )}
                          </div>

                          {/* Trust badges */}
                          <div className="flex gap-2 mt-3">
                            {selectedApplication.applicant.isBackgroundChecked && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded">
                                <ShieldCheckIcon className="h-3.5 w-3.5" />
                                Background Checked
                              </span>
                            )}
                            {selectedApplication.applicant.isInsured && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                Insured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Application Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Applied</span>
                          <span className="text-sm text-gray-600">
                            {formatTimeAgo(selectedApplication.createdAt)}
                          </span>
                        </div>
                        {selectedApplication.applicant.hourlyRate && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Desired Rate</span>
                            <span className="text-sm font-semibold text-green-600">
                              ${Number(selectedApplication.applicant.hourlyRate).toFixed(0)}/hr
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cover Letter / Application Message */}
                      {selectedApplication.coverLetter && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            Application Message
                          </h3>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedApplication.coverLetter}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      {selectedApplication.applicant.bio && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedApplication.applicant.bio}
                          </p>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Contact Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          {selectedApplication.applicant.email && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Email:</span>
                              <a
                                href={`mailto:${selectedApplication.applicant.email}`}
                                className="text-amber-600 hover:underline"
                              >
                                {selectedApplication.applicant.email}
                              </a>
                            </div>
                          )}
                          {selectedApplication.applicant.phone && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Phone:</span>
                              <a
                                href={`tel:${selectedApplication.applicant.phone}`}
                                className="text-amber-600 hover:underline"
                              >
                                {selectedApplication.applicant.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'resume' && (
                    <div className="space-y-6">
                      {selectedApplication.applicant.resumeSummary ? (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Resume Summary
                          </h3>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedApplication.applicant.resumeSummary}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {selectedApplication.applicant.resume ? (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Resume Document
                          </h3>
                          <a
                            href={selectedApplication.applicant.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                          >
                            <DocumentTextIcon className="h-5 w-5" />
                            View Resume
                          </a>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">No resume uploaded</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer with actions */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Status:{' '}
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[selectedApplication.status]?.bg || 'bg-gray-100'
                        } ${statusColors[selectedApplication.status]?.text || 'text-gray-700'}`}
                      >
                        {statusLabels[selectedApplication.status] || selectedApplication.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleReject}
                        disabled={isUpdating || selectedApplication.status === 'rejected'}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={handleAccept}
                        disabled={isUpdating || selectedApplication.status === 'rejected'}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckIcon className="h-4 w-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
