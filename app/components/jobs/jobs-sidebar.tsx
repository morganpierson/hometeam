'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, BriefcaseIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface JobsSidebarProps {
  activeCount: number
  draftsCount: number
  orgId: string
}

export default function JobsSidebar({ activeCount, draftsCount, orgId }: JobsSidebarProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'drafts'>('active')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Jobs</h1>
          <Link
            href={`/org/${orgId}/jobs/new`}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            + Post Job
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={clsx(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'active'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={clsx(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'drafts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Drafts ({draftsCount})
          </button>
        </div>

        {/* Post a job CTA card */}
        <div className="border border-dashed border-amber-300 bg-amber-50/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
            Post a job for free
          </h3>
          <p className="text-xs text-gray-600 text-center mb-4">
            We have a network of skilled trade professionals. Let them know you&apos;re hiring.
          </p>
          <div className="space-y-2">
            <Link
              href={`/org/${orgId}/jobs/new`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <BriefcaseIcon className="h-4 w-4" />
              Post a job
            </Link>
            <button
              type="button"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowsRightLeftIcon className="h-4 w-4" />
              Connect ATS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
