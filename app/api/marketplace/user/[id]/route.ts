import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const employeeProfile = await prisma.employee.findUnique({
    where: {
      id: params.id,
    },
    include: {
      employer: true,
      certifications: true,
      hireOffers: true,
      ownedPortfolioItems: true,
      contributions: true,
      serviceAreas: true,
    },
  })
  revalidatePath('/admin/org')
  return NextResponse.json({ data: employeeProfile })
}
