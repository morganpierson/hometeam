import EditOrgForm from '@/app/components/edit-org-form'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getOrgData = async () => {
  const user = await getUserByClerkID()
  const data = await prisma.company.findUniqueOrThrow({
    where: {
      id: user.companyId,
    },
    include: {
      employees: true,
      teams: true,
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
const EditOrgPage = async () => {
  const orgData = await getOrgData()
  const teamData = await getTeamList()
  console.log('TEAM DATA', teamData)
  return (
    <div>
      <EditOrgForm
        org={orgData}
        teamData={teamData}
        saveTeam={''}
        cancelSave={''}
      />
    </div>
  )
}

export default EditOrgPage
