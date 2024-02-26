'use server'

import { redirect } from 'next/navigation'
import { prisma } from './db'
import { getUserByClerkID } from './auth'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'

//USER ACTIONS

//CREATE NEW USER WITHIN EXISTING ORG
export const createNewUser = async (
  // prevState: {
  //   firstName: string
  //   lastName: string
  //   email: string
  //   availableForAcquisition: boolean
  //   profileImage: string
  //   resume: string
  //   orgId: string
  //   team: string
  // },
  formData: FormData
) => {
  const imageFile = (await formData.get('profileImage')) as File
  const resumeFile = (await formData.get('resume')) as File

  try {
    console.log('CREATING NEW USER')
    const imageBlob = await put(`profileImages/${imageFile.name}`, imageFile, {
      access: 'public',
    })

    const resumeBlob = await put(`resumes/${resumeFile.name}`, resumeFile, {
      access: 'public',
    })

    const userTeam = await prisma.team.findFirst({
      where: {
        name: formData.get('team')?.toString(),
        companyId: formData.get('orgId')?.toString(),
      },
    })

    const userOrg = await prisma.company.findFirst({
      where: {
        id: formData.get('orgId')?.toString(),
      },
    })

    const user = await prisma.user.create({
      data: {
        firstName: formData.get('firstName')?.toString(),
        lastName: formData.get('lastName')?.toString(),
        email: formData.get('email')?.toString(),
        availableForAcquisition: false,

        profileImage: imageBlob.url,
        resume: resumeBlob.url,
        role: formData.get('role')?.toString(),
        team: {
          connect: {
            id: userTeam?.id,
          },
        },
        company: {
          connect: {
            id: userOrg?.id,
          },
        },
      },
    })
    console.log('USER', user)
    revalidatePath(`/org/${formData.get('orgId')?.toString()}/edit`)
  } catch (e) {
    console.log('FUUUUCKKKK ERRORRRR')
    console.error('ERROR', e)
  }
}

//FETCH USERS TO DISPLAY ON MARKETPLACE PAGE
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

//UPDATE USER INFO
export const updateUserInfo = async (
  prevState: {
    email: string
    id: string
  },
  formData: FormData
) => {
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

//COMPANY (ORG) ACTIONS
export const updateOrgInfo = async (
  prevState: {
    name: string
    website: string
  },
  formData: FormData
) => {
  console.log('UPDATE ORG FORM DATA ', formData)
  const updatedOrg = await prisma.company.update({
    where: {
      id: formData.get('id')?.toString(),
    },
    data: {
      name: formData.get('name')?.toString() || prevState.name,
      website: formData.get('website')?.toString() || prevState.website,
    },
  })

  revalidatePath(`/org/${formData.get('id')?.toString}`)
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

  const updatedCompany = await prisma.company.update({
    where: {
      id: newCompany.id,
    },
    data: {
      employees: {
        create: [
          {
            firstName: 'John',
            lastName: 'Doe',
            team: {
              create: {
                name: 'Product',
                company: {
                  connect: {
                    id: newCompany.id,
                  },
                },
              },
            },
          },
          {
            firstName: 'Jane',
            lastName: 'Doe',
            team: {
              create: {
                name: 'Engineering',
                company: {
                  connect: {
                    id: newCompany.id,
                  },
                },
              },
            },
          },
          {
            firstName: 'Bob',
            lastName: 'Doe',
            team: {
              create: {
                name: 'Marketing',
                company: {
                  connect: {
                    id: newCompany.id,
                  },
                },
              },
            },
          },
          {
            firstName: 'Sally',
            lastName: 'Doe',
            team: {
              create: {
                name: 'Sales',
                company: {
                  connect: {
                    id: newCompany.id,
                  },
                },
              },
            },
          },
        ],
      },
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
          id: updatedCompany.id,
        },
      },
    },
  })

  await prisma.company.update({
    where: {
      id: updatedCompany.id,
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
