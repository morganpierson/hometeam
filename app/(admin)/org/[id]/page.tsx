import { getEmployeeByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import TeamListPage from '@/app/components/team-list-page'

const getEmployerData = async () => {
  const employee = await getEmployeeByClerkID()
  const data = await prisma.employer.findUniqueOrThrow({
    where: {
      id: employee?.employerId ?? undefined,
    },
    include: {
      employees: true,
    },
  })

  return data
}

const getProjectAssignments = async () => {
  const currentEmployer = await getEmployerData()

  const projects = await prisma.project.findMany({
    where: {
      employers: {
        some: {
          id: currentEmployer.id,
        },
      },
    },
    include: {
      employees: true,
      client: true,
    },
  })

  const sortedProjects = projects.sort((a, b) => {
    if (a.title < b.title) {
      return -1
    }
    if (a.title > b.title) {
      return 1
    }
    return 0
  })
  return sortedProjects
}

const OrgDetailsPage = async ({ params }: { params: { id: string } }) => {
  const employerData = await getEmployerData()
  const projectData = await getProjectAssignments()
  return <TeamListPage projectData={projectData} orgData={employerData} />
}

export default OrgDetailsPage
