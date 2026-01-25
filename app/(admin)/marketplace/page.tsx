import { fetchMarketplaceEmployees } from '@/utils/actions'
import MarketplaceContent from './marketplace-content'

const MarketplacePage = async () => {
  const employees = await fetchMarketplaceEmployees()

  return <MarketplaceContent employees={employees} />
}

export default MarketplacePage
