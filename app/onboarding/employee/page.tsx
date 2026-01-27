import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import EmployeeOnboardingForm from './employee-onboarding-form'

export const metadata = {
  title: 'Complete Your Profile | Skilled Trades Marketplace',
}

export default async function EmployeeOnboarding() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Check if user exists as employee
  const employee = await prisma.employee.findUnique({
    where: { clerkId: user.id },
  })

  if (!employee) {
    redirect('/new-user')
  }

  // If employee already has completed onboarding (has trade category), redirect to dashboard
  if (employee.tradeCategory && employee.isAvailableForHire) {
    redirect('/dashboard')
  }

  // If employee has an employer, redirect to org dashboard
  if (employee.employerId) {
    redirect(`/org/${employee.employerId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-6">
            <svg className="h-8 w-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 18h20M4 18v-3a8 8 0 0116 0v3M12 3v4M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user.firstName || 'Tradesperson'}!
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Let&apos;s set up your profile so employers can find you.
          </p>
        </div>

        <EmployeeOnboardingForm employeeId={employee.id} />
      </div>
    </div>
  )
}
