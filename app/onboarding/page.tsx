import CreateOrgForm from '@/app/components/create-org-form'
import { TradeCategory } from '@prisma/client'

const OrgCreate = async () => {
  // Use TradeCategory enum values instead of industry table
  const tradeCategoryOptions = Object.values(TradeCategory)
    .map((category) => ({
      value: category,
      label: category.replace('_', ' '),
    }))
    .sort((a, b) => {
      if (a.label.toLowerCase() < b.label.toLowerCase()) {
        return -1
      } else if (a.label.toLowerCase() > b.label.toLowerCase()) {
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
        industryOptions={tradeCategoryOptions}
      />
    </div>
  )
}

export default OrgCreate
