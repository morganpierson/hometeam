import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import { TradeCategory } from '@prisma/client'
import EmployerOnboardingForm from './EmployerOnboardingForm'

export const metadata = {
  title: 'Set Up Your Company | Skilled Trades Marketplace',
}

export default async function EmployerOnboarding() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Check if user already has an employer
  const employee = await prisma.employee.findUnique({
    where: { clerkId: user.id },
    include: { employer: true },
  })

  if (employee?.employer) {
    redirect(`/org/${employee.employer.id}`)
  }

  // Get trade category options
  const tradeCategoryOptions = Object.values(TradeCategory).map((category) => ({
    value: category,
    label: category.replace(/_/g, ' '),
  }))

  const companySizeOptions = [
    { value: 'small', label: '1-10 employees' },
    { value: 'med', label: '11-50 employees' },
    { value: 'large', label: '51-200 employees' },
    { value: 'enterprise', label: '200+ employees' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-medium">1</span>
            <span className="w-12 h-0.5 bg-slate-200"></span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 font-medium">2</span>
            <span className="w-12 h-0.5 bg-slate-200"></span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 font-medium">3</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Set up your company</h1>
          <p className="mt-3 text-lg text-slate-600">
            Tell us about your contracting business so we can help you find the right talent.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <EmployerOnboardingForm
            tradeCategoryOptions={tradeCategoryOptions}
            companySizeOptions={companySizeOptions}
            userId={user.id}
            userEmail={user.emailAddresses[0].emailAddress}
            userFirstName={user.firstName || ''}
            userLastName={user.lastName || ''}
          />
        </div>
      </div>
    </div>
  )
}
