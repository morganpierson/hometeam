import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/utils/db'

// Track job impressions (when jobs appear in search results)
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const body = await request.json()
    const { jobIds, source } = body

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json({ error: 'Job IDs required' }, { status: 400 })
    }

    // Get the viewer's employee ID if logged in
    let viewerId: string | null = null
    if (userId) {
      const employee = await prisma.employee.findUnique({
        where: { clerkId: userId },
        select: { id: true },
      })
      viewerId = employee?.id || null
    }

    // Create view records for all jobs
    await prisma.jobView.createMany({
      data: jobIds.map((jobPostingId: string) => ({
        jobPostingId,
        viewerId,
        source: source || 'search',
      })),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking job views:', error)
    return NextResponse.json({ error: 'Failed to track views' }, { status: 500 })
  }
}
