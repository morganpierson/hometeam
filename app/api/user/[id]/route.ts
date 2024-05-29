import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

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

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const req = await request.json()
  console.log('DELETE REQUEST', req)
  const currentUser = await prisma.user.findFirst({
    where: {
      id: params.id,
    },
    include: {
      acquisitionOffer: true,
    },
  })

  console.log('CURRENT USER', currentUser)

  if (currentUser.acquisitionOffer) {
    await prisma.acquisitionOffer.delete({
      where: {
        userId: params.id,
      },
    })
  }
  const deletedUser = await prisma.user.delete({
    where: {
      id: params.id,
    },
  })
  revalidatePath(`/org/${req.orgId}`)
  return NextResponse.json({ data: deletedUser })
}
