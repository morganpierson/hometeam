import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import Link from 'next/link'
import Image from 'next/image'
import {
  UserCircleIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  ClockIcon,
  CheckIcon,
  ChevronDownIcon,
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

const statusLabels: Record<string, string> = {
  pending: 'Pending Review',
  reviewing: 'Under Review',
  interviewed: 'Interviewed',
  offered: 'Offer Extended',
  hired: 'Hired',
  rejected: 'Not Selected',
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  reviewing: { bg: 'bg-blue-50', text: 'text-blue-700' },
  interviewed: { bg: 'bg-purple-50', text: 'text-purple-700' },
  offered: { bg: 'bg-green-50', text: 'text-green-700' },
  hired: { bg: 'bg-green-100', text: 'text-green-800' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700' },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return '1 day ago'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatSalary(min: number | null, max: number | null, payType: string): string {
  if (!min && !max) return ''

  const formatNum = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}k`
    return `$${n}`
  }

  if (payType === 'HOURLY') {
    if (min && max) return `${formatNum(min)} - ${formatNum(max)}/hr`
    if (min) return `${formatNum(min)}/hr`
    if (max) return `Up to ${formatNum(max)}/hr`
  }

  if (min && max) return `${formatNum(min)} - ${formatNum(max)}`
  if (min) return `From ${formatNum(min)}`
  if (max) return `Up to ${formatNum(max)}`
  return ''
}

export default async function CandidateDashboard() {
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

  // Get recommended jobs based on employee's trade category
  const recommendedJobs = await prisma.jobPosting.findMany({
    where: {
      status: 'ACTIVE',
      primaryTrade: employee.tradeCategory || undefined,
    },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  // Get recently applied jobs
  const recentApplications = await prisma.jobApplication.findMany({
    where: {
      applicantId: employee.id,
    },
    include: {
      jobPosting: {
        include: {
          employer: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Candidate'
  const tradeLabel = employee.tradeCategory
    ? tradeCategoryLabels[employee.tradeCategory]
    : 'Trade Professional'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile last updated */}
      <div className="text-right text-sm text-gray-500">
        Profile last updated: <span className="font-medium text-gray-900">{formatDate(employee.updatedAt)}</span>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {employee.profileImage ? (
              <Image
                src={employee.profileImage}
                alt={fullName}
                width={72}
                height={72}
                className="h-18 w-18 rounded-full object-cover"
              />
            ) : (
              <div className="h-18 w-18 rounded-full bg-amber-100 flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-amber-600" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{fullName}</h1>
              <p className="text-sm text-gray-600">{tradeLabel}</p>
              {employee.location && (
                <p className="text-sm text-gray-500">{employee.location}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              View your public profile
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium text-gray-600 hover:text-gray-700"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Job Search Status */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="font-medium text-gray-900 mb-1">Where are you in your job search?</p>
          <p className="text-sm text-gray-500 mb-3">
            Keep your job status up-to-date to inform employers of your search.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            {employee.isAvailableForHire ? (
              <>
                <CheckIcon className="h-4 w-4 text-green-500" />
                Open to offers
              </>
            ) : (
              'Not actively looking'
            )}
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Recommended Jobs</h2>
            <p className="text-sm text-gray-500">Jobs where you&apos;re a top applicant based on your profile</p>
          </div>
          <Link
            href="/dashboard/jobs"
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            Change job preferences
          </Link>
        </div>

        {recommendedJobs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recommendedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {job.employer.logo ? (
                    <Image
                      src={job.employer.logo}
                      alt={job.employer.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <BuildingOffice2Icon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.employer.name}</p>
                    <p className="text-sm text-gray-500">
                      {job.city}, {job.state} {job.isRemote && '• Remote'}
                    </p>
                    {(job.payRangeMin || job.payRangeMax) && (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatSalary(
                          job.payRangeMin ? Number(job.payRangeMin) : null,
                          job.payRangeMax ? Number(job.payRangeMax) : null,
                          job.payType
                        )}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Posted: {formatTimeAgo(job.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Save
                </button>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 pt-2 text-center">
            <p className="text-sm text-gray-500">
              No recommended jobs yet. Complete your profile to get personalized recommendations.
            </p>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 text-center">
          <Link
            href="/dashboard/jobs"
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            See more jobs
          </Link>
        </div>
      </div>

      {/* Recently Applied */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Recently Applied</h2>
            <p className="text-sm text-gray-500">Track your recent job applications</p>
          </div>
          <Link
            href="/dashboard/applied"
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all applications
          </Link>
        </div>

        {recentApplications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentApplications.map((application) => {
              const job = application.jobPosting
              const status = statusColors[application.status] || statusColors.pending

              return (
                <Link
                  key={application.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {job.employer.logo ? (
                      <Image
                        src={job.employer.logo}
                        alt={job.employer.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <BuildingOffice2Icon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.employer.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <MapPinIcon className="h-3.5 w-3.5" />
                        {job.isRemote ? 'Remote' : `${job.city}, ${job.state}`}
                        <span className="text-gray-300">|</span>
                        <ClockIcon className="h-3.5 w-3.5" />
                        Applied {formatTimeAgo(application.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    {statusLabels[application.status] || application.status}
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="p-6 pt-2 text-center">
            <p className="text-sm text-gray-500 mb-4">
              You haven&apos;t applied to any jobs yet.
            </p>
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {recentApplications.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center">
            <Link
              href="/dashboard/applied"
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              View all applications
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
