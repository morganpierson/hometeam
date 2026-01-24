import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import Link from 'next/link'

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

  // If employee already has an employer, redirect to dashboard
  if (employee.employerId) {
    redirect(`/org/${employee.employerId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mb-6">
            <svg className="h-8 w-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 18h20M4 18v-3a8 8 0 0116 0v3M12 3v4M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.firstName || 'Tradesperson'}!</h1>
          <p className="mt-3 text-lg text-slate-600">
            We&apos;re building out the employee experience. Check back soon!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-amber-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Coming Soon</span>
            </div>
            <p className="text-slate-600">
              The employee onboarding experience is currently under development.
              Soon you&apos;ll be able to:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-slate-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Build your professional trade profile
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Upload certifications and credentials
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Set your availability and hourly rate
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Browse and apply to job opportunities
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-4">
              Are you a contractor looking to hire? Set up your company instead.
            </p>
            <Link
              href="/new-user?role=employer"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Set up a company
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
