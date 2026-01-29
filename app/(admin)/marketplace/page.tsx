import { fetchMarketplaceEmployees } from '@/utils/actions'
import MarketplaceContent from './marketplace-content'

// Revalidate marketplace every 60 seconds for better performance
export const revalidate = 60

interface PageProps {
  searchParams: { page?: string }
}

const MarketplacePage = async ({ searchParams }: PageProps) => {
  const page = parseInt(searchParams.page || '1', 10)
  const { employees, pagination } = await fetchMarketplaceEmployees(page, 20)

  return <MarketplaceContent employees={employees} pagination={pagination} />
}

export default MarketplacePage
