'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import JobCard from './job-card'

interface Job {
  id: string
  title: string
  description: string
  jobType: string
  primaryTrade: string
  city: string
  state: string
  isRemote: boolean
  payType: string
  payRangeMin: number | null
  payRangeMax: number | null
  minYearsExperience: number | null
  createdAt: string
  employer: {
    id: string
    name: string
    logo: string | null
    description: string | null
    size: string | null
    city: string | null
    state: string | null
  }
}

interface JobListProps {
  jobs: Job[]
  userTrade: string | null
  query: string
  location: string
}

export default function JobList({ jobs, userTrade, query, location }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-lg mb-4">
          <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          {query || location
            ? 'Try adjusting your search criteria to find more opportunities.'
            : 'There are no active job postings at the moment. Check back soon!'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{jobs.length}</span> job{jobs.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Sort by:</span>
          <select className="border-0 bg-transparent text-amber-600 font-medium focus:ring-0 cursor-pointer">
            <option value="recommended">Recommended</option>
            <option value="recent">Most Recent</option>
            <option value="pay">Highest Pay</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            matchesTrade={userTrade === job.primaryTrade}
          />
        ))}
      </div>
    </div>
  )
}
