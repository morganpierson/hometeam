import HeaderNav from '@/app/components/header-nav'
import { getEmployeeByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

// Lightweight org data fetch for layout - only essential fields
async function getLayoutData() {
  const employee = await getEmployeeByClerkID()

  if (!employee?.employerId) {
    return { orgData: null, unreadCount: 0, user: employee }
  }

  // Fetch org data and unread count in parallel
  const [orgData, unreadCount] = await Promise.all([
    prisma.employer.findUnique({
      where: { id: employee.employerId },
      select: {
        id: true,
        name: true,
        logo: true,
        city: true,
        state: true,
      },
    }),
    prisma.message.count({
      where: {
        conversation: {
          employers: {
            some: { id: employee.employerId }
          }
        },
        senderType: 'EMPLOYEE',
        readAt: null,
      },
    }),
  ])

  return { orgData, unreadCount, user: employee }
}

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { orgData, unreadCount, user } = await getLayoutData()

  return (
    <HeaderNav orgData={orgData} user={user} unreadMessageCount={unreadCount}>
      {children}
    </HeaderNav>
  )
}
