'use client'

import { useState } from 'react'
import { PlusIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface SavedSearch {
  id: string
  name: string
  lastSeen?: string
  isStarred?: boolean
}

interface SavedSearchesSidebarProps {
  savedSearches?: SavedSearch[]
  activeSearchId?: string
  onSearchSelect?: (id: string) => void
  onNewSearch?: () => void
}

export default function SavedSearchesSidebar({
  savedSearches = [],
  activeSearchId,
  onSearchSelect,
  onNewSearch,
}: SavedSearchesSidebarProps) {
  const [activeTab, setActiveTab] = useState<'starred' | 'all'>('all')

  const filteredSearches = activeTab === 'starred'
    ? savedSearches.filter(s => s.isStarred)
    : savedSearches

  // Demo searches if none provided
  const displaySearches = filteredSearches.length > 0 ? filteredSearches : [
    { id: '1', name: 'Electricians', lastSeen: '2 days ago', isStarred: true },
    { id: '2', name: 'HVAC Technicians', lastSeen: '1 week ago', isStarred: false },
    { id: '3', name: 'Plumbers - Denver', lastSeen: 'never', isStarred: false },
  ]

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
      <div className="sticky top-14 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Source</h2>
          <button
            onClick={onNewSearch}
            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            <PlusIcon className="h-4 w-4" />
            New Search
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
          <button
            onClick={() => setActiveTab('starred')}
            className={clsx(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'starred'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Starred
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={clsx(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            All Searches
          </button>
        </div>

        {/* Search List */}
        <div className="space-y-1">
          {displaySearches.map((search) => (
            <button
              key={search.id}
              onClick={() => onSearchSelect?.(search.id)}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-lg transition-colors',
                activeSearchId === search.id
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'hover:bg-gray-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{search.name}</p>
                  <p className="text-xs text-gray-500">
                    Last seen: {search.lastSeen || 'never'}
                  </p>
                </div>
                {search.isStarred ? (
                  <StarIconSolid className="h-4 w-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <StarIcon className="h-4 w-4 text-gray-300 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {displaySearches.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No saved searches yet
          </p>
        )}
      </div>
    </div>
  )
}
