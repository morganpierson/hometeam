import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid'
import UserMarketplaceCard from './user-marketplace-card'
import SearchBar from './search-bar'

export default async function UserList({ users }) {
  return (
    <div className="px-16">
      <SearchBar />
      <ul role="list" className="grid grid-cols-1 gap-4">
        {users.map((person) => (
          <li
            key={person.email}
            className="flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow col-span-1"
          >
            <UserMarketplaceCard
              user={person}
              companyImage={person.company.logo}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
