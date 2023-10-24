import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { clerkClient } from '@clerk/nextjs'

const getOrgData = async () => {
  const user = await getUserByClerkID()
  const data = await prisma.company.findUniqueOrThrow({
    where: {
      id: user.companyId,
    },
  })

  return data
}

const getTeamList = async () => {
  //query the list of all teams within the organization
  const user = await getUserByClerkID()
  const teams = await prisma.team.findMany({
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
        {teamData.map((team) => {
          return (
            <div>
              <h2 className="text-xl mt-8 tracking-widest font-medium">
                {team.name}
              </h2>
              <div className="flex">
                {team.members.map((member) => (
                  <span className="mr-10 mt-4 flex flex-col justify-center items-center">
                    <img
                      src={member.profileImage || ''}
                      className="h-24 w-24 rounded-full hover:blur-xs"
                    />
                    {member.name}
                  </span>
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
