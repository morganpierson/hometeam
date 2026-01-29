import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'

export default async function Onboarding() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Check if user exists as employee
  const employee = await prisma.employee.findUnique({
    where: { clerkId: user.id },
  })

  if (!employee) {
    // No employee record, go to new-user flow
    redirect('/new-user')
  }

  if (employee.employerId) {
    // Already has an employer, go to org dashboard
    redirect(`/org/${employee.employerId}`)
  }

  // Employee exists but hasn't completed onboarding - go to employee onboarding
  if (!employee.tradeCategory) {
    redirect('/onboarding/employee')
  }

  // Employee has completed onboarding, go to candidate dashboard
  redirect('/dashboard')
}
