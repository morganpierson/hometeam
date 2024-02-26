import { fetchMarketplaceEmployees } from '@/utils/actions'
import UserMarketplaceList from '@/app/components/user-marketplace-list'
import { User } from '@clerk/nextjs/server'
import { list } from '@vercel/blob'

const MarketplacePage = async () => {
  async function allImages() {
    const blobs = await list()
    return blobs
  }
  const images = await allImages()
  const employees = await fetchMarketplaceEmployees()
  return (
    <UserMarketplaceList users={employees} companyImage={images.blobs[1].url} />
  )
}

export default MarketplacePage
