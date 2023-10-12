'use server'

import { redirect } from 'next/navigation'
import { prisma } from './db'

export const createNewOrg = async (formData: FormData) => {
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
