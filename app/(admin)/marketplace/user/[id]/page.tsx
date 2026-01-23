import UserProfile from '@/app/components/user-profile'
import { prisma } from '@/utils/db'
import { list } from '@vercel/blob'

const getEmployee = async (id: string) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: id,
    },
    include: {
      employer: true,
      certifications: true,
      hireOffers: true,
      ownedPortfolioItems: true,
      contributions: true,
      serviceAreas: true,
      reviewsReceived: true,
    },
  })

  return employee
}

const MarketplaceUserProfile = async ({ params }: { params: { id: string } }) => {
  const response = await list()
  const employee = await getEmployee(params.id)
  console.log('RESPONSE', response)
  console.log('EMPLOYEE', employee)

  return (
    <div className="px-10 h-24">
      <UserProfile
        user={employee}
        org={employee?.employer?.id}
        isOnMarketplace={true}
      />
    </div>
  )
}

export default MarketplaceUserProfile
