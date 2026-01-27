import { auth } from '@clerk/nextjs'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/utils/db'
import {
  ArrowLeftIcon,
  UserCircleIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

interface ApplicantsPageProps {
  params: { id: string; jobId: string }
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

export default async function ApplicantsPage({ params }: ApplicantsPageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Verify the user has access to this org
  const employee = await prisma.employee.findFirst({
    where: {
      clerkId: userId,
      employerId: params.id,
    },
  })

  if (!employee) {
    redirect('/new-user')
  }

  // Fetch the job posting
  const jobPosting = await prisma.jobPosting.findUnique({
    where: {
      id: params.jobId,
      employerId: params.id,
    },
    include: {
      employer: true,
    },
  })

  if (!jobPosting) {
    notFound()
  }

  // Fetch all applications for this job
  const applications = await prisma.jobApplication.findMany({
    where: {
      jobPostingId: params.jobId,
    },
    include: {
      applicant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
          tradeCategory: true,
          yearsExperience: true,
          location: true,
          hourlyRate: true,
          isBackgroundChecked: true,
          isInsured: true,
        },
      },
      conversation: {
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/org/${params.id}/jobs`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Jobs
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{jobPosting.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {applications.length} applicant{applications.length !== 1 ? 's' : ''}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                jobPosting.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {jobPosting.status.toLowerCase()}
            </span>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-lg mb-4">
              <BriefcaseIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              When candidates apply to this job, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const applicant = application.applicant
              const status = statusColors[application.status] || statusColors.pending
              const hasUnreadMessage =
                application.conversation?.messages[0]?.readAt === null &&
                application.conversation?.messages[0]?.senderType === 'EMPLOYEE'

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

                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {statusLabels[application.status] || application.status}
                      </span>

                      {application.conversationId && (
                        <Link
                          href={`/org/${params.id}/inbox/${application.conversationId}`}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          Message
                          {hasUnreadMessage && (
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                          )}
                        </Link>
                      )}
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        <span className="font-medium text-gray-700">Application message: </span>
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
