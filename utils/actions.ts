'use server'

import { redirect } from 'next/navigation'
import { prisma } from './db'
import { getUserByClerkID } from './auth'
import { revalidatePath } from 'next/cache'
import { get } from 'http'

export const updateUserInfo = async (
  prevState: {
    email: string
    id: string
  },
  formData: FormData
) => {
  console.log('FORM DATA', formData)
  const offerAmount = parseInt(formData.get('offerAmount')?.toString() || '0')
  const acquisitionOffer = await prisma.acquisitionOffer.upsert({
    where: { userId: formData.get('id')?.toString() },
    update: {
      amount: offerAmount,
      offerType: formData.get('offerType')?.toString().toLowerCase(),
    },
    create: {
      amount: offerAmount,
      offerType: formData.get('offerType')?.toString().toLowerCase(),
      user: {
        connect: {
          id: formData.get('id')?.toString(),
        },
      },
    },
  })
  await prisma.user.update({
    where: {
      id: formData.get('id')?.toString(),
    },
    data: {
      email: formData.get('email')?.toString() || prevState.email,
      acquisitionOffer: {
        connect: {
          id: acquisitionOffer.id,
        },
      },
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

export const fetchOrgData = async () => {
  const user = await getUserByClerkID()
  const orgData = await prisma.company.findFirst({
    where: {
      employees: {
        some: {
          clerkId: user.clerkId,
        },
      },
    },
  })

  return orgData
}

export const fetchMarketplaceEmployees = async () => {
  const availableUsers = await prisma.user.findMany({
    where: {
      availableForAcquisition: true,
    },
    include: {
      company: true,
      acquisitionOffer: true,
      team: true,
    },
  })
  return availableUsers
}

export const fetchProjectData = async (id: string) => {
  const projects = await prisma.project.findMany({
    where: {
      companyId: id,
    },
    include: {
      users: true,
      teams: true,
    },
  })

  return projects
}
