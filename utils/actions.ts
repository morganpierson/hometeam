'use server'

import { redirect } from 'next/navigation'
import { prisma } from './db'
import { getUserByClerkID } from './auth'

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

// export const updateUserInfo = async (formData: FormData, id: string) => {
//   await prisma.user.update({
//     where: {
//       id: id,
//     },
//     data: {
//       name: formData.get('name')?.toString(),
//       email: formData.get('email')?.toString(),
//       role: formData.get('role')?.toString(),
//     },
//   })
// }
