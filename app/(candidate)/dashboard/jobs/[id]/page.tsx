import { auth } from '@clerk/nextjs'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/utils/db'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

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

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Posted today'
  if (diffInDays === 1) return 'Posted yesterday'
  if (diffInDays < 7) return `Posted ${diffInDays} days ago`
  if (diffInDays < 30) return `Posted ${Math.floor(diffInDays / 7)} weeks ago`
  return `Posted ${Math.floor(diffInDays / 30)} months ago`
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const employee = await prisma.employee.findUnique({
    where: { clerkId: userId },
  })

  if (!employee) {
    redirect('/new-user')
  }

  const job = await prisma.jobPosting.findUnique({
    where: { id: params.id },
    include: {
      employer: true,
    },
  })

  if (!job || job.status !== 'ACTIVE') {
    notFound()
  }

  const location = job.isRemote ? 'Remote' : `${job.city}, ${job.state}`
  const matchesTrade = employee.tradeCategory === job.primaryTrade

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              {job.employer.logo ? (
                <Image
                  src={job.employer.logo}
                  alt={job.employer.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-amber-100 flex items-center justify-center">
                  <BuildingOffice2Icon className="h-8 w-8 text-amber-600" />
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h1>
                <p className="text-gray-600">{job.employer.name}</p>
                {matchesTrade && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <CheckCircleIcon className="h-3 w-3" />
                    Matches your trade
                  </span>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                {location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                {formatPay(job.payRangeMin, job.payRangeMax, job.payType)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                {jobTypeLabels[job.jobType]}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ClockIcon className="h-4 w-4" />
                {formatTimeAgo(job.createdAt)}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700">
                {tradeCategoryLabels[job.primaryTrade] || job.primaryTrade}
              </span>
              {job.minYearsExperience && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                  {job.minYearsExperience}+ years experience
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About this role</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          {/* Required Certifications */}
          {job.requiredCertifications && job.requiredCertifications.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Certifications</h2>
              <ul className="space-y-2">
                {job.requiredCertifications.map((cert, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-amber-500" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
            <div className="space-y-3">
              <button className="w-full px-4 py-3 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors">
                Apply now
              </button>
              <button className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <BookmarkIcon className="h-4 w-4" />
                Save job
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Your application will include your profile and resume
            </p>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About the company</h3>
            <div className="flex items-center gap-3 mb-4">
              {job.employer.logo ? (
                <Image
                  src={job.employer.logo}
                  alt={job.employer.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <BuildingOffice2Icon className="h-5 w-5 text-amber-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{job.employer.name}</p>
                {job.employer.size && (
                  <p className="text-xs text-gray-500">{job.employer.size}</p>
                )}
              </div>
            </div>
            {(job.employer.description || job.companyDescription) && (
              <p className="text-sm text-gray-600 line-clamp-4">
                {job.companyDescription || job.employer.description}
              </p>
            )}
            {job.employer.city && job.employer.state && (
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                {job.employer.city}, {job.employer.state}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
