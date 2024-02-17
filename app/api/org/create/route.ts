import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { content } = await request.json()
  console.log('CONETNT', content)
  const newOrg = await prisma.company.create({
    data: content,
  })
  revalidatePath('/admin/org')
  return NextResponse.json({ data: newOrg })
}
