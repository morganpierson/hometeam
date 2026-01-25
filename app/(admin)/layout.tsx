import HeaderNav from '@/app/components/header-nav'
import { fetchOrgData } from '@/utils/actions'
import { getUserByClerkID } from '@/utils/auth'

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserByClerkID()
  const orgData = await fetchOrgData()

  return (
    <HeaderNav orgData={orgData} user={user}>
      {children}
    </HeaderNav>
  )
}
