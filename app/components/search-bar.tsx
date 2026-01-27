'use client'

import { useState, useTransition } from 'react'
import { searchMarketplace, SearchFilters } from '@/utils/actions'
import { TradeCategory } from '@prisma/client'

interface Employee {
  id: string
  firstName?: string | null
  lastName?: string | null
  tradeCategory?: TradeCategory | null
  location?: string | null
  yearsExperience?: number | null
  hourlyRate?: number | null
  employer?: { name: string } | null
  hireOffers?: Array<{ offeredRate: number | null }> | null
}

interface SearchBarProps {
  onSearchResults?: (results: Employee[]) => void
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [tradeCategory, setTradeCategory] = useState<TradeCategory | ''>('')
  const [location, setLocation] = useState('')
  const [isPending, startTransition] = useTransition()

  const tradeCategoryOptions = Object.values(TradeCategory)

  const handleSearch = () => {
    startTransition(async () => {
      const filters: SearchFilters = {}

      if (tradeCategory) {
        filters.tradeCategory = tradeCategory
      }

      if (location.trim()) {
        filters.location = location.trim()
      }

      const results = await searchMarketplace(filters)

      if (onSearchResults) {
        onSearchResults(results as Employee[])
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="sticky top-0">
      <div className="relative rounded-md shadow-sm border border-gray-200 bg-white mb-12 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white h-14 rounded-md px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-amber-500">
            <label
              htmlFor="trade-category"
              className="block text-xs font-medium text-gray-900"
            >
              Trade Category
            </label>
            <select
              name="trade-category"
              id="trade-category"
              value={tradeCategory}
              onChange={(e) => setTradeCategory(e.target.value as TradeCategory | '')}
              className="border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 w-full bg-transparent"
            >
              <option value="">All Trades</option>
              {tradeCategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white h-14 rounded-md px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-amber-500">
            <label
              htmlFor="location"
              className="block text-xs font-medium text-gray-900"
            >
              Location
            </label>
            <input
              type="search"
              name="location"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Austin, TX"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              disabled={isPending}
              className="w-full rounded-md bg-amber-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Searching...' : 'Search Tradespeople'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
