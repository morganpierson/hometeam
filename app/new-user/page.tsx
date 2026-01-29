import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface NewUserProps {
  searchParams: { role?: string }
}

const NewUser = async ({ searchParams }: NewUserProps) => {
  const user = await currentUser()
  const role = searchParams.role

  if (!user) {
    redirect('/sign-in')
  }

  const userEmail = user.emailAddresses[0]?.emailAddress

  // Check if user already exists as an employee (by clerkId first, then by email)
  let existingEmployee = await prisma.employee.findUnique({
    where: {
      clerkId: user.id,
    },
  })

  // If not found by clerkId, check by email (handles seed data or existing accounts)
  if (!existingEmployee && userEmail) {
    existingEmployee = await prisma.employee.findUnique({
      where: {
        email: userEmail,
      },
    })

    // If found by email, link the clerkId to this existing record
    if (existingEmployee) {
      existingEmployee = await prisma.employee.update({
        where: { id: existingEmployee.id },
        data: {
          clerkId: user.id,
          firstName: user.firstName || existingEmployee.firstName,
          lastName: user.lastName || existingEmployee.lastName,
          profileImage: user.imageUrl || existingEmployee.profileImage,
        },
      })
    }
  }

  // If existing employee with an employer, redirect to dashboard
  if (existingEmployee?.employerId) {
    redirect(`/org/${existingEmployee.employerId}`)
  }

  // Helper function to ensure employee record exists
  const ensureEmployeeExists = async () => {
    if (!existingEmployee) {
      return await prisma.employee.create({
        data: {
          clerkId: user.id,
          email: userEmail,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.imageUrl,
        },
      })
    }
    return existingEmployee
  }

  // If role is employer, redirect to employer onboarding
  if (role === 'employer') {
    await ensureEmployeeExists()
    redirect('/onboarding/employer')
  }

  // If role is employee, create employee and redirect to employee onboarding
  if (role === 'employee') {
    await ensureEmployeeExists()
    redirect('/onboarding/employee')
  }

  // If existing employee but no role specified, redirect to their appropriate onboarding
  if (existingEmployee) {
    // If they haven't completed onboarding, send to employee onboarding
    if (!existingEmployee.tradeCategory) {
      redirect('/onboarding/employee')
    }
    // Otherwise send to dashboard
    redirect('/dashboard')
  }

  // No role specified - show role selection
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Welcome to Skilled Trades Marketplace</h1>
          <p className="mt-3 text-lg text-slate-600">Let&apos;s get you set up. What brings you here?</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Employer Option */}
          <Link
            href="/new-user?role=employer"
            className="group relative flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:border-amber-500 hover:shadow-lg transition-all"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-white">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15M9 9v.01M9 12v.01M9 15v.01M9 18v.01M17 9v.01M17 12v.01M17 15v.01M17 18v.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-900 group-hover:text-amber-600">
              I run a contracting company
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Find and hire verified trade workers, manage your team, and showcase your portfolio.
            </p>
            <div className="mt-6 flex items-center text-sm font-semibold text-amber-600">
              Get started
              <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Employee Option */}
          <Link
            href="/new-user?role=employee"
            className="group relative flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:border-amber-500 hover:shadow-lg transition-all"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-white">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 18h20M4 18v-3a8 8 0 0116 0v3M12 3v4M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-900 group-hover:text-amber-600">
              I&apos;m a skilled tradesperson
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Build your professional profile, find job opportunities, and grow your career.
            </p>
            <div className="mt-6 flex items-center text-sm font-semibold text-amber-600">
              Get started
              <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Client option - coming soon */}
        <div className="mt-6 p-6 rounded-xl border border-slate-200 bg-white/50 text-center">
          <p className="text-sm text-slate-500">
            Need work done on a project?{' '}
            <span className="font-medium text-slate-700">Client accounts coming soon.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NewUser
