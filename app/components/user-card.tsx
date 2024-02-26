'use client'

import { fetchUserProfile } from '@/utils/api'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const UserCard = ({ teamMember, placeholderImage }) => {
  const router = useRouter()
  const handleOnClick = async () => {
    //call fetchUserProfile api util method to call api GET request which fetches user profile info to pass to user profile page
    const userData = await fetchUserProfile(teamMember.id)
    router.push(`/org/user/${userData.id}`)
  }
  return (
    <span className="mr-10 mt-4 flex flex-col justify-center items-center">
      <Image
        src={teamMember.profileImage || placeholderImage}
        width={96}
        height={96}
        className="h-24 w-24 rounded-full mb-2 drop-shadow-lg hover:drop-shadow-none hover:cursor-pointer"
        onClick={handleOnClick}
        alt="user profile image"
      />
      {teamMember.firstName} {teamMember.lastName ? teamMember.lastName : ''}
    </span>
  )
}

export default UserCard
