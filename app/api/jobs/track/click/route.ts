import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { prisma } from '@/utils/db'

// Track job clicks (when a candidate clicks to view job details)
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    const body = await request.json()
    const { jobId, source } = body

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    }

    // Must be logged in to track clicks
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get the clicker's employee ID
    const employee = await prisma.employee.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Create click record
    await prisma.jobClick.create({
      data: {
        jobPostingId: jobId,
        clickerId: employee.id,
        source: source || 'search',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking job click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
