import { getSavedCandidates } from '@/utils/actions'
import UserCard from '@/app/components/user-card'
import UserMarketplaceCard from '@/app/components/user-marketplace-card'

const CandidatesPage = async ({ params }) => {
  console.log('PARAMS', params)
  const savedCandidates = await getSavedCandidates(params.id)
  // const projects = await fetchProjectData(params.id)
  console.log('SAVED CANDIDATES', savedCandidates)
  return (
    <div>
      <h1 className="text-3xl font-sans tracking-widest font-semibold mb-8">
        My Saved Candidates
      </h1>
      <div>
        <div>
          {savedCandidates
            ? savedCandidates.map((candidate) => (
                <UserMarketplaceCard
                  user={candidate}
                  companyImage={candidate.company.logo}
                  company={savedCandidates}
                />
              ))
            : 'No candidates saved'}
          {/* Candidates */}
        </div>
      </div>
    </div>
  )
}

export default CandidatesPage
