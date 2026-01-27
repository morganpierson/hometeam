'use client'

import Image from 'next/image'
import {
  BuildingOffice2Icon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckBadgeIcon,
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

export interface Job {
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

interface JobCardProps {
  job: Job
  matchesTrade?: boolean
  onLearnMore: (job: Job) => void
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

  // Salary - format in k
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

export default function JobCard({ job, matchesTrade, onLearnMore }: JobCardProps) {
  const location = job.isRemote
    ? 'Remote'
    : `${job.city}, ${job.state}`

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
      {/* Company Header */}
      <div className="flex items-start gap-4 mb-4">
        {job.employer.logo ? (
          <Image
            src={job.employer.logo}
            alt={job.employer.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
            <BuildingOffice2Icon className="h-6 w-6 text-amber-600" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{job.employer.name}</h3>
            {matchesTrade && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                <CheckBadgeIcon className="h-3 w-3" />
                Matches your trade
              </span>
            )}
          </div>
          {job.employer.description && (
            <p className="text-sm text-gray-500 line-clamp-1">{job.employer.description}</p>
          )}
          {job.employer.size && (
            <p className="text-xs text-gray-400 mt-0.5">{job.employer.size}</p>
          )}
        </div>
      </div>

      {/* Trade & Job Type Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          {tradeCategoryLabels[job.primaryTrade] || job.primaryTrade}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {jobTypeLabels[job.jobType] || job.jobType}
        </span>
        {job.minYearsExperience && (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {job.minYearsExperience}+ years
          </span>
        )}
      </div>

      {/* Job Details */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="font-medium text-gray-900 mb-2">{job.title}</h4>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            {location}
          </span>
          <span className="flex items-center gap-1.5">
            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
            {formatPay(job.payRangeMin, job.payRangeMax, job.payType)}
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <ClockIcon className="h-4 w-4" />
            {formatTimeAgo(job.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Save
          </button>
          <button
            onClick={() => onLearnMore(job)}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}
