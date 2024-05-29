'use server'

import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server' // To handle the request and response
import { prisma } from './db'
import { getUserByClerkID } from './auth'
import { promises as fs } from 'fs' // To save the file temporarily
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import OpenAI from 'openai'
import PDFParser from 'pdf2json'
import { v4 as uuidv4 } from 'uuid' // To generate a unique filename
import { split } from 'postcss/lib/list'

const openai = new OpenAI({
  apiKey: process.env['OPEN_AI_API_KEY'],
})

const splitText = async (text: String) => {
  console.log('SPLIT TEXT ARG STRING', text)
  const maxChunkSize = 2048
  let chunks = []
  let currentChunk = ''
  console.log('SPLIT TEXT', text.split(/(?=[A-Z])/))
  text.split(/(?=[A-Z])/).forEach((sentence) => {
    if (currentChunk.length + sentence.length < maxChunkSize) {
      currentChunk += sentence + '.'
    } else {
      chunks.push(currentChunk.trim())
      currentChunk = sentence + '.'
    }
  })

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }
  console.log('CHUNKS', chunks)
  return chunks
}

const generateSummary = async (text, firstName) => {
  const inputChunks = await splitText(text)
  let outputChunks = []

  for (let chunk of inputChunks) {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Summarize the following text in 2 sentences or less. Summarize it in the third person narrative of ${firstName}: \n${chunk}\n`,
        },
      ],
      model: 'gpt-3.5-turbo',
    })
    outputChunks.push(response.choices[0].message.content)
  }

  return outputChunks.join(' ')
}

//PARSE RESUME WORKING AS OF May 28. NEED TO ADD SUMMARY GENERATION to createNewUser and add summary to user model
const parseResume = async (formData: any) => {
  const uploadedFiles = formData.get('resume')
  console.log('UPLOADED FILES', uploadedFiles)
  let fileName = ''
  let parsedText = ''

  if (uploadedFiles) {
    const uploadedFile = uploadedFiles
    console.log('Uploaded file:', uploadedFile)

    // Check if uploadedFile is of type File
    if (uploadedFile instanceof File) {
      // Generate a unique filename
      fileName = uuidv4()

      // Convert the uploaded file into a temporary file
      const tempFilePath = `/tmp/${fileName}.pdf`

      // Convert ArrayBuffer to Buffer
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer())

      // Save the buffer as a file
      await fs.writeFile(tempFilePath, fileBuffer)

      // Parse the pdf using pdf2json. See pdf2json docs for more info.

      // The reason I am bypassing type checks is because
      // the default type definitions for pdf2json in the npm install
      // do not allow for any constructor arguments.
      // You can either modify the type definitions or bypass the type checks.
      // I chose to bypass the type checks.
      const pdfParser = new (PDFParser as any)(null, 1)

      // See pdf2json docs for more info on how the below works.
      pdfParser.on('pdfParser_dataError', (errData: any) =>
        console.log(errData.parserError)
      )

      pdfParser.on('pdfParser_dataReady', async () => {
        parsedText = (pdfParser as any).getRawTextContent()

        const summary = await generateSummary(
          parsedText,
          formData.get('firstName')?.toString() || ''
        )
        console.log('SUMMARY', summary)
      })

      await pdfParser.loadPDF(tempFilePath)

      return parsedText
    } else {
      console.log('Uploaded file is not in the expected format.')
    }
  } else {
    console.log('No files found.')
  }

  // const response = new NextResponse(parsedText)
  // response.headers.set('FileName', fileName)
  // return response
}

//USER ACTIONS

//Saves user profile image to vercel blob
const saveUserImage = async (imageFile: File) => {
  try {
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer())
    const profileImage = await put(
      `profileImages/${imageFile.name}`,
      fileBuffer,
      { access: 'public' }
    )
    return profileImage
  } catch (error) {
    console.error('Error saving user image', error)
  }
}

//Saves user resume to vercel blob
const saveUserResume = async (resumeFile: File) => {
  try {
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer())

    const resumeBlob = await put(`resumes/${resumeFile.name}`, fileBuffer, {
      access: 'public',
    })

    return resumeBlob
  } catch (error) {
    console.error('Error saving user resume', error)
  }
}

//CREATE NEW USER WITHIN EXISTING ORG
export const createNewUser = async (formData: FormData) => {
  const imageFile = formData.get('profileImage') as File
  const resumeFile = formData.get('resume') as File
  // const resumeBlob = await saveUserResume(resumeFile)
  //const imageBlob = await saveUserImage(imageFile)
  const parsedResume = await parseResume(formData)
  // console.log('CHAT GPT RESPONSE', completion.choices)
  // try {
  //   console.log('CREATING NEW USER')
  //   const imageBlob = await saveUserImage(imageFile)

  //   const resumeBlob = await saveUserResume(resumeFile)

  //   const userTeam = await prisma.team.findFirst({
  //     where: {
  //       name: formData.get('team')?.toString(),
  //       companyId: formData.get('orgId')?.toString(),
  //     },
  //   })

  //   const userOrg = await prisma.company.findFirst({
  //     where: {
  //       id: formData.get('orgId')?.toString(),
  //     },
  //   })

  //   const user = await prisma.user.create({
  //     data: {
  //       firstName: formData.get('firstName')?.toString(),
  //       lastName: formData.get('lastName')?.toString(),
  //       email: formData.get('email')?.toString(),
  //       availableForAcquisition: false,

  //       profileImage: imageBlob.url,
  //       resume: resumeBlob.downloadUrl,
  //       role: formData.get('role')?.toString(),
  //       team: {
  //         connect: {
  //           id: userTeam?.id,
  //         },
  //       },
  //       company: {
  //         connect: {
  //           id: userOrg?.id,
  //         },
  //       },
  //     },
  //   })
  //   console.log('USER', user)
  //   revalidatePath(`/org/${formData.get('orgId')?.toString()}/edit`)
  // } catch (e) {
  //   console.error('ERROR', e)
  // }
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

export const fetchUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      company: true,
      acquisitionOffer: true,
      team: true,
    },
  })
  return user
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
  console.log('FORM DATA', formData)
  const user = await prisma.user.findUnique({
    where: {
      id: formData.get('id')?.toString(),
    },
    include: {
      acquisitionOffer: true,
    },
  })
  const acquisitionOffer = await prisma.acquisitionOffer.upsert({
    where: { userId: formData.get('id')?.toString() },
    update: {
      amount: offerAmount || user?.acquisitionOffer?.amount,
      offerType:
        formData.get('offerType')?.toString().toLowerCase() ||
        user?.acquisitionOffer?.offerType,
    },
    create: {
      amount: offerAmount,
      offerType: formData.get('offerType')?.toString().toLowerCase(),
      user: {
        connect: {
          id: formData.get('id')?.toString(),
        },
      },
      offeringCompany: {
        connect: {
          id: formData.get('orgId')?.toString(),
        },
      },
    },
  })

  await prisma.user.update({
    where: {
      id: formData.get('id')?.toString(),
    },
    data: {
      email: formData.get('email')?.toString() || user?.email,
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
  const logoFile = formData.get('logo') as File

  const currentOrg = await prisma.company.findFirst({
    where: {
      id: formData.get('id')?.toString(),
    },
  })
  const logoBlob = await put(
    `logos/${currentOrg?.name}/${logoFile.name}`,
    logoFile,
    {
      access: 'public',
    }
  )
  const updatedOrg = await prisma.company.update({
    where: {
      id: formData.get('id')?.toString(),
    },
    data: {
      name: formData.get('name')?.toString() || currentOrg?.name || '',
      website: formData.get('website')?.toString() || currentOrg?.website || '',
      logo: logoBlob.url ? logoBlob.url : currentOrg?.logo || '',
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
      name: formData.get('orgName') ? formData.get('orgName')!.toString() : '',
      size: formData.get('orgSize') ? formData.get('orgSize')!.toString() : '',
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

  // const orgIndustries = await prisma.industry.findMany({
  //   where: {
  //     name: { in: formData.getAll('orgIndustries') },
  //   },
  // })

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      company: {
        connect: {
          id: updatedCompany.id,
        },
      },
    },
  })

  // await prisma.company.update({
  //   where: {
  //     id: updatedCompany.id,
  //   },
  //   data: {
  //     industries: {
  //       connect: orgIndustries.map((org) => ({ id: org.id })),
  //     },
  //   },
  // })

  const orgName = formData.get('orgName')?.toString().toLowerCase()

  redirect(`/org/${orgName}`)
}

export const fetchOrgData = async () => {
  const user = await getUserByClerkID()
  console.log('USER WHILE FETCHING ORG DATA', user)
  try {
    const orgData = await prisma.company.findFirst({
      where: {
        employees: {
          some: {
            clerkId: user.clerkId,
          },
        },
      },
      include: {
        employees: true,
        teams: true,
        savedCandidates: true,
        messageThreads: true,
      },
    })

    return orgData
  } catch (error) {
    console.error('Error fetching org data', error)
  }
}

export const fetchMessageThreads = async (id: string) => {
  const threads = await prisma.messageThread.findMany({
    where: {
      companies: {
        some: {
          id: id,
        },
      },
    },
    include: {
      messages: {
        include: {
          sendingCompany: true,
          receivingCompany: true,
        },
      },
      companies: true,
      offer: {
        include: {
          user: true,
        },
      },
    },
  })

  return threads
}

export const fetchThreadDetails = async (id: string) => {
  const threadDetails = await prisma.messageThread.findFirst({
    where: {
      id: id,
    },
    include: {
      messages: {
        include: {
          sendingCompany: true,
          receivingCompany: true,
        },
      },
      offer: {
        include: {
          user: true,
        },
      },
    },
  })

  return threadDetails
}

export const saveCandidate = async (formData: FormData) => {
  const currentUser = await getUserByClerkID()
  const savedCandidate = formData.get('userId')?.toString()
  const savedUser = await prisma.user.findFirst({
    where: {
      id: savedCandidate,
    },
  })
  const company = await prisma.company.findFirst({
    where: {
      employees: {
        some: {
          clerkId: currentUser.clerkId,
        },
      },
    },
  })

  await prisma.company.update({
    where: {
      id: company?.id,
    },
    data: {
      savedCandidates: {
        connect: {
          id: savedUser?.id,
        },
      },
    },
  })

  revalidatePath(`/marketplace`)
}

export const getSavedCandidates = async (id: string) => {
  const candidates = await prisma.user.findMany({
    where: {
      interestedCompanies: {
        some: {
          id: id,
        },
      },
    },
    include: {
      company: true,
      acquisitionOffer: true,
      team: true,
    },
  })

  // const company = await prisma.company.findFirst({
  //   where: {
  //     employees: {
  //       some: {
  //         id: currentUser.id,
  //       },
  //     },
  //   },
  //   include: {
  //     savedCandidates: true,
  //     teams: true,
  //   },
  // })

  return candidates
}

//MESSAGE ACTIONS
export const sendMessage = async (formData: FormData) => {
  //get the id of the company that is sending the message and the id of the company receiving the message
  //then create a message and reference the two company ids
  //then create a thread and connect the new message to that thread
  console.log('SEND MESSAGE FIRED')
  const sendingUser = await getUserByClerkID()
  const receivingCompany = await prisma.company.findFirst({
    where: {
      employees: {
        some: {
          id: formData.get('candidate')?.toString(),
        },
      },
    },
  })
  const sendingCompany = await prisma.company.findFirst({
    where: {
      //find company that contains a user with the user.id
      employees: {
        some: {
          id: sendingUser.id,
        },
      },
    },
  })
  const acquisitionOffer = await prisma.acquisitionOffer.findFirst({
    where: {
      userId: formData.get('candidate')?.toString(),
    },
  })
  console.log('ACQUISITION OFFER', acquisitionOffer)
  const messageThread = await prisma.messageThread.create({
    data: {
      messages: {
        create: {
          message: formData.get('message')?.toString() || '',
          sendingCompany: {
            connect: {
              id: sendingCompany?.id,
            },
          },
          receivingCompany: {
            connect: {
              id: receivingCompany?.id,
            },
          },
        },
      },
      offer: {
        connect: {
          id: acquisitionOffer?.id,
        },
      },
      companies: {
        connect: [
          {
            id: sendingCompany?.id,
          },
          {
            id: receivingCompany?.id,
          },
        ],
      },
    },
  })
  console.log('MESSAGE THREAD', messageThread)
}

//TEAM ACTIONS
export const createNewTeam = async (formData: FormData) => {
  const user = await getUserByClerkID()
  console.log('CREATE NEW TEAM FIRED')

  console.log('TRYING TO CREATE A TEAM')
  console.log('FORM DATA', formData)
  let imageBlob
  try {
    const logoFile = formData.get('teamLogo') as File
    console.log('LOGO FILE', logoFile)
    imageBlob = await put(`teamLogos/${logoFile.name}`, logoFile, {
      access: 'public',
    })
    console.log('IMAGE BLOB', imageBlob.url)
  } catch (e) {
    console.error('ERROR', e)
  }

  try {
    await prisma.team.create({
      data: {
        name: formData.get('teamName')?.toString() ?? '',
        logo: imageBlob?.url || '',
        company: {
          connect: {
            id: user.companyId || '',
          },
        },
      },
    })
    revalidatePath(`/org/${user.companyId}/edit`)
  } catch (e) {
    console.error('ERROR', e)
  }
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
