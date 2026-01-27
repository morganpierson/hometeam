'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import {
  XMarkIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline'

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

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  TEMPORARY: 'Temporary',
}

const payTypeLabels: Record<string, string> = {
  HOURLY: 'hr',
  SALARY: 'yr',
  PROJECT_BASED: 'project',
}

interface Job {
  id: string
  title: string
  description: string
  jobType: string
  primaryTrade: string
  city: string
  state: string
  isRemote: boolean
  payType: string
  payRangeMin: number | null
  payRangeMax: number | null
  minYearsExperience: number | null
  createdAt: string
  requiredCertifications?: string[]
  benefits?: string[]
  employer: {
    id: string
    name: string
    logo: string | null
    description: string | null
    size: string | null
    city: string | null
    state: string | null
  }
}

interface JobDetailModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
  matchesTrade?: boolean
}

function formatPay(payRangeMin: unknown, payRangeMax: unknown, payType: string): string {
  const min = payRangeMin ? Number(payRangeMin) : null
  const max = payRangeMax ? Number(payRangeMax) : null

  if (!min && !max) return 'Competitive pay'

  const suffix = payTypeLabels[payType] || ''

  if (payType === 'HOURLY') {
    if (min && max) {
      return `$${min.toFixed(0)} - $${max.toFixed(0)}/${suffix}`
    }
    return min ? `$${min.toFixed(0)}/${suffix}` : `Up to $${max?.toFixed(0)}/${suffix}`
  }

  const minK = min ? Math.round(min / 1000) : null
  const maxK = max ? Math.round(max / 1000) : null

  if (minK && maxK) {
    return `$${minK}k - $${maxK}k/${suffix}`
  }
  return minK ? `$${minK}k/${suffix}` : `Up to $${maxK}k/${suffix}`
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Posted today'
  if (diffInDays === 1) return 'Posted yesterday'
  if (diffInDays < 7) return `Posted ${diffInDays} days ago`
  if (diffInDays < 30) return `Posted ${Math.floor(diffInDays / 7)} weeks ago`
  return `Posted ${Math.floor(diffInDays / 30)} months ago`
}

export default function JobDetailModal({ job, isOpen, onClose, matchesTrade }: JobDetailModalProps) {
  const [applicationMessage, setApplicationMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!job) return null

  const location = job.isRemote ? 'Remote' : `${job.city}, ${job.state}`

  const handleApply = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          message: applicationMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setSuccess(true)
      setApplicationMessage('')

      // Close after showing success briefly
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-16">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-xl transition-all">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/80"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>

                <div className="flex flex-col lg:flex-row">
                  {/* Left Column - Job Details */}
                  <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-h-[80vh]">
                    {/* Company Header */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {job.employer.logo ? (
                            <Image
                              src={job.employer.logo}
                              alt={job.employer.name}
                              width={56}
                              height={56}
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-amber-100 flex items-center justify-center">
                              <BuildingOffice2Icon className="h-7 w-7 text-amber-600" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{job.employer.name}</h3>
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Actively Hiring
                              </span>
                            </div>
                            {job.employer.description && (
                              <p className="text-sm text-gray-500 mt-0.5">{job.employer.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Share
                          </button>
                          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                            <BookmarkIcon className="h-4 w-4" />
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          {tradeCategoryLabels[job.primaryTrade] || job.primaryTrade}
                        </span>
                        {matchesTrade && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            <CheckCircleIcon className="h-3 w-3" />
                            Matches your trade
                          </span>
                        )}
                      </div>

                      {/* Job Title & Key Info */}
                      <Dialog.Title className="text-xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </Dialog.Title>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span>{formatPay(job.payRangeMin, job.payRangeMax, job.payType)}</span>
                        <span className="text-gray-300">|</span>
                        <span>{location}</span>
                        <span className="text-gray-300">|</span>
                        <span>{job.minYearsExperience ? `${job.minYearsExperience}+ years exp` : 'Any experience'}</span>
                        <span className="text-gray-300">|</span>
                        <span>{jobTypeLabels[job.jobType]}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(job.createdAt)}</p>
                    </div>

                    {/* Job Details Grid */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Location</p>
                          <p className="text-sm text-gray-600 mt-1">{job.city}, {job.state}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Work Type</p>
                          <p className="text-sm text-gray-600 mt-1">{job.isRemote ? 'Remote' : 'On-site'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Employment Type</p>
                          <p className="text-sm text-gray-600 mt-1">{jobTypeLabels[job.jobType]}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Experience</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {job.minYearsExperience ? `${job.minYearsExperience}+ years` : 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Required Certifications */}
                      {job.requiredCertifications && job.requiredCertifications.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 mb-3">Required Certifications</p>
                          <div className="flex flex-wrap gap-2">
                            {job.requiredCertifications.map((cert, i) => (
                              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* About the Job */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">About the job</h3>
                      <div className="prose prose-sm prose-gray max-w-none">
                        <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                      </div>
                    </div>

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {job.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Application Form */}
                  <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-6 lg:p-8">
                    <div className="sticky top-0">
                      <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
                        Apply to {job.employer.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-6">
                        Your profile and resume will be shared with the employer along with your message.
                      </p>

                      {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                          {error}
                        </div>
                      )}

                      {success ? (
                        <div className="text-center py-8">
                          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted!</h4>
                          <p className="text-sm text-gray-600">
                            Your application has been sent to {job.employer.name}. Check your inbox for updates.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-6">
                            <label htmlFor="applicationMessage" className="block text-sm font-medium text-gray-900 mb-2">
                              Why are you interested in this role?
                            </label>
                            <textarea
                              id="applicationMessage"
                              value={applicationMessage}
                              onChange={(e) => setApplicationMessage(e.target.value)}
                              rows={6}
                              placeholder="Tell the employer why you'd be a great fit for this position..."
                              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                            />
                          </div>

                          <button
                            onClick={handleApply}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isSubmitting ? 'Submitting...' : 'Apply'}
                          </button>
                        </>
                      )}

                      <p className="text-xs text-gray-500 text-center mt-4">
                        By applying, you agree to share your profile information with {job.employer.name}.
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
