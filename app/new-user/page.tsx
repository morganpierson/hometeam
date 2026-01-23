import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const createNewEmployee = async () => {
  const user = await currentUser()

  console.log('NEW USER', user)
  const match = await prisma.employee.findUnique({
    where: {
      clerkId: user?.id as string,
    },
  })

  if (!match) {
    const newEmployee = await prisma.employee.create({
      data: {
        clerkId: user?.id,
        email: user?.emailAddresses[0].emailAddress,
        profileImage: user?.imageUrl,
      },
    })
    redirect('/onboarding')
  } else {
    const employerOrg = await prisma.employer.findFirst({
      where: {
        id: match.employerId ?? undefined,
      },
    })

    redirect(`/org/${employerOrg?.id}`)
  }
}

const NewUser = async () => {
  await createNewEmployee()
  return <div>New User Page</div>
}

export default NewUser
