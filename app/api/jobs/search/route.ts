import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/utils/db'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the candidate's profile to match jobs
    const employee = await prisma.employee.findUnique({
      where: { clerkId: userId },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const trade = searchParams.get('trade') || ''

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

    // Filter by trade category - if specified use that, otherwise match user's trade
    if (trade) {
      where.primaryTrade = trade as any
    }

    const jobs = await prisma.jobPosting.findMany({
      where,
      orderBy: [
        // Prioritize jobs matching user's trade
        { createdAt: 'desc' },
      ],
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
            avgRating: true,
            totalReviews: true,
          },
        },
        _count: {
          select: {
            applications: true,
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

    return NextResponse.json({
      jobs: sortedJobs,
      userTrade: employee.tradeCategory,
      userLocation: employee.location,
    })
  } catch (error) {
    console.error('Error searching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    )
  }
}
