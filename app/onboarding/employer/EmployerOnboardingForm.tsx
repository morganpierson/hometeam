'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TradeCategory } from '@prisma/client'

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

export default function EmployerOnboardingForm({
  tradeCategoryOptions,
  companySizeOptions,
  userId,
  userEmail,
  userFirstName,
  userLastName,
}: EmployerOnboardingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleSpecialtyToggle = (specialty: TradeCategory) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
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

  return (
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
            <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Acme Electrical Services"
            />
          </div>

          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-slate-700">
              Company Size *
            </label>
            <select
              id="companySize"
              required
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700">
              Contact Email *
            </label>
            <input
              type="email"
              id="contactEmail"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Company Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <label htmlFor="city" className="block text-sm font-medium text-slate-700">
              City *
            </label>
            <input
              type="text"
              id="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-700">
              State *
            </label>
            <input
              type="text"
              id="state"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="CO"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zipCode"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Trade Specialties Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Trade Specialties *</h2>
        <p className="text-sm text-slate-500 mb-4">Select all trades your company specializes in.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {tradeCategoryOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex cursor-pointer rounded-lg border p-3 transition-colors ${
                selectedSpecialties.includes(option.value as TradeCategory)
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300'
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
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating your company...' : 'Create Company & Continue'}
        </button>
      </div>
    </form>
  )
}
