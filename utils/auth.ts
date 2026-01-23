import { auth } from '@clerk/nextjs'
import { prisma } from './db'

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export const getEmployeeByClerkID = async () => {
  const { userId } = await auth()
  if (!userId) {
    throw new AuthenticationError('Not authenticated')
  }

  const employee = await prisma.employee.findUnique({
    where: {
      clerkId: userId,
    },
  })

  if (!employee) {
    throw new AuthenticationError('Employee not found')
  }

  return employee
}

// Legacy alias for backward compatibility during migration
export const getUserByClerkID = getEmployeeByClerkID
