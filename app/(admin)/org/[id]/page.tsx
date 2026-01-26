import { getEmployeeByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import EmployerDashboard from '@/app/components/dashboard/employer-dashboard'
import { TradeCategory } from '@prisma/client'

const getDashboardData = async () => {
  const currentUser = await getEmployeeByClerkID()

  // Get employer data
  const employer = await prisma.employer.findUniqueOrThrow({
    where: {
      id: currentUser?.employerId ?? undefined,
    },
  })

  // Get active job postings with application counts
  const recentJobs = await prisma.jobPosting.findMany({
    where: {
      employerId: employer.id,
      status: 'ACTIVE',
    },
    include: {
      _count: {
        select: { applications: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  // Count total applicants across all jobs
  const applicantCount = await prisma.jobApplication.count({
    where: {
      jobPosting: {
        employerId: employer.id,
      },
    },
  })

  // Count unread messages
  const messageCount = await prisma.message.count({
    where: {
      conversation: {
        employers: {
          some: {
            id: employer.id,
          },
        },
      },
      readAt: null,
      NOT: {
        senderId: currentUser?.id,
      },
    },
  })

  // Get active jobs count
  const activeJobsCount = await prisma.jobPosting.count({
    where: {
      employerId: employer.id,
      status: 'ACTIVE',
    },
  })

  // Get job trades to find matching prospects
  const jobTrades = recentJobs.map((job) => job.primaryTrade)

  // Get top prospects - candidates matching job requirements
  let topProspects: Array<{
    id: string
    firstName: string | null
    lastName: string | null
    profileImage: string | null
    tradeCategory: TradeCategory | null
    yearsExperience: number | null
    location: string | null
    isBackgroundChecked: boolean
    isInsured: boolean
    bio: string | null
    resumeSummary: string | null
    hourlyRate: number | null
    availability: string | null
    certifications: Array<{ id: string; name: string; verified: boolean }>
    matchingJobTitle?: string
  }> = []

  if (jobTrades.length > 0) {
    const prospects = await prisma.employee.findMany({
      where: {
        isAvailableForHire: true,
        tradeCategory: {
          in: jobTrades,
        },
        // Exclude employees already in this company
        OR: [{ employerId: null }, { employerId: { not: employer.id } }],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        tradeCategory: true,
        yearsExperience: true,
        location: true,
        isBackgroundChecked: true,
        isInsured: true,
        bio: true,
        resumeSummary: true,
        hourlyRate: true,
        availability: true,
        certifications: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
      },
      orderBy: [
        { isBackgroundChecked: 'desc' },
        { yearsExperience: 'desc' },
      ],
      take: 5,
    })

    // Add matching job titles to prospects
    topProspects = prospects.map((prospect) => {
      const matchingJob = recentJobs.find(
        (job) => job.primaryTrade === prospect.tradeCategory
      )
      return {
        ...prospect,
        hourlyRate: prospect.hourlyRate ? Number(prospect.hourlyRate) : null,
        matchingJobTitle: matchingJob?.title,
      }
    })
  }

  // Calculate match count (prospects matching job requirements)
  const matchCount = jobTrades.length > 0
    ? await prisma.employee.count({
        where: {
          isAvailableForHire: true,
          tradeCategory: {
            in: jobTrades,
          },
          OR: [{ employerId: null }, { employerId: { not: employer.id } }],
        },
      })
    : 0

  // Get pitches count (hire offers sent)
  const pitchesCount = await prisma.hireOffer.count({
    where: {
      employerId: employer.id,
    },
  })

  return {
    employer: {
      id: employer.id,
      name: employer.name,
      logo: employer.logo,
    },
    currentUser: currentUser
      ? {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          profileImage: currentUser.profileImage,
        }
      : null,
    applicantCount,
    matchCount,
    messageCount,
    activeJobsCount,
    viewsCount: 0, // Placeholder - would need analytics tracking
    pitchesCount,
    recentJobs,
    topProspects,
  }
}

const OrgDetailsPage = async ({ params }: { params: { id: string } }) => {
  const dashboardData = await getDashboardData()
  return <EmployerDashboard data={dashboardData} />
}

export default OrgDetailsPage
