import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const userProfile = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      team: true,
    },
  })
  revalidatePath('/admin/org')
  return NextResponse.json({ data: userProfile })
}

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  console.log('PARAMS', params)
  const { content } = await request.json()
  console.log('API Resume CONTENT', content.resume)
  const updatedUser = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: content,
  })
  revalidatePath('/admin/org')
  return NextResponse.json({ data: updatedUser })
}
