import CreateOrgForm from '@/app/components/create-org-form'
import { prisma } from '@/utils/db'

const OrgCreate = async () => {
  const industryOptions = await (
    await prisma.industry.findMany()
  )
    .map((ind) => {
      return { value: ind.name, label: ind.name }
    })
    .sort((a, b) => {
      if (a.value.toLowerCase() < b.value.toLowerCase()) {
        return -1
      } else if (a.value.toLowerCase() > b.value.toLowerCase()) {
        return 1
      }

      return 0
    })

  const companySize = [
    { value: 'small', label: '0 - 10' },
    { value: 'med', label: '11 - 100' },
    { value: 'large', label: '101 - 500' },
    { value: 'extra-large', label: '501 - 1000' },
    { value: 'enterprise', label: '1000+' },
  ]

  return (
    <div className="p-12">
      <CreateOrgForm
        companySize={companySize}
        industryOptions={industryOptions}
      />
    </div>
  )
}

export default OrgCreate
