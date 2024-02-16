'use client'

import { fetchUserProfile } from '@/utils/api'
import { useRouter } from 'next/navigation'

const UserCard = ({ teamMember }) => {
  const router = useRouter()
  const handleOnClick = async () => {
    //call fetchUserProfile api util method to call api GET request which fetches user profile info to pass to user profile page
    const userData = await fetchUserProfile(teamMember.id)
    router.push(`/org/user/${userData.id}`)
  }
  return (
    <span className="mr-10 mt-4 flex flex-col justify-center items-center">
      <img
        src={teamMember.profileImage || ''}
        className="h-24 w-24 rounded-full drop-shadow-lg hover:drop-shadow-none hover:cursor-pointer"
        onClick={handleOnClick}
      />
      {teamMember.name}
    </span>
  )
}

export default UserCard
