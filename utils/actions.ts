'use server'

import { redirect } from 'next/navigation'
import { prisma } from './db'
import { getEmployeeByClerkID } from './auth'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import OpenAI from 'openai'
import pdfParse from 'pdf-parse'
import { TradeCategory, ParticipantType } from '@prisma/client'

// Action result type
type ActionResult = {
  success: boolean
  error?: string
  data?: unknown
}

const openai = new OpenAI({
  apiKey: process.env['OPEN_AI_API_KEY'],
})

const splitText = async (text: string): Promise<string[]> => {
  const maxChunkSize = 2048
  const chunks: string[] = []
  let currentChunk = ''
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
  return chunks
}

const generateSummary = async (
  text: string,
  firstName: string
): Promise<string[]> => {
  const inputChunks = await splitText(text)
  const outputChunks: string[] = []

  for (const chunk of inputChunks) {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Summarize the following text in 2 sentences or less. Summarize it in the third person narrative of ${firstName}: \n${chunk}\n`,
        },
      ],
      model: 'gpt-3.5-turbo',
    })
    const content = response.choices[0].message.content
    if (content) {
      outputChunks.push(content)
    }
  }

  return outputChunks
}

const parseResume = async (formData: FormData): Promise<string | null> => {
  const uploadedFiles = formData.get('resume')

  if (!uploadedFiles) {
    return null
  }

  const uploadedFile = uploadedFiles

  if (!(uploadedFile instanceof File)) {
    console.error('Uploaded file is not in the expected format.')
    return null
  }

  try {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer())
    const data = await pdfParse(fileBuffer)
    const parsedText = data.text

    const firstName = formData.get('firstName')?.toString() || ''
    const summaryChunks = await generateSummary(parsedText, firstName)
    const summary = summaryChunks.join(' ')

    return summary
  } catch (error) {
    console.error('PDF parsing error:', error)
    return null
  }
}

// ============================================================================
// EMPLOYEE ACTIONS
// ============================================================================

// Saves employee profile image to vercel blob
const saveEmployeeImage = async (imageFile: File) => {
  try {
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer())
    const profileImage = await put(
      `profileImages/${imageFile.name}`,
      fileBuffer,
      { access: 'public' }
    )
    return profileImage
  } catch (error) {
    console.error('Error saving employee image:', error)
    throw error
  }
}

// Saves employee resume to vercel blob
const saveEmployeeResume = async (resumeFile: File) => {
  try {
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer())

    const resumeBlob = await put(`resumes/${resumeFile.name}`, fileBuffer, {
      access: 'public',
    })

    return resumeBlob
  } catch (error) {
    console.error('Error saving employee resume:', error)
    throw error
  }
}

// CREATE NEW EMPLOYEE WITHIN EXISTING EMPLOYER
export const createNewEmployee = async (
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  const imageFile = formData.get('profileImage') as File
  const resumeFile = formData.get('resume') as File

  try {
    const [imageBlob, resumeBlob, resumeSummary] = await Promise.all([
      saveEmployeeImage(imageFile),
      saveEmployeeResume(resumeFile),
      parseResume(formData),
    ])

    const employer = await prisma.employer.findFirst({
      where: {
        id: formData.get('employerId')?.toString(),
      },
    })

    // Parse trade category if provided
    const tradeCategoryStr = formData.get('tradeCategory')?.toString()
    const tradeCategory = tradeCategoryStr ? tradeCategoryStr as TradeCategory : null

    await prisma.employee.create({
      data: {
        firstName: formData.get('firstName')?.toString(),
        lastName: formData.get('lastName')?.toString(),
        email: formData.get('email')?.toString(),
        phone: formData.get('phone')?.toString(),
        isAvailableForHire: false,
        profileImage: imageBlob.url,
        resume: resumeBlob.downloadUrl,
        resumeSummary: resumeSummary,
        location: formData.get('location')?.toString(),
        tradeCategory: tradeCategory,
        yearsExperience: formData.get('yearsExperience')
          ? parseInt(formData.get('yearsExperience')!.toString())
          : null,
        hourlyRate: formData.get('hourlyRate')
          ? parseFloat(formData.get('hourlyRate')!.toString())
          : null,
        employer: {
          connect: {
            id: employer?.id,
          },
        },
      },
    })

    revalidatePath(`/org/${formData.get('employerId')?.toString()}/edit`)
    return { success: true }
  } catch (error) {
    console.error('Error creating employee:', error)
    return { success: false, error: 'Failed to create employee' }
  }
}

// FETCH EMPLOYEES TO DISPLAY ON MARKETPLACE PAGE
export const fetchMarketplaceEmployees = async () => {
  const availableEmployees = await prisma.employee.findMany({
    where: {
      isAvailableForHire: true,
    },
    include: {
      employer: true,
      hireOffers: true,
      certifications: true,
      ownedPortfolioItems: true,
      contributions: true,
    },
  })
  return availableEmployees
}

export const fetchEmployee = async (id: string) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: id,
    },
    include: {
      employer: true,
      hireOffers: true,
      certifications: true,
      ownedPortfolioItems: true,
      contributions: true,
      serviceAreas: true,
      reviewsReceived: true,
    },
  })
  return employee
}

// UPDATE EMPLOYEE INFO
export const updateEmployeeInfo = async (
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const employee = await prisma.employee.findUnique({
      where: {
        id: formData.get('id')?.toString(),
      },
    })

    // Parse trade category if provided
    const tradeCategoryStr = formData.get('tradeCategory')?.toString()
    const tradeCategory = tradeCategoryStr ? tradeCategoryStr as TradeCategory : undefined

    await prisma.employee.update({
      where: {
        id: formData.get('id')?.toString(),
      },
      data: {
        email: formData.get('email')?.toString() || employee?.email,
        firstName: formData.get('firstName')?.toString() || employee?.firstName,
        lastName: formData.get('lastName')?.toString() || employee?.lastName,
        phone: formData.get('phone')?.toString() || employee?.phone,
        location: formData.get('location')?.toString() || employee?.location,
        bio: formData.get('bio')?.toString() || employee?.bio,
        tradeCategory: tradeCategory || employee?.tradeCategory,
        yearsExperience: formData.get('yearsExperience')
          ? parseInt(formData.get('yearsExperience')!.toString())
          : employee?.yearsExperience,
        hourlyRate: formData.get('hourlyRate')
          ? parseFloat(formData.get('hourlyRate')!.toString())
          : employee?.hourlyRate,
        isAvailableForHire: formData.get('isAvailableForHire') === 'true',
      },
    })

    revalidatePath(`/employee/${formData.get('id')?.toString()}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating employee:', error)
    return { success: false, error: 'Failed to update employee' }
  }
}

// ============================================================================
// EMPLOYER ACTIONS
// ============================================================================

export const updateEmployerInfo = async (
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const logoFile = formData.get('logo') as File | null
    const employerId = formData.get('id')?.toString()

    const currentEmployer = await prisma.employer.findFirst({
      where: {
        id: employerId,
      },
    })

    if (!currentEmployer) {
      return { success: false, error: 'Employer not found' }
    }

    // Only upload logo if a new file is provided
    let logoUrl = currentEmployer.logo
    if (logoFile && logoFile.size > 0) {
      const logoBlob = await put(
        `logos/${currentEmployer.name}/${logoFile.name}`,
        logoFile,
        {
          access: 'public',
        }
      )
      logoUrl = logoBlob.url
    }

    // Parse specialties from form (multiple checkbox values)
    const specialtiesEntries = formData.getAll('specialties')
    const specialties = specialtiesEntries.length > 0
      ? specialtiesEntries.map(s => s.toString() as TradeCategory)
      : currentEmployer.specialties

    await prisma.employer.update({
      where: {
        id: employerId,
      },
      data: {
        name: formData.get('name')?.toString() || currentEmployer.name,
        website: formData.get('website')?.toString() ?? currentEmployer.website,
        logo: logoUrl,
        description: formData.get('description')?.toString() ?? currentEmployer.description,
        contactEmail: formData.get('contactEmail')?.toString() ?? currentEmployer.contactEmail,
        contactPhone: formData.get('contactPhone')?.toString() ?? currentEmployer.contactPhone,
        address: formData.get('address')?.toString() ?? currentEmployer.address,
        city: formData.get('city')?.toString() ?? currentEmployer.city,
        state: formData.get('state')?.toString() ?? currentEmployer.state,
        zipCode: formData.get('zipCode')?.toString() ?? currentEmployer.zipCode,
        specialties: specialties,
        isInsured: formData.get('isInsured') === 'on',
        isLicensed: formData.get('isLicensed') === 'on',
        licenseNumber: formData.get('licenseNumber')?.toString() ?? currentEmployer.licenseNumber,
      },
    })

    revalidatePath(`/org/${employerId}`)
    revalidatePath(`/org/${employerId}/edit`)
    return { success: true }
  } catch (error) {
    console.error('Error updating employer:', error)
    return { success: false, error: 'Failed to update employer' }
  }
}

export const createNewEmployer = async (
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const employee = await getEmployeeByClerkID()

    const newEmployer = await prisma.employer.create({
      data: {
        name: formData.get('orgName') ? formData.get('orgName')!.toString() : '',
        size: formData.get('orgSize') ? formData.get('orgSize')!.toString() : '',
      },
    })

    await prisma.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        employer: {
          connect: {
            id: newEmployer.id,
          },
        },
        isAdmin: true,
      },
    })

    const orgName = formData.get('orgName')?.toString().toLowerCase()

    redirect(`/org/${orgName}`)
  } catch (error) {
    // redirect throws an error, so we need to rethrow it
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Error creating employer:', error)
    return { success: false, error: 'Failed to create employer' }
  }
}

export const fetchEmployerData = async () => {
  try {
    const employee = await getEmployeeByClerkID()

    const employerData = await prisma.employer.findFirst({
      where: {
        employees: {
          some: {
            clerkId: employee.clerkId,
          },
        },
      },
      include: {
        employees: true,
        portfolio: true,
        savedCandidates: true,
        conversations: true,
        serviceAreas: true,
        projectAssignments: true,
      },
    })

    return employerData
  } catch (error) {
    console.error('Error fetching employer data:', error)
    return null
  }
}

// ============================================================================
// CONVERSATION / MESSAGE ACTIONS
// ============================================================================

export const fetchConversations = async (employerId: string) => {
  const conversations = await prisma.conversation.findMany({
    where: {
      employers: {
        some: {
          id: employerId,
        },
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      employers: true,
      employees: true,
      clients: true,
      hireOffer: {
        include: {
          employee: true,
        },
      },
    },
  })

  return conversations
}

export const fetchConversationDetails = async (id: string) => {
  const conversationDetails = await prisma.conversation.findFirst({
    where: {
      id: id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      employers: true,
      employees: true,
      clients: true,
      hireOffer: {
        include: {
          employee: true,
          employer: true,
        },
      },
      project: true,
    },
  })

  return conversationDetails
}

export const saveCandidate = async (
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const currentEmployee = await getEmployeeByClerkID()
    const savedCandidateId = formData.get('employeeId')?.toString()

    const savedEmployee = await prisma.employee.findFirst({
      where: {
        id: savedCandidateId,
      },
    })

    const employer = await prisma.employer.findFirst({
      where: {
        employees: {
          some: {
            clerkId: currentEmployee.clerkId,
          },
        },
      },
    })

    await prisma.employer.update({
      where: {
        id: employer?.id,
      },
      data: {
        savedCandidates: {
          connect: {
            id: savedEmployee?.id,
          },
        },
      },
    })

    revalidatePath(`/marketplace`)
    return { success: true }
  } catch (error) {
    console.error('Error saving candidate:', error)
    return { success: false, error: 'Failed to save candidate' }
  }
}

export const getSavedCandidates = async (employerId: string) => {
  const employer = await prisma.employer.findUnique({
    where: {
      id: employerId,
    },
    include: {
      savedCandidates: {
        include: {
          employer: true,
          hireOffers: true,
          certifications: true,
        },
      },
    },
  })

  return employer?.savedCandidates || []
}

// Send a message (for hire offers or general communication)
export const sendMessage = async (
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const sendingEmployee = await getEmployeeByClerkID()
    const candidateId = formData.get('candidateId')?.toString()
    const message = formData.get('message')?.toString() || ''

    // Get the candidate's employer
    const candidate = await prisma.employee.findFirst({
      where: {
        id: candidateId,
      },
      include: {
        employer: true,
      },
    })

    // Get the sending employee's employer
    const sendingEmployer = await prisma.employer.findFirst({
      where: {
        employees: {
          some: {
            id: sendingEmployee.id,
          },
        },
      },
    })

    if (!sendingEmployer || !candidate) {
      return { success: false, error: 'Could not find employer or candidate' }
    }

    // Create a conversation with the initial message
    await prisma.conversation.create({
      data: {
        employers: {
          connect: [
            { id: sendingEmployer.id },
            ...(candidate.employer ? [{ id: candidate.employer.id }] : []),
          ],
        },
        employees: {
          connect: {
            id: candidate.id,
          },
        },
        messages: {
          create: {
            content: message,
            senderId: sendingEmployer.id,
            senderType: ParticipantType.EMPLOYER,
          },
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: 'Failed to send message' }
  }
}

// Create a hire offer
export const createHireOffer = async (formData: FormData): Promise<ActionResult> => {
  try {
    const sendingEmployee = await getEmployeeByClerkID()
    const candidateId = formData.get('candidateId')?.toString()
    const offeredRate = formData.get('offeredRate')?.toString()
    const rateType = formData.get('rateType')?.toString()
    const message = formData.get('message')?.toString()

    const sendingEmployer = await prisma.employer.findFirst({
      where: {
        employees: {
          some: {
            id: sendingEmployee.id,
          },
        },
      },
    })

    if (!sendingEmployer || !candidateId) {
      return { success: false, error: 'Could not find employer or candidate' }
    }

    // Create conversation first
    const conversation = await prisma.conversation.create({
      data: {
        employers: {
          connect: {
            id: sendingEmployer.id,
          },
        },
        employees: {
          connect: {
            id: candidateId,
          },
        },
        messages: {
          create: {
            content: message || `Hire offer: $${offeredRate} (${rateType})`,
            senderId: sendingEmployee.id,
            senderType: ParticipantType.EMPLOYEE,
          },
        },
      },
    })

    // Create the hire offer linked to conversation
    await prisma.hireOffer.create({
      data: {
        offeredRate: offeredRate ? parseFloat(offeredRate) : null,
        rateType: rateType,
        message: message,
        employer: {
          connect: {
            id: sendingEmployer.id,
          },
        },
        employee: {
          connect: {
            id: candidateId,
          },
        },
        conversation: {
          connect: {
            id: conversation.id,
          },
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error creating hire offer:', error)
    return { success: false, error: 'Failed to create hire offer' }
  }
}

// ============================================================================
// PROJECT ACTIONS
// ============================================================================

export const fetchProjectData = async (employerId: string) => {
  const projects = await prisma.project.findMany({
    where: {
      employers: {
        some: {
          id: employerId,
        },
      },
    },
    include: {
      employees: true,
      employers: true,
      client: true,
    },
  })

  return projects
}

// ============================================================================
// PORTFOLIO ACTIONS
// ============================================================================

export const createPortfolioItem = async (formData: FormData): Promise<ActionResult> => {
  try {
    const currentEmployee = await getEmployeeByClerkID()
    const ownerType = formData.get('ownerType')?.toString() as 'EMPLOYER' | 'EMPLOYEE'

    const coverImageFile = formData.get('coverImage') as File
    let coverImageUrl: string | undefined

    if (coverImageFile && coverImageFile.size > 0) {
      const imageBlob = await put(`portfolio/${coverImageFile.name}`, coverImageFile, {
        access: 'public',
      })
      coverImageUrl = imageBlob.url
    }

    // Parse trade categories
    const tradeCategoriesStr = formData.get('tradeCategories')?.toString()
    const tradeCategories = tradeCategoriesStr
      ? tradeCategoriesStr.split(',').map(t => t.trim() as TradeCategory)
      : []

    if (ownerType === 'EMPLOYER') {
      const employer = await prisma.employer.findFirst({
        where: {
          employees: {
            some: {
              id: currentEmployee.id,
            },
          },
        },
      })

      await prisma.portfolioItem.create({
        data: {
          title: formData.get('title')?.toString() || '',
          description: formData.get('description')?.toString(),
          city: formData.get('city')?.toString(),
          state: formData.get('state')?.toString(),
          coverImage: coverImageUrl,
          tradeCategories: tradeCategories,
          completedDate: formData.get('completedDate')
            ? new Date(formData.get('completedDate')!.toString())
            : null,
          clientName: formData.get('clientName')?.toString(),
          clientTestimonial: formData.get('clientTestimonial')?.toString(),
          ownerType: 'EMPLOYER',
          employerOwner: {
            connect: {
              id: employer?.id,
            },
          },
        },
      })
    } else {
      await prisma.portfolioItem.create({
        data: {
          title: formData.get('title')?.toString() || '',
          description: formData.get('description')?.toString(),
          city: formData.get('city')?.toString(),
          state: formData.get('state')?.toString(),
          coverImage: coverImageUrl,
          tradeCategories: tradeCategories,
          completedDate: formData.get('completedDate')
            ? new Date(formData.get('completedDate')!.toString())
            : null,
          clientName: formData.get('clientName')?.toString(),
          clientTestimonial: formData.get('clientTestimonial')?.toString(),
          ownerType: 'EMPLOYEE',
          employeeOwner: {
            connect: {
              id: currentEmployee.id,
            },
          },
        },
      })
    }

    revalidatePath('/portfolio')
    return { success: true }
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    return { success: false, error: 'Failed to create portfolio item' }
  }
}

// ============================================================================
// CERTIFICATION ACTIONS
// ============================================================================

export const addCertification = async (formData: FormData): Promise<ActionResult> => {
  try {
    const employeeId = formData.get('employeeId')?.toString()

    const documentFile = formData.get('document') as File
    let documentUrl: string | undefined

    if (documentFile && documentFile.size > 0) {
      const docBlob = await put(`certifications/${documentFile.name}`, documentFile, {
        access: 'public',
      })
      documentUrl = docBlob.url
    }

    await prisma.certification.create({
      data: {
        name: formData.get('name')?.toString() || '',
        issuingBody: formData.get('issuingBody')?.toString(),
        licenseNumber: formData.get('licenseNumber')?.toString(),
        issuedDate: formData.get('issuedDate')
          ? new Date(formData.get('issuedDate')!.toString())
          : null,
        expirationDate: formData.get('expirationDate')
          ? new Date(formData.get('expirationDate')!.toString())
          : null,
        documentUrl: documentUrl,
        employee: {
          connect: {
            id: employeeId,
          },
        },
      },
    })

    revalidatePath(`/employee/${employeeId}`)
    return { success: true }
  } catch (error) {
    console.error('Error adding certification:', error)
    return { success: false, error: 'Failed to add certification' }
  }
}

// ============================================================================
// SEARCH FUNCTIONALITY
// ============================================================================

export interface SearchFilters {
  tradeCategory?: TradeCategory
  location?: string
  minYearsExperience?: number
  maxHourlyRate?: number
  isBackgroundChecked?: boolean
  isInsured?: boolean
}

export const searchMarketplace = async (filters: SearchFilters) => {
  return prisma.employee.findMany({
    where: {
      isAvailableForHire: true,
      ...(filters.tradeCategory && {
        tradeCategory: filters.tradeCategory,
      }),
      ...(filters.location && {
        location: { contains: filters.location, mode: 'insensitive' as const },
      }),
      ...(filters.minYearsExperience && {
        yearsExperience: { gte: filters.minYearsExperience },
      }),
      ...(filters.maxHourlyRate && {
        hourlyRate: { lte: filters.maxHourlyRate },
      }),
      ...(filters.isBackgroundChecked && {
        isBackgroundChecked: true,
      }),
      ...(filters.isInsured && {
        isInsured: true,
      }),
    },
    include: {
      employer: true,
      hireOffers: true,
      certifications: true,
      ownedPortfolioItems: true,
    },
  })
}

// ============================================================================
// LEGACY FUNCTION ALIASES (for backward compatibility during migration)
// ============================================================================

// These aliases help during the transition - can be removed once all components are updated
export const createNewUser = createNewEmployee
export const fetchUser = fetchEmployee
export const updateUserInfo = updateEmployeeInfo
export const createNewOrg = createNewEmployer
export const updateOrgInfo = updateEmployerInfo
export const fetchOrgData = fetchEmployerData
export const fetchMessageThreads = fetchConversations
export const fetchThreadDetails = fetchConversationDetails
