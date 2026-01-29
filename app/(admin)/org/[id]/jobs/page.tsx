import { fetchEmployerData } from '@/utils/actions'
import { prisma } from '@/utils/db'
import { getEmployeeByClerkID } from '@/utils/auth'
import JobsContent from './jobs-content'

interface JobsPageProps {
  params: { id: string }
  searchParams: { jobId?: string }
}

export default async function JobsPage({ params, searchParams }: JobsPageProps) {
  const [employerData, currentUser] = await Promise.all([
    fetchEmployerData(),
    getEmployeeByClerkID(),
  ])

  // Fetch job postings for this employer with full details and applicants
  const jobPostings = employerData ? await prisma.jobPosting.findMany({
    where: {
      employerId: employerData.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
      applications: {
        where: {
          status: {
            not: 'rejected',
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              tradeCategory: true,
              yearsExperience: true,
              location: true,
              hourlyRate: true,
              resumeSummary: true,
              resume: true,
              lookingFor: true,
              bio: true,
              isAvailableForHire: true,
              workExperiences: {
                orderBy: { sortOrder: 'asc' },
              },
              certifications: true,
            },
          },
        },
      },
    },
  }) : []

  // Transform the data to match the expected interface
  const jobs = jobPostings.map(job => ({
    id: job.id,
    title: job.title,
    description: job.description,
    status: job.status.toLowerCase() as 'active' | 'draft' | 'closed' | 'paused' | 'filled',
    jobType: job.jobType,
    primaryTrade: job.primaryTrade,
    city: job.city,
    state: job.state,
    zipCode: job.zipCode,
    isRemote: job.isRemote,
    payType: job.payType,
    payRangeMin: job.payRangeMin ? Number(job.payRangeMin) : null,
    payRangeMax: job.payRangeMax ? Number(job.payRangeMax) : null,
    minYearsExperience: job.minYearsExperience,
    maxYearsExperience: job.maxYearsExperience,
    requiredCertifications: job.requiredCertifications,
    benefits: job.benefits,
    contactName: job.contactName,
    contactEmail: job.contactEmail,
    contactPhone: job.contactPhone,
    applicantCount: job._count.applications,
    applicants: job.applications.map(app => ({
      id: app.applicant.id,
      applicationId: app.id,
      status: app.status,
      appliedAt: app.createdAt,
      firstName: app.applicant.firstName,
      lastName: app.applicant.lastName,
      profileImage: app.applicant.profileImage,
      tradeCategory: app.applicant.tradeCategory,
      yearsExperience: app.applicant.yearsExperience,
      location: app.applicant.location,
      hourlyRate: app.applicant.hourlyRate ? Number(app.applicant.hourlyRate) : null,
      resumeSummary: app.applicant.resumeSummary,
      resume: app.applicant.resume,
      lookingFor: app.applicant.lookingFor,
      bio: app.applicant.bio,
      isAvailableForHire: app.applicant.isAvailableForHire,
      conversationId: app.conversationId,
      workExperiences: app.applicant.workExperiences.map(exp => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        companyLogo: exp.companyLogo,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        description: exp.description,
        highlights: exp.highlights,
        location: exp.location,
      })),
      certifications: app.applicant.certifications.map(cert => ({
        id: cert.id,
        name: cert.name,
        issuingBody: cert.issuingBody,
        verified: cert.verified,
      })),
    })),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  }))

  // Get selected job ID from URL or default to first job
  const selectedJobId = searchParams.jobId || (jobs.length > 0 ? jobs[0].id : null)

  return (
    <JobsContent
      orgId={params.id}
      jobs={jobs}
      selectedJobId={selectedJobId}
      employerName={employerData?.name || 'Your Company'}
      currentUserName={currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : null}
      employer={employerData ? {
        id: employerData.id,
        name: employerData.name,
        size: employerData.size,
        website: employerData.website,
        description: employerData.description,
        contactEmail: employerData.contactEmail,
        contactPhone: employerData.contactPhone,
        city: employerData.city,
        state: employerData.state,
      } : {
        id: '',
        name: 'Your Company',
      }}
    />
  )
}
