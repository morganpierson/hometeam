import { auth } from '@clerk/nextjs'
import { prisma } from './db'

export const getUserByClerkID = async () => {
  const { userId } = await auth()
  //console.log('CLERK USER ID ', userId)
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })
    return user
  } catch (error) {
    console.error('Error fetching user by clerk ID', error)
  }
}
