'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircleIcon,
  UserGroupIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  MapPinIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { TradeCategory } from '@prisma/client'
import RequestToChatModal from '../request-to-chat-modal'

interface JobPosting {
  id: string
  title: string
  status: string
  primaryTrade: TradeCategory
  city: string
  state: string
  _count?: {
    applications: number
  }
}

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
  tradeCategory?: TradeCategory | null
  yearsExperience?: number | null
  location?: string | null
  isBackgroundChecked?: boolean
  isInsured?: boolean
  bio?: string | null
  resumeSummary?: string | null
  hourlyRate?: number | null
  availability?: string | null
  certifications?: Certification[]
  matchingJobTitle?: string
}

interface Employer {
  id: string
  name: string
  logo?: string | null
}

interface Employee {
  id: string
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
}

interface DashboardData {
  employer: Employer
  currentUser: Employee | null
  applicantCount: number
  matchCount: number
  messageCount: number
  activeJobsCount: number
  viewsCount: number
  pitchesCount: number
  recentJobs: JobPosting[]
  topProspects: Prospect[]
}

interface EmployerDashboardProps {
  data: DashboardData
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

export default function EmployerDashboard({ data }: EmployerDashboardProps) {
  const {
    employer,
    currentUser,
    applicantCount,
    matchCount,
    messageCount,
    recentJobs,
    topProspects,
  } = data

  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)

  const firstName = currentUser?.firstName || employer.name
  const hasJobs = recentJobs.length > 0

  const handleRequestToChat = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    setChatModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {currentUser?.profileImage ? (
            <Image
              src={currentUser.profileImage}
              alt={firstName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : employer.logo ? (
            <Image
              src={employer.logo}
              alt={employer.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <UserCircleIcon className="h-10 w-10 text-emerald-600" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hello, {firstName}!
            </h1>
            <p className="text-gray-500">{employer.name}</p>
          </div>
        </div>

        {/* Applicants Section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Applicants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/org/${employer.id}/candidates`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{applicantCount}</p>
                  <p className="text-sm text-gray-500">Applicants</p>
                </div>
              </div>
            </Link>

            <Link
              href={`/org/${employer.id}/candidates?filter=matches`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <SparklesIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{matchCount}</p>
                  <p className="text-sm text-gray-500">Matches</p>
                </div>
              </div>
            </Link>

            <Link
              href={`/org/${employer.id}/inbox`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{messageCount}</p>
                  <p className="text-sm text-gray-500">Messages</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Top Prospects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Top Prospects
            </h2>
            {hasJobs && (
              <Link
                href="/marketplace"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                View all
              </Link>
            )}
          </div>

          {hasJobs ? (
            <div className="space-y-4">
              {topProspects.length > 0 ? (
                topProspects.map((prospect) => {
                  const fullName = [prospect.firstName, prospect.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Anonymous'
                  const tradeLabel = prospect.tradeCategory
                    ? tradeCategoryLabels[prospect.tradeCategory]
                    : 'Trade Professional'

                  // Build info line
                  const infoItems = []
                  if (prospect.yearsExperience) {
                    infoItems.push(`${prospect.yearsExperience} years of exp`)
                  }
                  if (prospect.location) {
                    infoItems.push(prospect.location)
                  }

                  return (
                    <div
                      key={prospect.id}
                      className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="p-5">
                        {/* Header: Photo, Name, Info */}
                        <div className="flex items-start gap-4 mb-4">
                          <Link href={`/marketplace/user/${prospect.id}`}>
                            {prospect.profileImage ? (
                              <Image
                                src={prospect.profileImage}
                                alt={fullName}
                                width={72}
                                height={72}
                                className="h-18 w-18 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-18 w-18 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserCircleIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </Link>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                href={`/marketplace/user/${prospect.id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-emerald-600"
                              >
                                {fullName}
                              </Link>
                              {prospect.isBackgroundChecked && (
                                <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                              )}
                              {prospect.matchingJobTitle && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Match: {prospect.matchingJobTitle}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{infoItems.join(' • ')}</p>
                            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Active this week
                            </span>
                          </div>

                          <Link
                            href={`/marketplace/user/${prospect.id}`}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </Link>
                        </div>

                        {/* Looking for / Bio */}
                        {(prospect.bio || prospect.resumeSummary) && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Looking for
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {prospect.bio || prospect.resumeSummary}
                            </p>
                          </div>
                        )}

                        {/* Experience */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Experience
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
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
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                              Certifications
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {prospect.certifications.slice(0, 3).map((cert) => (
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
                              {prospect.certifications.length > 3 && (
                                <span className="text-xs text-gray-500 self-center">
                                  +{prospect.certifications.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Preferences row */}
                        <div className="flex flex-wrap gap-2">
                          {prospect.hourlyRate && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-gray-100 text-gray-700">
                              <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                              ${prospect.hourlyRate}/hr
                            </span>
                          )}
                          {prospect.location && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-gray-100 text-gray-700">
                              <MapPinIcon className="h-4 w-4 text-gray-500" />
                              {prospect.location}
                            </span>
                          )}
                          {prospect.isInsured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-blue-50 text-blue-700">
                              <CheckCircleIcon className="h-4 w-4" />
                              Insured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action footer */}
                      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50 rounded-b-xl">
                        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
                          <ShareIcon className="h-4 w-4" />
                          Share
                        </button>

                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                            <XMarkIcon className="h-4 w-4" />
                            Not interested
                          </button>
                          <button
                            onClick={() => handleRequestToChat(prospect)}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600"
                          >
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            Request to chat
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <SparklesIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No matching prospects yet</p>
                  <p className="text-sm text-gray-400">
                    We&apos;ll show candidates that match your job requirements here
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-lg shadow-sm mb-4">
                <BriefcaseIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Post a job to see matching candidates
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Once you post a job, we&apos;ll show you top prospects that match your
                requirements right here.
              </p>
              <Link
                href={`/org/${employer.id}/jobs/new`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                Post a Job
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Request to Chat Modal */}
      {selectedProspect && (
        <RequestToChatModal
          open={chatModalOpen}
          setOpen={setChatModalOpen}
          prospect={selectedProspect}
          employerId={employer.id}
        />
      )}
    </div>
  )
}
