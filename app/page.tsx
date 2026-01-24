import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import { Footer } from '@/app/components/landing/Footer'
import { Header } from '@/app/components/landing/Header'
import { Hero } from '@/app/components/landing/Hero'
import { RoleSelector } from '@/app/components/landing/RoleSelector'
import { Faqs } from '@/app/components/landing/Faqs'

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
        <RoleSelector />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
