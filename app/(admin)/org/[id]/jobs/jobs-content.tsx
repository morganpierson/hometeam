'use client'

import Link from 'next/link'
import { BriefcaseIcon, UsersIcon } from '@heroicons/react/24/outline'

interface Job {
  id: string
  title: string
  status: 'active' | 'draft' | 'closed'
  applicantCount?: number
  createdAt: Date
}

interface JobsContentProps {
  orgId: string
  jobs: Job[]
  employerName: string
}

export default function JobsContent({ orgId, jobs, employerName }: JobsContentProps) {
  const hasJobs = jobs.length > 0

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-y-auto bg-gray-50">
        {hasJobs ? (
          // Jobs list view (when jobs exist)
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Job Postings</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500">{employerName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {job.applicantCount || 0} applicants
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Empty state
          <div className="flex items-center justify-center h-full">
            <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-12 max-w-lg text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No jobs.</h2>
              <p className="text-gray-600 mb-6">
                You don&apos;t need to post a job to start reaching out to candidates.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UsersIcon className="h-4 w-4" />
                  Find Talent
                </Link>
                <Link
                  href={`/org/${orgId}/jobs/new`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
