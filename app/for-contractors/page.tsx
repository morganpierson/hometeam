import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import { Footer } from '@/app/components/landing/Footer'
import { EmployerHeader } from './components/EmployerHeader'
import { EmployerHero } from './components/EmployerHero'
import { EmployerFeatures } from './components/EmployerFeatures'
import { EmployerBenefits } from './components/EmployerBenefits'
import { EmployerCTA } from './components/EmployerCTA'
import { EmployerPricing } from './components/EmployerPricing'

export const metadata = {
  title: 'For Contractors - Build Your A-Team | Skilled Trades Marketplace',
  description:
    'Access top trade talent before they hit the job boards. Build, manage, and showcase your contracting team with verified credentials and portfolio.',
}

export default async function ForContractors() {
  const { userId } = await auth()

  // If user is logged in, redirect them to their dashboard
  if (userId) {
    const employee = await prisma.employee.findUnique({
      where: { clerkId: userId },
    })

    if (employee?.employerId) {
      redirect(`/org/${employee.employerId}`)
    } else if (employee) {
      redirect('/onboarding')
    } else {
      redirect('/new-user')
    }
  }

  return (
    <>
      <EmployerHeader />
      <main>
        <EmployerHero />
        <EmployerFeatures />
        <EmployerBenefits />
        <EmployerPricing />
        <EmployerCTA />
      </main>
      <Footer />
    </>
  )
}
