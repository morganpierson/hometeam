import UserMarketplaceCard from './user-marketplace-card'
import SearchBar from './search-bar'
import { TradeCategory } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

// Allow Prisma Decimal or number types
type DecimalLike = number | Decimal | { toString(): string } | null | undefined

interface Employee {
  id: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
  tradeCategory?: TradeCategory | null
  yearsExperience?: number | null
  hourlyRate?: DecimalLike
  location?: string | null
  employer?: {
    id: string
    name: string
    logo?: string | null
  } | null
  certifications?: Array<{
    name: string
    verified: boolean
  }>
}

interface UserListProps {
  users: Employee[]
}

export default async function UserList({ users }: UserListProps) {
  return (
    <div className="px-16">
      <SearchBar />
      <ul role="list" className="grid grid-cols-1 gap-4">
        {users.map((person) => (
          <li
            key={person.id}
            className="flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow col-span-1"
          >
            <UserMarketplaceCard
              user={person}
              employerImage={person.employer?.logo}
              employer={person.employer}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
