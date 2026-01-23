import EditOrgForm from '@/app/components/edit-org-form'
import { getEmployeeByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getEmployerData = async () => {
  const employee = await getEmployeeByClerkID()
  const data = await prisma.employer.findUniqueOrThrow({
    where: {
      id: employee?.employerId ?? undefined,
    },
    include: {
      employees: true,
      portfolio: true,
      serviceAreas: true,
    },
  })

  return data
}

const EditOrgPage = async () => {
  const employerData = await getEmployerData()
  return (
    <div>
      <EditOrgForm org={employerData} />
    </div>
  )
}

export default EditOrgPage
