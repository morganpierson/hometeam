import { fetchMarketplaceEmployees } from '@/utils/actions'
import UserMarketplaceList from '@/app/components/user-marketplace-list'

const MarketplacePage = async () => {
  const employees = await fetchMarketplaceEmployees()

  return <UserMarketplaceList users={employees} />
}

export default MarketplacePage
