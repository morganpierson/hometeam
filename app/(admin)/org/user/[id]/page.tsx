import UserProfile from '@/app/components/user-profile'
import { prisma } from '@/utils/db'

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

const AdminUserProfile = async ({ params }) => {
  const user = await getUser(params.id)
  console.log('USER')
  return (
    <div className="px-10 h-24">
      <UserProfile user={user} />
    </div>
  )
}

export default AdminUserProfile
