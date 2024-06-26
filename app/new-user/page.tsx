import { prisma } from '@/utils/db'
import { auth, currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const createNewUser = async () => {
  const user = await currentUser()

  console.log('NEW USER', user)
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user?.id as string,
    },
  })

  if (!match) {
    const newUser = await prisma.user.create({
      data: {
        clerkId: user?.id,
        email: user?.emailAddresses[0].emailAddress,
        profileImage: user?.imageUrl,
      },
    })
    redirect('/onboarding')
  } else {
    const userOrg = await prisma.company.findFirst({
      where: {
        id: match.companyId,
      },
    })

    redirect(`/org/${userOrg?.id}`)
  }
}

const NewUser = async () => {
  await createNewUser()
  return <div>New User Page</div>
}

export default NewUser
