import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import { Prisma } from '@prisma/client'
import JobSearch from './job-search'
import JobList from './job-list'

// Revalidate job listings every 60 seconds for better performance
export const revalidate = 60

interface PageProps {
  searchParams: { q?: string; location?: string }
}

export default async function FindWorkPage({ searchParams }: PageProps) {
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

  const query = searchParams.q || ''
  const location = searchParams.location || ''

  // Build the where clause
  const where: Prisma.JobPostingWhereInput = {
    status: 'ACTIVE',
  }

  // Search by title
  if (query) {
    where.title = {
      contains: query,
      mode: 'insensitive',
    }
  }

  // Filter by location (city or state)
  if (location) {
    where.OR = [
      { city: { contains: location, mode: 'insensitive' } },
      { state: { contains: location, mode: 'insensitive' } },
    ]
  }

  const jobs = await prisma.jobPosting.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          logo: true,
          description: true,
          size: true,
          city: true,
          state: true,
        },
      },
    },
  })

  // Sort to prioritize jobs matching user's trade category
  const sortedJobs = jobs.sort((a, b) => {
    const aMatchesTrade = a.primaryTrade === employee.tradeCategory ? 1 : 0
    const bMatchesTrade = b.primaryTrade === employee.tradeCategory ? 1 : 0
    return bMatchesTrade - aMatchesTrade
  })

  // Serialize the jobs data to avoid Decimal serialization issues
  const serializedJobs = sortedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    description: job.description,
    jobType: job.jobType,
    primaryTrade: job.primaryTrade,
    city: job.city,
    state: job.state,
    isRemote: job.isRemote,
    payType: job.payType,
    payRangeMin: job.payRangeMin ? Number(job.payRangeMin) : null,
    payRangeMax: job.payRangeMax ? Number(job.payRangeMax) : null,
    minYearsExperience: job.minYearsExperience,
    requiredCertifications: job.requiredCertifications,
    benefits: job.benefits,
    createdAt: job.createdAt.toISOString(),
    employer: job.employer,
  }))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Work</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse job opportunities that match your skills
        </p>
      </div>

      <JobSearch
        defaultLocation={employee.location}
        initialQuery={query}
        initialLocation={location}
      />

      <JobList
        jobs={serializedJobs}
        userTrade={employee.tradeCategory}
        query={query}
        location={location}
      />
    </div>
  )
}
