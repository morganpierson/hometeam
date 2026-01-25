'use client'

import { useState } from 'react'
import { ChevronDownIcon, XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { TradeCategory } from '@prisma/client'
import clsx from 'clsx'

interface FiltersSidebarProps {
  onFiltersChange?: (filters: FilterState) => void
}

interface FilterState {
  tradeCategories: TradeCategory[]
  locations: string[]
  minExperience?: number
  maxHourlyRate?: number
  isBackgroundChecked?: boolean
  isInsured?: boolean
  hasCertifications?: boolean
}

const tradeCategoryLabels: Record<TradeCategory, string> = {
  ELECTRICIAN: 'Electrician',
  PLUMBER: 'Plumber',
  HVAC: 'HVAC',
  CARPENTER: 'Carpenter',
  ROOFER: 'Roofer',
  PAINTER: 'Painter',
  MASON: 'Mason',
  WELDER: 'Welder',
  GENERAL_CONTRACTOR: 'General Contractor',
  LANDSCAPER: 'Landscaper',
  CONCRETE: 'Concrete',
  DRYWALL: 'Drywall',
  FLOORING: 'Flooring',
  GLAZIER: 'Glazier',
  INSULATION: 'Insulation',
  IRONWORKER: 'Ironworker',
  SHEET_METAL: 'Sheet Metal',
  TILE_SETTER: 'Tile Setter',
  OTHER: 'Other',
}

interface FilterSectionProps {
  title: string
  badge?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function FilterSection({ title, badge, defaultOpen = false, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-emerald-600">{title}</span>
          {badge && (
            <span className="text-xs text-emerald-600">+</span>
          )}
        </div>
        <ChevronDownIcon
          className={clsx(
            'h-4 w-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function FiltersSidebar({ onFiltersChange }: FiltersSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    tradeCategories: [],
    locations: [],
  })

  const [keywordSearch, setKeywordSearch] = useState('')

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange?.(updated)
  }

  const addTradeCategory = (category: TradeCategory) => {
    if (!filters.tradeCategories.includes(category)) {
      updateFilters({ tradeCategories: [...filters.tradeCategories, category] })
    }
  }

  const removeTradeCategory = (category: TradeCategory) => {
    updateFilters({
      tradeCategories: filters.tradeCategories.filter(c => c !== category)
    })
  }

  const addLocation = (location: string) => {
    if (!filters.locations.includes(location)) {
      updateFilters({ locations: [...filters.locations, location] })
    }
  }

  const removeLocation = (location: string) => {
    updateFilters({
      locations: filters.locations.filter(l => l !== location)
    })
  }

  return (
    <div className="w-72 flex-shrink-0 border-l border-gray-200 bg-white">
      <div className="sticky top-14 p-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        {/* Keyword Search */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-emerald-600">Keyword Search</span>
            <span className="text-xs text-emerald-600">+</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Search by skills, certifications, or experience
          </p>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              placeholder="Filter candidates..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Trade Category Filter */}
        <FilterSection title="Trade" defaultOpen={true}>
          {filters.tradeCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.tradeCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-sm text-emerald-700 border border-emerald-200"
                >
                  {tradeCategoryLabels[category]}
                  <button onClick={() => removeTradeCategory(category)}>
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <select
            onChange={(e) => {
              if (e.target.value) {
                addTradeCategory(e.target.value as TradeCategory)
                e.target.value = ''
              }
            }}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Add trade category...</option>
            {Object.entries(tradeCategoryLabels).map(([value, label]) => (
              <option key={value} value={value} disabled={filters.tradeCategories.includes(value as TradeCategory)}>
                {label}
              </option>
            ))}
          </select>
        </FilterSection>

        {/* Location Filter */}
        <FilterSection title="Location" defaultOpen={true}>
          {filters.locations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {filters.locations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-sm text-emerald-700 border border-emerald-200"
                >
                  {location}
                  <button onClick={() => removeLocation(location)}>
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Add city or state..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                addLocation(e.currentTarget.value.trim())
                e.currentTarget.value = ''
              }
            }}
          />
        </FilterSection>

        {/* Experience Filter */}
        <FilterSection title="Experience">
          <p className="text-xs text-gray-500 mb-2">Years of experience</p>
          <select
            value={filters.minExperience || ''}
            onChange={(e) => updateFilters({ minExperience: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any experience</option>
            <option value="1">1+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </FilterSection>

        {/* Hourly Rate Filter */}
        <FilterSection title="Hourly Rate">
          <p className="text-xs text-gray-500 mb-2">Maximum hourly rate</p>
          <select
            value={filters.maxHourlyRate || ''}
            onChange={(e) => updateFilters({ maxHourlyRate: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Any rate</option>
            <option value="25">Up to $25/hr</option>
            <option value="35">Up to $35/hr</option>
            <option value="50">Up to $50/hr</option>
            <option value="75">Up to $75/hr</option>
            <option value="100">Up to $100/hr</option>
          </select>
        </FilterSection>

        {/* Verification Filters */}
        <FilterSection title="Verification">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.isBackgroundChecked}
                onChange={(e) => updateFilters({ isBackgroundChecked: e.target.checked || undefined })}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Background checked</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.isInsured}
                onChange={(e) => updateFilters({ isInsured: e.target.checked || undefined })}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Insured</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hasCertifications}
                onChange={(e) => updateFilters({ hasCertifications: e.target.checked || undefined })}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Has certifications</span>
            </label>
          </div>
        </FilterSection>
      </div>
    </div>
  )
}
