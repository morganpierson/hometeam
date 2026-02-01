'use client'

import { useState, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import JobCard, { Job } from './job-card'
import JobDetailModal from './job-detail-modal'

interface JobListProps {
  jobs: Job[]
  userTrade: string | null
  query: string
  location: string
}

export default function JobList({ jobs, userTrade, query, location }: JobListProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const trackedViewsRef = useRef<Set<string>>(new Set())

  // Track job views (impressions) when jobs are displayed
  useEffect(() => {
    if (jobs.length === 0) return

    // Filter out jobs we've already tracked in this session
    const newJobIds = jobs
      .map(job => job.id)
      .filter(id => !trackedViewsRef.current.has(id))

    if (newJobIds.length === 0) return

    // Track views
    fetch('/api/jobs/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobIds: newJobIds, source: 'search' }),
    }).catch(console.error)

    // Mark these jobs as tracked
    newJobIds.forEach(id => trackedViewsRef.current.add(id))
  }, [jobs])

  const handleLearnMore = (job: Job) => {
    // Track the click
    fetch('/api/jobs/track/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id, source: 'search' }),
    }).catch(console.error)

    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

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
    <>
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
              onLearnMore={handleLearnMore}
            />
          ))}
        </div>
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        matchesTrade={selectedJob ? userTrade === selectedJob.primaryTrade : false}
      />
    </>
  )
}
