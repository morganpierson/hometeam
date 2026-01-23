import { prisma } from '@/utils/db'
import { getEmployeeByClerkID, AuthenticationError } from '@/utils/auth'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createEmployerSchema = z.object({
  content: z.object({
    name: z.string().min(1, 'Name is required'),
    size: z.string().min(1, 'Size is required'),
    website: z.string().url().optional().or(z.literal('')),
    logo: z.string().optional(),
    description: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),
})

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await getEmployeeByClerkID()

    const body = await request.json()
    const validation = createEmployerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { content } = validation.data

    const newEmployer = await prisma.employer.create({
      data: content,
    })

    revalidatePath('/admin/org')
    return NextResponse.json({ data: newEmployer })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error('Error creating employer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
