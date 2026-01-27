import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import CandidateNav from './components/candidate-nav'

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const employee = await prisma.employee.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      tradeCategory: true,
      employerId: true,
    },
  })

  // If no employee record, redirect to new-user
  if (!employee) {
    redirect('/new-user')
  }

  // If employee has an employer, redirect to org dashboard
  if (employee.employerId) {
    redirect(`/org/${employee.employerId}`)
  }

  // If no trade category, redirect to onboarding
  if (!employee.tradeCategory) {
    redirect('/onboarding/employee')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CandidateNav employee={employee} />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
