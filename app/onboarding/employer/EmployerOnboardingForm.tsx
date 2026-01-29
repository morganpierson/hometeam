'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TradeCategory } from '@prisma/client'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'

interface Option {
  value: string
  label: string
}

interface EmployerOnboardingFormProps {
  tradeCategoryOptions: Option[]
  companySizeOptions: Option[]
  userId: string
  userEmail: string
  userFirstName: string
  userLastName: string
}

interface ParsedWebsiteData {
  companyName: string | null
  description: string | null
  contactPhone: string | null
  contactEmail: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  specialties: string[]
  companySize: string | null
}

export default function EmployerOnboardingForm({
  tradeCategoryOptions,
  companySizeOptions,
  userId,
  userEmail,
}: EmployerOnboardingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Website parsing state
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [isParsingWebsite, setIsParsingWebsite] = useState(false)
  const [websiteParsed, setWebsiteParsed] = useState(false)
  const [websiteError, setWebsiteError] = useState<string | null>(null)
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set())

  // Form state
  const [companyName, setCompanyName] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [contactEmail, setContactEmail] = useState(userEmail)
  const [contactPhone, setContactPhone] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<TradeCategory[]>([])
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')

  const handleParseWebsite = async () => {
    if (!websiteUrl.trim()) return

    setIsParsingWebsite(true)
    setWebsiteError(null)

    try {
      const response = await fetch('/api/onboarding/employer/parse-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl: websiteUrl.trim() }),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again.')
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse website')
      }

      const data: ParsedWebsiteData = result.data
      const newAutoFilled = new Set<string>()

      // Auto-fill form fields
      if (data.companyName && !companyName) {
        setCompanyName(data.companyName)
        newAutoFilled.add('companyName')
      }

      if (data.description && !description) {
        setDescription(data.description)
        newAutoFilled.add('description')
      }

      if (data.contactPhone && !contactPhone) {
        setContactPhone(data.contactPhone)
        newAutoFilled.add('contactPhone')
      }

      if (data.contactEmail && !contactEmail) {
        setContactEmail(data.contactEmail)
        newAutoFilled.add('contactEmail')
      }

      if (data.city && !city) {
        setCity(data.city)
        newAutoFilled.add('city')
      }

      if (data.state && !state) {
        setState(data.state)
        newAutoFilled.add('state')
      }

      if (data.zipCode && !zipCode) {
        setZipCode(data.zipCode)
        newAutoFilled.add('zipCode')
      }

      if (data.companySize && !companySize) {
        setCompanySize(data.companySize)
        newAutoFilled.add('companySize')
      }

      if (data.specialties && data.specialties.length > 0 && selectedSpecialties.length === 0) {
        setSelectedSpecialties(data.specialties as TradeCategory[])
        newAutoFilled.add('specialties')
      }

      // Store the website URL
      setWebsite(websiteUrl.trim())

      setAutoFilledFields(newAutoFilled)
      setWebsiteParsed(true)
    } catch (err) {
      setWebsiteError(err instanceof Error ? err.message : 'Failed to parse website')
    } finally {
      setIsParsingWebsite(false)
    }
  }

  const handleSpecialtyToggle = (specialty: TradeCategory) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
    // Remove from auto-filled if user manually changes
    if (autoFilledFields.has('specialties')) {
      setAutoFilledFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete('specialties')
        return newSet
      })
    }
  }

  const handleFieldChange = (fieldName: string, setter: (value: string) => void, value: string) => {
    setter(value)
    if (autoFilledFields.has(fieldName)) {
      setAutoFilledFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fieldName)
        return newSet
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/onboarding/employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          companySize,
          contactEmail,
          contactPhone,
          city,
          state,
          zipCode,
          specialties: selectedSpecialties,
          description,
          website,
          userId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create company')
      }

      const { employerId } = await response.json()
      router.push(`/org/${employerId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  // Check which fields need attention after website parse
  const needsAttention = {
    companyName: websiteParsed && !companyName,
    companySize: websiteParsed && !companySize,
    city: websiteParsed && !city,
    state: websiteParsed && !state,
    zipCode: websiteParsed && !zipCode,
    specialties: websiteParsed && selectedSpecialties.length === 0,
  }

  const hasFieldsNeedingAttention = Object.values(needsAttention).some(Boolean)

  const getInputClasses = (fieldName: keyof typeof needsAttention) => {
    const base = 'mt-1 block w-full rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500'
    if (needsAttention[fieldName]) {
      return `${base} border-amber-400 bg-amber-50`
    }
    if (autoFilledFields.has(fieldName)) {
      return `${base} border-violet-300 bg-violet-50`
    }
    return `${base} border-slate-300`
  }

  const getFieldLabel = (fieldName: string, label: string, required: boolean = false) => (
    <label htmlFor={fieldName} className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
      <span>{label}{required && ' *'}</span>
      {autoFilledFields.has(fieldName) && (
        <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
      )}
      {needsAttention[fieldName as keyof typeof needsAttention] && (
        <ExclamationCircleIcon className="h-3.5 w-3.5 text-amber-500" />
      )}
    </label>
  )

  return (
    <div className="space-y-6">
      {/* AI Website Parser Section */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 bg-violet-100 rounded-lg">
              <SparklesIcon className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Quick Fill with AI</h2>
              <p className="text-xs text-gray-500">
                Paste your website URL to auto-fill company details
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex-1 relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isParsingWebsite) {
                  e.preventDefault()
                  handleParseWebsite()
                }
              }}
              placeholder="www.yourcompany.com"
              disabled={isParsingWebsite}
              className="w-full pl-9 pr-4 py-2.5 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white disabled:opacity-50"
            />
          </div>
          {websiteParsed ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-green-200 rounded-lg">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Parsed</span>
              </div>
              <button
                type="button"
                onClick={handleParseWebsite}
                disabled={isParsingWebsite || !websiteUrl.trim()}
                className="px-4 py-2 text-sm font-medium text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors disabled:opacity-50"
              >
                Re-parse
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleParseWebsite}
              disabled={isParsingWebsite || !websiteUrl.trim()}
              className="px-5 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isParsingWebsite ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Parse Website
                </>
              )}
            </button>
          )}
        </div>

        {websiteError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <ExclamationCircleIcon className="h-4 w-4" />
            {websiteError}
          </div>
        )}
      </div>

      {/* Attention Banner */}
      {websiteParsed && hasFieldsNeedingAttention && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
          <SparklesIcon className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-violet-800">AI couldn&apos;t determine some details</p>
            <p className="text-sm text-violet-700 mt-1">
              Please complete the highlighted fields below to finish setting up your company.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Company Info Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              {getFieldLabel('companyName', 'Company Name', true)}
              <input
                type="text"
                id="companyName"
                required
                value={companyName}
                onChange={(e) => handleFieldChange('companyName', setCompanyName, e.target.value)}
                className={getInputClasses('companyName')}
                placeholder="Acme Electrical Services"
              />
            </div>

            <div>
              {getFieldLabel('companySize', 'Company Size', true)}
              <select
                id="companySize"
                required
                value={companySize}
                onChange={(e) => handleFieldChange('companySize', setCompanySize, e.target.value)}
                className={getInputClasses('companySize')}
              >
                <option value="">Select size</option>
                {companySizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contactEmail" className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <span>Contact Email *</span>
                {autoFilledFields.has('contactEmail') && (
                  <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
                )}
              </label>
              <input
                type="email"
                id="contactEmail"
                required
                value={contactEmail}
                onChange={(e) => handleFieldChange('contactEmail', setContactEmail, e.target.value)}
                className={`mt-1 block w-full rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 ${
                  autoFilledFields.has('contactEmail') ? 'border-violet-300 bg-violet-50' : 'border-slate-300'
                }`}
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <span>Contact Phone</span>
                {autoFilledFields.has('contactPhone') && (
                  <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
                )}
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => handleFieldChange('contactPhone', setContactPhone, e.target.value)}
                className={`mt-1 block w-full rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 ${
                  autoFilledFields.has('contactPhone') ? 'border-violet-300 bg-violet-50' : 'border-slate-300'
                }`}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <span>Company Description</span>
                {autoFilledFields.has('description') && (
                  <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
                )}
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => handleFieldChange('description', setDescription, e.target.value)}
                className={`mt-1 block w-full rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 ${
                  autoFilledFields.has('description') ? 'border-violet-300 bg-violet-50' : 'border-slate-300'
                }`}
                placeholder="Tell us about your company..."
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Location</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              {getFieldLabel('city', 'City', true)}
              <input
                type="text"
                id="city"
                required
                value={city}
                onChange={(e) => handleFieldChange('city', setCity, e.target.value)}
                className={getInputClasses('city')}
              />
            </div>

            <div>
              {getFieldLabel('state', 'State', true)}
              <input
                type="text"
                id="state"
                required
                value={state}
                onChange={(e) => handleFieldChange('state', setState, e.target.value)}
                className={getInputClasses('state')}
                placeholder="CO"
              />
            </div>

            <div>
              {getFieldLabel('zipCode', 'ZIP Code', true)}
              <input
                type="text"
                id="zipCode"
                required
                value={zipCode}
                onChange={(e) => handleFieldChange('zipCode', setZipCode, e.target.value)}
                className={getInputClasses('zipCode')}
              />
            </div>
          </div>
        </div>

        {/* Trade Specialties Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-slate-900">Trade Specialties *</h2>
            {autoFilledFields.has('specialties') && (
              <SparklesIcon className="h-4 w-4 text-violet-500" />
            )}
            {needsAttention.specialties && (
              <ExclamationCircleIcon className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <p className="text-sm text-slate-500 mb-4">Select all trades your company specializes in.</p>
          <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 p-4 rounded-lg ${
            needsAttention.specialties ? 'bg-amber-50 border border-amber-200' :
            autoFilledFields.has('specialties') ? 'bg-violet-50 border border-violet-200' : ''
          }`}>
            {tradeCategoryOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex cursor-pointer rounded-lg border p-3 transition-colors ${
                  selectedSpecialties.includes(option.value as TradeCategory)
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedSpecialties.includes(option.value as TradeCategory)}
                  onChange={() => handleSpecialtyToggle(option.value as TradeCategory)}
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
          {selectedSpecialties.length === 0 && (
            <p className="mt-2 text-sm text-red-500">Please select at least one specialty</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || selectedSpecialties.length === 0}
            className="w-full rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating your company...' : 'Create Company & Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
