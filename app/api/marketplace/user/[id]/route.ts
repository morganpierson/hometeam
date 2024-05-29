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
      company: true,
    },
  })
  revalidatePath('/admin/org')
  return NextResponse.json({ data: userProfile })
}
