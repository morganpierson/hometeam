import UserProfile from '@/app/components/user-profile'
import { prisma } from '@/utils/db'
import { list } from '@vercel/blob'

const getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      team: true,
      company: true,
      acquisitionOffer: true,
    },
  })

  return user
}

const MarketplaceUserProfile = async ({ params }) => {
  const response = await list()
  const user = await getUser(params.id)
  console.log('RESPONSE', response)
  console.log('USER')
  return (
    <div className="px-10 h-24">
      <UserProfile user={user} org={user?.company.id} isOnMarketplace={true} />
    </div>
  )
}

export default MarketplaceUserProfile
