import { fetchMarketplaceEmployees } from '@/utils/actions'
import UserMarketplaceList from '@/app/components/user-marketplace-list'
import { User } from '@clerk/nextjs/server'
import { list } from '@vercel/blob'

const MarketplacePage = async () => {
  const employees = await fetchMarketplaceEmployees()

  return <UserMarketplaceList users={employees} />
}

export default MarketplacePage
