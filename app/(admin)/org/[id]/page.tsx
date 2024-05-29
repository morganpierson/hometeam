import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { clerkClient } from '@clerk/nextjs'
import Link from 'next/link'
import UserCard from '@/app/components/user-card'
import { PlusIcon } from '@heroicons/react/16/solid'
import TeamListPage from '@/app/components/team-list-page'

const getOrgData = async () => {
  const user = await getUserByClerkID()
  console.log('USER', user)
  const data = await prisma.company.findUniqueOrThrow({
    where: {
      id: user.companyId,
    },
    include: {
      employees: true,
    },
  })

  return data
}

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
  return <TeamListPage teamData={teamData} orgData={orgData} />
}

export default OrgDetailsPage
