import { fetchEmployerData } from '@/utils/actions'
import { prisma } from '@/utils/db'
import JobsContent from './jobs-content'

interface JobsPageProps {
  params: { id: string }
}

export default async function JobsPage({ params }: JobsPageProps) {
  const employerData = await fetchEmployerData()

  // Fetch job postings for this employer
  const jobPostings = employerData ? await prisma.jobPosting.findMany({
    where: {
      employerId: employerData.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  }) : []

  // Transform the data to match the expected interface
  const jobs = jobPostings.map(job => ({
    id: job.id,
    title: job.title,
    status: job.status.toLowerCase() as 'active' | 'draft' | 'closed',
    applicantCount: job._count.applications,
    createdAt: job.createdAt,
  }))

  return (
    <JobsContent
      orgId={params.id}
      jobs={jobs}
      employerName={employerData?.name || 'Your Company'}
    />
  )
}
