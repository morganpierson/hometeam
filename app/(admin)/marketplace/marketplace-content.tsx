'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SavedSearchesSidebar from '@/app/components/marketplace/saved-searches-sidebar'
import FiltersSidebar from '@/app/components/marketplace/filters-sidebar'
import CandidateCard from '@/app/components/marketplace/candidate-card'
import { TradeCategory } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'
import { ChevronDownIcon, Squares2X2Icon, ListBulletIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type DecimalLike = number | Decimal | { toString(): string } | null | undefined

interface Employee {
  id: string
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
  bio?: string | null
  resumeSummary?: string | null
  tradeCategory?: TradeCategory | null
  yearsExperience?: number | null
  hourlyRate?: DecimalLike
  location?: string | null
  isBackgroundChecked?: boolean
  isInsured?: boolean
  availability?: string
  employer?: {
    id: string
    name: string
    logo?: string | null
  } | null
  certifications?: Array<{
    id: string
    name: string
    issuingBody?: string | null
    verified: boolean
  }>
}

interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasMore: boolean
}

interface MarketplaceContentProps {
  employees: Employee[]
  pagination?: Pagination
}

export default function MarketplaceContent({ employees, pagination }: MarketplaceContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSearchId, setActiveSearchId] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState('best_match')

  // Use pagination counts if available
  const totalCandidates = pagination?.totalCount ?? employees.length
  const activeCandidates = employees.filter(e => e.availability === 'AVAILABLE').length || employees.length

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Left Sidebar - Saved Searches */}
      <SavedSearchesSidebar
        activeSearchId={activeSearchId}
        onSearchSelect={setActiveSearchId}
        onNewSearch={() => console.log('New search')}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          {/* Search Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">Find Talent</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Skilled Trades
              </span>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 border-b border-gray-200">
                <button className="px-4 py-2 text-sm font-medium text-emerald-600 border-b-2 border-emerald-600">
                  Active
                  <span className="ml-2 text-xs text-gray-500">{totalCandidates}</span>
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  All
                  <span className="ml-2 text-xs text-gray-500">{totalCandidates}</span>
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Saved
                  <span className="ml-2 text-xs text-gray-500">0</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by</span>
                  <button className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    Best Match
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button className="p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-l-lg">
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-500">
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate List */}
          <div className="space-y-4">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <CandidateCard key={employee.id} candidate={employee} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No candidates match your criteria</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalCount}</span> candidates
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasMore}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Filters */}
      <FiltersSidebar
        onFiltersChange={(filters) => {
          console.log('Filters changed:', filters)
          // TODO: Implement filtering logic
        }}
      />
    </div>
  )
}
