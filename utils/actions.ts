'use server'

import { redirect } from 'next/navigation'
import { prisma } from './db'
import { getUserByClerkID } from './auth'
import { revalidatePath } from 'next/cache'

export const updateUserInfo = async (
  prevState: {
    email: string
    id: string
  },
  formData: FormData
) => {
  await prisma.user.update({
    where: {
      id: formData.get('id')?.toString(),
    },
    data: {
      email: formData.get('email')?.toString(),
    },
  })

  revalidatePath(`/user/${formData.get('id')?.toString}`)
}

export const createNewOrg = async (
  prevState: {
    name: string
    size: string
    industries: string[]
  },
  formData: FormData
) => {
  console.log('CREATING NEW ORG!!!')
  const user = await getUserByClerkID()
  const newCompany = await prisma.company.create({
    data: {
      name: formData.get('orgName'),
      size: formData.get('orgSize'),
    },
  })

  const orgIndustries = await prisma.industry.findMany({
    where: {
      name: { in: formData.getAll('orgIndustries') },
    },
  })

  await prisma.user.update({
    where: {
      clerkId: user.clerkId,
    },
    data: {
      company: {
        connect: {
          id: newCompany.id,
        },
      },
    },
  })

  await prisma.company.update({
    where: {
      id: newCompany.id,
    },
    data: {
      industries: {
        connect: orgIndustries.map((org) => ({ id: org.id })),
      },
    },
  })

  const orgName = formData.get('orgName')?.toString().toLowerCase()

  redirect(`/org/${orgName}`)
}
