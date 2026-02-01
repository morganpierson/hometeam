'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BriefcaseIcon,
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  XMarkIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  UserCircleIcon,
  CursorArrowRaysIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import JobPostingForm from '@/app/components/jobs/job-posting-form'

interface WorkExperience {
  id: string
  title: string
  company: string
  companyLogo: string | null
  startDate: Date | null
  endDate: Date | null
  isCurrent: boolean
  description: string | null
  highlights: string[]
  location: string | null
}

interface Certification {
  id: string
  name: string
  issuingBody: string | null
  verified: boolean
}

interface Applicant {
  id: string
  applicationId: string
  status: string
  appliedAt: Date
  firstName: string | null
  lastName: string | null
  profileImage: string | null
  tradeCategory: string | null
  yearsExperience: number | null
  location: string | null
  hourlyRate: number | null
  resumeSummary: string | null
  resume: string | null
  lookingFor: string | null
  bio: string | null
  isAvailableForHire: boolean
  conversationId: string | null
  workExperiences: WorkExperience[]
  certifications: Certification[]
}

interface Job {
  id: string
  title: string
  description: string
  status: 'active' | 'draft' | 'closed' | 'paused' | 'filled'
  jobType: string
  primaryTrade: string
  city: string
  state: string
  zipCode: string | null
  isRemote: boolean
  payType: string
  payRangeMin: number | null
  payRangeMax: number | null
  minYearsExperience: number | null
  maxYearsExperience: number | null
  requiredCertifications: string[]
  benefits: string[]
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  applicantCount: number
  viewCount: number
  clickCount: number
  applicants: Applicant[]
  createdAt: Date
  updatedAt: Date
}

interface Employer {
  id: string
  name: string
  size?: string | null
  website?: string | null
  description?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  city?: string | null
  state?: string | null
}

interface JobsContentProps {
  orgId: string
  jobs: Job[]
  selectedJobId: string | null
  employerName: string
  currentUserName: string | null
  employer: Employer
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

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  TEMPORARY: 'Temporary',
}

const payTypeLabels: Record<string, string> = {
  HOURLY: 'Hourly',
  SALARY: 'Salary',
  PROJECT_BASED: 'Project-based',
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  return new Date(date).toLocaleDateString()
}

function formatPay(min: number | null, max: number | null, payType: string): string {
  if (!min && !max) return 'Compensation not specified'

  const formatNum = (n: number) => {
    if (payType === 'SALARY') {
      return `$${(n / 1000).toFixed(0)}k`
    }
    return `$${n.toFixed(0)}`
  }

  if (min && max) {
    return `${formatNum(min)} - ${formatNum(max)}${payType === 'HOURLY' ? '/hr' : ''}`
  }
  if (min) return `${formatNum(min)}+${payType === 'HOURLY' ? '/hr' : ''}`
  if (max) return `Up to ${formatNum(max)}${payType === 'HOURLY' ? '/hr' : ''}`
  return ''
}

export default function JobsContent({
  orgId,
  jobs,
  selectedJobId,
  employerName,
  currentUserName,
  employer,
}: JobsContentProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'active' | 'drafts'>('active')
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<'overview' | 'edit' | 'applicants'>('overview')
  const [selectedProfile, setSelectedProfile] = useState<Applicant | null>(null)

  const hasJobs = jobs.length > 0
  const selectedJob = jobs.find(j => j.id === selectedJobId) || null

  // Filter jobs based on search and tab
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'active'
      ? job.status === 'active'
      : job.status === 'draft'
    return matchesSearch && matchesTab
  })

  const activeCount = jobs.filter(j => j.status === 'active').length
  const draftCount = jobs.filter(j => j.status === 'draft').length

  const handleJobSelect = (jobId: string) => {
    router.push(`/org/${orgId}/jobs?jobId=${jobId}`)
  }

  const handleUnpublish = async () => {
    if (!selectedJob) return

    try {
      const response = await fetch(`/api/jobs/${selectedJob.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DRAFT' }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to unpublish job:', error)
    }
  }

  const handlePublish = async () => {
    if (!selectedJob) return

    try {
      const response = await fetch(`/api/jobs/${selectedJob.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to publish job:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedJob || isDeleting) return

    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/jobs/${selectedJob.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Navigate to the next job or just refresh
        const remainingJobs = jobs.filter(j => j.id !== selectedJob.id)
        if (remainingJobs.length > 0) {
          router.push(`/org/${orgId}/jobs?jobId=${remainingJobs[0].id}`)
        } else {
          router.push(`/org/${orgId}/jobs`)
        }
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete job:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRejectApplicant = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to reject applicant:', error)
    }
  }

  const handleAcceptApplicant = async (applicationId: string, applicantId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantId }),
      })

      if (response.ok) {
        const data = await response.json()
        // Navigate to the conversation
        router.push(`/org/${orgId}/inbox/${data.conversationId}`)
      }
    } catch (error) {
      console.error('Failed to accept applicant:', error)
    }
  }

  if (!hasJobs) {
    return (
      <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-12 max-w-lg text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No jobs.</h2>
            <p className="text-gray-600 mb-6">
              You don&apos;t need to post a job to start reaching out to candidates.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UsersIcon className="h-4 w-4" />
                Find Talent
              </Link>
              <Link
                href={`/org/${orgId}/jobs/new`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
              >
                <BriefcaseIcon className="h-4 w-4" />
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar - Jobs List */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Jobs</h1>
            <Link
              href={`/org/${orgId}/jobs/new`}
              className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              Post Job
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-gray-900 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'text-gray-900 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Jobs List */}
        <div className="flex-1 overflow-y-auto">
          {filteredJobs.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No {activeTab} jobs found
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = job.id === selectedJobId

              return (
                <button
                  key={job.id}
                  onClick={() => handleJobSelect(job.id)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-amber-50 border-l-2 border-l-amber-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Last edit: {formatTimeAgo(job.updatedAt)}
                    </span>
                    <StarIcon className="h-4 w-4 text-gray-300 hover:text-amber-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-0.5">{job.title}</h3>
                  <p className="text-xs text-gray-500">
                    {job.isRemote ? 'Remote' : `In office: ${job.city}`}
                  </p>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Main Content - Selected Job Details */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {selectedJob ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold text-gray-900">{selectedJob.title}</h1>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    selectedJob.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedJob.status === 'active' ? 'Live' : selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{employerName}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedJob.status === 'active' ? (
                  <button
                    onClick={handleUnpublish}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            {/* Gmail-style Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setViewMode('overview')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-[3px] transition-colors ${
                  viewMode === 'overview'
                    ? 'text-amber-600 border-amber-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <EyeIcon className={`h-5 w-5 ${viewMode === 'overview' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-[3px] transition-colors ${
                  viewMode === 'edit'
                    ? 'text-amber-600 border-amber-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <PencilIcon className={`h-5 w-5 ${viewMode === 'edit' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Edit Job</span>
              </button>
              <button
                onClick={() => setViewMode('applicants')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-[3px] transition-colors ${
                  viewMode === 'applicants'
                    ? 'text-amber-600 border-amber-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UsersIcon className={`h-5 w-5 ${viewMode === 'applicants' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span>Applicants</span>
                {selectedJob.applicantCount > 0 && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    viewMode === 'applicants' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedJob.applicantCount}
                  </span>
                )}
              </button>
            </div>

            {viewMode === 'overview' && (
              <>
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <EyeIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">{selectedJob.viewCount}</p>
                        <p className="text-sm text-gray-500">Impressions</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <CursorArrowRaysIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">{selectedJob.clickCount}</p>
                        <p className="text-sm text-gray-500">Clicks</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <UsersIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">{selectedJob.applicantCount}</p>
                        <p className="text-sm text-gray-500">Applications</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Details Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  {selectedJob.status === 'active' ? 'Live Job' : 'Job Details'}
                </h2>
                <div className="flex items-center gap-2">
                  <Link
                    href="/marketplace"
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    <UsersIcon className="h-4 w-4" />
                    Find Talent
                  </Link>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
                    <ShareIcon className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="grid grid-cols-3 gap-8">
                  {/* Left Column - Main Info */}
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedJob.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {formatPay(selectedJob.payRangeMin, selectedJob.payRangeMax, selectedJob.payType)}
                    </p>
                    <div className="prose prose-sm text-gray-600 max-w-none">
                      <p>{selectedJob.description}</p>
                    </div>

                    {/* Requirements */}
                    {selectedJob.requiredCertifications.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.requiredCertifications.map((cert, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    {selectedJob.benefits.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.benefits.map((benefit, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 text-sm bg-green-50 text-green-700 rounded-lg flex items-center gap-1"
                            >
                              <CheckCircleIcon className="h-3.5 w-3.5" />
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Meta Info */}
                  <div className="space-y-5">
                    {(selectedJob.contactName || selectedJob.contactEmail) && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Recruiting Contact</h4>
                        <p className="text-sm text-gray-700">{selectedJob.contactName || currentUserName}</p>
                        <p className="text-xs text-gray-500">
                          last updated {new Date(selectedJob.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Location</h4>
                      <p className="text-sm text-gray-700">
                        {selectedJob.city}, {selectedJob.state}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Remote Work Policy</h4>
                      <p className="text-sm text-gray-700">
                        {selectedJob.isRemote ? 'Remote' : 'In office'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Job Type</h4>
                      <p className="text-sm text-gray-700">
                        {jobTypeLabels[selectedJob.jobType] || selectedJob.jobType}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Trade Category</h4>
                      <p className="text-sm text-gray-700">
                        {tradeCategoryLabels[selectedJob.primaryTrade] || selectedJob.primaryTrade}
                      </p>
                    </div>

                    {(selectedJob.minYearsExperience || selectedJob.maxYearsExperience) && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">Experience Required</h4>
                        <p className="text-sm text-gray-700">
                          {selectedJob.minYearsExperience && selectedJob.maxYearsExperience
                            ? `${selectedJob.minYearsExperience} - ${selectedJob.maxYearsExperience} years`
                            : selectedJob.minYearsExperience
                            ? `${selectedJob.minYearsExperience}+ years`
                            : `Up to ${selectedJob.maxYearsExperience} years`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
              </>
            )}

            {viewMode === 'edit' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <JobPostingForm
                  employer={employer}
                  orgId={orgId}
                  mode="edit"
                  initialData={{
                    id: selectedJob.id,
                    title: selectedJob.title,
                    description: selectedJob.description,
                    jobType: selectedJob.jobType,
                    primaryTrade: selectedJob.primaryTrade,
                    city: selectedJob.city,
                    state: selectedJob.state,
                    zipCode: selectedJob.zipCode,
                    isRemote: selectedJob.isRemote,
                    payType: selectedJob.payType,
                    payRangeMin: selectedJob.payRangeMin,
                    payRangeMax: selectedJob.payRangeMax,
                    minYearsExperience: selectedJob.minYearsExperience,
                    maxYearsExperience: selectedJob.maxYearsExperience,
                    requiredCertifications: selectedJob.requiredCertifications,
                    benefits: selectedJob.benefits,
                    contactName: selectedJob.contactName,
                    contactEmail: selectedJob.contactEmail,
                    contactPhone: selectedJob.contactPhone,
                    status: selectedJob.status,
                  }}
                  onSuccess={() => {
                    setViewMode('overview')
                    router.refresh()
                  }}
                />
              </div>
            )}

            {viewMode === 'applicants' && (
              <div>
                {selectedJob.applicants.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No applicants yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      When candidates apply for this job, they&apos;ll appear here.
                    </p>
                    <Link
                      href="/marketplace"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
                    >
                      <UsersIcon className="h-4 w-4" />
                      Find Talent
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedJob.applicants.map((applicant) => (
                      <div
                        key={applicant.applicationId}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            {applicant.profileImage ? (
                              <img
                                src={applicant.profileImage}
                                alt={`${applicant.firstName || ''} ${applicant.lastName || ''}`}
                                className="h-14 w-14 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center">
                                <span className="text-amber-700 font-semibold text-lg">
                                  {(applicant.firstName?.[0] || '') + (applicant.lastName?.[0] || '')}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                  {applicant.firstName} {applicant.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {tradeCategoryLabels[applicant.tradeCategory || ''] || applicant.tradeCategory || 'Trade Professional'}
                                  {applicant.yearsExperience && ` · ${applicant.yearsExperience} years exp.`}
                                </p>
                              </div>
                              {/* View Profile CTA - Top Right */}
                              <button
                                onClick={() => setSelectedProfile(applicant)}
                                className="text-sm font-medium text-amber-600 hover:text-amber-700"
                              >
                                View Profile
                              </button>
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              {applicant.location && (
                                <span className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4" />
                                  {applicant.location}
                                </span>
                              )}
                              {applicant.hourlyRate && (
                                <span className="flex items-center gap-1">
                                  <CurrencyDollarIcon className="h-4 w-4" />
                                  ${applicant.hourlyRate}/hr
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                Applied {formatTimeAgo(applicant.appliedAt)}
                              </span>
                            </div>

                            {/* Resume Summary */}
                            {applicant.resumeSummary && (
                              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                {applicant.resumeSummary}
                              </p>
                            )}

                            {/* Action CTAs */}
                            <div className="flex items-center justify-end gap-3 mt-4">
                              <button
                                onClick={() => handleRejectApplicant(applicant.applicationId)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Not Interested
                              </button>
                              <button
                                onClick={() => handleAcceptApplicant(applicant.applicationId, applicant.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                                Accept Candidate
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a job to view details</p>
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setSelectedProfile(null)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg z-10"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              {/* Profile Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  {selectedProfile.profileImage ? (
                    <img
                      src={selectedProfile.profileImage}
                      alt={`${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
                      <UserCircleIcon className="h-12 w-12 text-amber-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedProfile.firstName} {selectedProfile.lastName}
                    </h2>
                    <p className="text-gray-600">
                      {tradeCategoryLabels[selectedProfile.tradeCategory || ''] || 'Trade Professional'}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                      {selectedProfile.yearsExperience && (
                        <span className="flex items-center gap-1">
                          <BriefcaseIcon className="h-4 w-4" />
                          {selectedProfile.yearsExperience} years exp.
                        </span>
                      )}
                      {selectedProfile.location && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {selectedProfile.location}
                        </span>
                      )}
                      {selectedProfile.hourlyRate && (
                        <span className="flex items-center gap-1">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          ${selectedProfile.hourlyRate}/hr
                        </span>
                      )}
                    </div>
                    {selectedProfile.isAvailableForHire && (
                      <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                        Open to opportunities
                      </span>
                    )}
                  </div>
                  {selectedProfile.resume && (
                    <a
                      href={selectedProfile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      Resume
                    </a>
                  )}
                </div>
              </div>

              {/* Looking For */}
              {selectedProfile.lookingFor && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Looking for</p>
                  <div className="flex items-start gap-3">
                    <SparklesIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{selectedProfile.lookingFor}</p>
                  </div>
                </div>
              )}

              {/* About */}
              {selectedProfile.bio && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">About</p>
                  <p className="text-sm text-gray-700">{selectedProfile.bio}</p>
                </div>
              )}

              {/* Resume Summary */}
              {selectedProfile.resumeSummary && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Summary</p>
                  <p className="text-sm text-gray-700">{selectedProfile.resumeSummary}</p>
                </div>
              )}

              {/* Work Experience */}
              {selectedProfile.workExperiences.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Experience</p>
                  <div className="space-y-5">
                    {selectedProfile.workExperiences.map((exp) => (
                      <div key={exp.id} className="flex gap-4">
                        <div className="flex-shrink-0">
                          {exp.companyLogo ? (
                            <img
                              src={exp.companyLogo}
                              alt={exp.company}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <BuildingOffice2Icon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            {' - '}
                            {exp.isCurrent ? 'Present' : (exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                          )}
                          {exp.highlights.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {exp.highlights.map((highlight, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-gray-400 mt-1">•</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {selectedProfile.certifications.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Certifications</p>
                  <div className="space-y-2">
                    {selectedProfile.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900">{cert.name}</p>
                          {cert.issuingBody && (
                            <p className="text-sm text-gray-500">{cert.issuingBody}</p>
                          )}
                        </div>
                        {cert.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                            Verified
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    handleRejectApplicant(selectedProfile.applicationId)
                    setSelectedProfile(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Not Interested
                </button>
                <button
                  onClick={() => {
                    handleAcceptApplicant(selectedProfile.applicationId, selectedProfile.id)
                    setSelectedProfile(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Accept Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
