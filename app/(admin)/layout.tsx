import HeaderNav from '@/app/components/header-nav'
import { fetchOrgData } from '@/utils/actions'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserByClerkID()
  const orgData = await fetchOrgData()

  // Get unread message count for this employer
  const unreadCount = orgData ? await prisma.message.count({
    where: {
      conversation: {
        employers: {
          some: { id: orgData.id }
        }
      },
      senderType: 'EMPLOYEE',
      readAt: null,
    },
  }) : 0

  return (
    <HeaderNav orgData={orgData} user={user} unreadMessageCount={unreadCount}>
      {children}
    </HeaderNav>
  )
}
