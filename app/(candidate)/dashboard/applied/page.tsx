import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import {
  DocumentTextIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

// Revalidate applications every 30 seconds
export const revalidate = 30

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

function formatTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Applied today'
  if (diffInDays === 1) return 'Applied yesterday'
  if (diffInDays < 7) return `Applied ${diffInDays} days ago`
  if (diffInDays < 30) return `Applied ${Math.floor(diffInDays / 7)} weeks ago`
  return `Applied ${Math.floor(diffInDays / 30)} months ago`
}

export default async function AppliedPage() {
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

  const applications = await prisma.jobApplication.findMany({
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
              city: true,
              state: true,
            },
          },
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applied</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your job applications
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-lg mb-4">
            <DocumentTextIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            When you apply to jobs, you&apos;ll be able to track your applications and their status here.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = application.jobPosting
            const status = statusColors[application.status] || statusColors.pending
            const hasUnreadMessage = application.conversation?.messages[0]?.readAt === null

            return (
              <div
                key={application.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
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
                      <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                        <BuildingOffice2Icon className="h-6 w-6 text-amber-600" />
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.employer.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          {job.isRemote ? 'Remote' : `${job.city}, ${job.state}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {formatTimeAgo(application.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {statusLabels[application.status] || application.status}
                    </span>

                    {application.conversationId && (
                      <Link
                        href={`/dashboard/inbox/${application.conversationId}`}
                        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        View Messages
                        {hasUnreadMessage && (
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                        )}
                      </Link>
                    )}
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      <span className="font-medium text-gray-700">Your message: </span>
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
  )
}
