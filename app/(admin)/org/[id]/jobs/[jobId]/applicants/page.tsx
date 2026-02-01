import { auth } from '@clerk/nextjs'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/utils/db'
import { ArrowLeftIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ApplicantsContent from './applicants-content'

interface ApplicantsPageProps {
  params: { id: string; jobId: string }
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
          phone: true,
          profileImage: true,
          tradeCategory: true,
          yearsExperience: true,
          location: true,
          hourlyRate: true,
          isBackgroundChecked: true,
          isInsured: true,
          bio: true,
          resume: true,
          resumeSummary: true,
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

  // Serialize dates for client component
  const serializedApplications = applications.map((app) => ({
    ...app,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    applicant: {
      ...app.applicant,
      hourlyRate: app.applicant.hourlyRate ? Number(app.applicant.hourlyRate) : null,
    },
    conversation: app.conversation
      ? {
          ...app.conversation,
          messages: app.conversation.messages.map((msg) => ({
            ...msg,
            readAt: msg.readAt?.toISOString() || null,
          })),
        }
      : null,
  }))

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
          <ApplicantsContent
            applications={serializedApplications}
            orgId={params.id}
            jobId={params.jobId}
            jobTitle={jobPosting.title}
          />
        )}
      </div>
    </div>
  )
}
