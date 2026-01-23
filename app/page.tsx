import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import { CallToAction } from '@/app/components/landing/CallToAction'
import { Faqs } from '@/app/components/landing/Faqs'
import { Footer } from '@/app/components/landing/Footer'
import { Header } from '@/app/components/landing/Header'
import { Hero } from '@/app/components/landing/Hero'
import { Pricing } from '@/app/components/landing/Pricing'
import { PrimaryFeatures } from '@/app/components/landing/PrimaryFeatures'
import { SecondaryFeatures } from '@/app/components/landing/SecondaryFeatures'

export default async function Home() {
  const { userId } = await auth()

  // If user is logged in, redirect them to their dashboard
  if (userId) {
    const employee = await prisma.employee.findUnique({
      where: {
        clerkId: userId as string,
      },
    })

    if (employee?.employerId) {
      redirect(`/org/${employee.employerId}`)
    } else if (employee) {
      redirect('/onboarding')
    } else {
      redirect('/new-user')
    }
  }

  // Show landing page for non-authenticated users
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <Pricing />
        <Faqs />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
