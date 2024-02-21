import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { clerkClient } from '@clerk/nextjs'
import Link from 'next/link'
import UserCard from '@/app/components/user-card'
import { PlusIcon } from '@heroicons/react/16/solid'

const getOrgData = async () => {
  const user = await getUserByClerkID()
  const data = await prisma.company.findUniqueOrThrow({
    where: {
      id: user.companyId,
    },
  })

  return data
}

const mockTeamData = [
  {
    name: 'Product',
    id: 1,
    members: [
      {
        id: 1,
        name: 'Steve Schoger',
        email: 'steve@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiWnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Adam Wathan',
        email: 'adam@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Sarah Cooper',
        email: 'scooper@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
    ],
  },
  {
    name: 'Sales',
    id: 2,
    members: [
      {
        id: 1,
        name: 'Jess White',
        email: 'jess@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiWnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'JP',
        email: 'jp@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Katherine Jacobs',
        email: 'kjacobs@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
    ],
  },
  {
    name: 'Marketing',
    id: 3,
    members: [
      {
        id: 1,
        name: 'Bill Valley',
        email: 'bill@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiWnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Miranda Hill',
        email: 'mhill@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Hannah Smith',
        email: 'hsmith@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
    ],
  },
  {
    name: 'Engineering',
    id: 4,
    members: [
      {
        id: 1,
        name: 'Steve Wozniak',
        email: 'steve@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiWnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Mark Zuckerberg',
        email: 'thezuck@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Edith Clarke',
        email: 'ogedith@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'Cooper Jackson',
        email: 'cjack@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
      {
        id: 2,
        name: 'AI Tom',
        email: 'definitelynotarobot@newteam.io',
        profileImage:
          'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yVlhwMWNzYnZEZjdKTEZlaHptNGxXSWUwUEoiLCJyaWQiOiJ1c2VyXzJYQ3VQR21nVzJJQWJ6SkNiZnpHaHNJSW0wQyJ9',
      },
    ],
  },
]

const getTeamList = async () => {
  //query the list of all teams within the organization
  const user = await getUserByClerkID()
  const currentOrg = await getOrgData()
  const teams = await prisma.team.findMany({
    where: {
      companyId: currentOrg.id,
    },
    include: {
      members: true,
    },
  })
  const sortedTeams = teams.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
  return sortedTeams
}

const getUserData = async () => {
  const users = await prisma.user.findMany({
    include: {
      team: true,
    },
  })

  return users
}

const OrgDetailsPage = async ({ params }) => {
  const orgData = await getOrgData()
  const teamData = await getTeamList()

  return (
    <div className="ml-12 mt-12">
      <header>
        <h1 className="text-3xl font-sans tracking-widest font-semibold">
          {orgData.name.toUpperCase()}
        </h1>
      </header>
      {/* The function below needs to be optimized to a better time complexity */}
      <div className="ml-6 mt-8">
        {teamData[0]
          ? teamData.map((team) => {
              return (
                <div key={team.id}>
                  <h2
                    key={team.id}
                    className="text-xl mt-8 tracking-widest font-medium"
                  >
                    {team.name}
                  </h2>
                  <div className="flex">
                    {team.members.map((member) => (
                      <Link key={member.id} href={`/org/user/${member.id}`}>
                        <UserCard teamMember={member} />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })
          : mockTeamData.map((team) => {
              return (
                <div key={team.id}>
                  <h2
                    key={team.id}
                    className="text-xl mt-8 tracking-widest font-medium"
                  >
                    {team.name}
                  </h2>
                  <div className="flex">
                    {team.members.map((member) => (
                      <Link key={member.id} href={`/org/user/${member.id}`}>
                        <UserCard teamMember={member} />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default OrgDetailsPage
