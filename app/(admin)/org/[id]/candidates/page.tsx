import { getSavedCandidates } from '@/utils/actions'
import UserMarketplaceCard from '@/app/components/user-marketplace-card'

const CandidatesPage = async ({ params }: { params: { id: string } }) => {
  console.log('PARAMS', params)
  const savedCandidates = await getSavedCandidates(params.id)
  console.log('SAVED CANDIDATES', savedCandidates)

  return (
    <div>
      <h1 className="text-3xl font-sans tracking-widest font-semibold mb-8">
        My Saved Candidates
      </h1>
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedCandidates && savedCandidates.length > 0
            ? savedCandidates.map((candidate) => (
                <UserMarketplaceCard
                  key={candidate.id}
                  user={candidate}
                  employerImage={candidate.employer?.logo}
                  employer={candidate.employer}
                />
              ))
            : <p>No candidates saved</p>}
        </div>
      </div>
    </div>
  )
}

export default CandidatesPage
