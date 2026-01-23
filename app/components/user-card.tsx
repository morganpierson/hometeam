'use client'

import { fetchEmployeeProfile } from '@/utils/api'
import { useRouter } from 'next/navigation'
import Image, { StaticImageData } from 'next/image'

interface TeamMember {
  id: string
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
}

interface UserCardProps {
  teamMember: TeamMember
  placeholderImage: StaticImageData | string
}

const UserCard = ({ teamMember, placeholderImage }: UserCardProps) => {
  const router = useRouter()
  const handleOnClick = async () => {
    const userData = await fetchEmployeeProfile(teamMember.id)
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
