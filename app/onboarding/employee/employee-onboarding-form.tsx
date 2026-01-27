'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TRADE_CATEGORIES = [
  { value: 'ELECTRICIAN', label: 'Electrician' },
  { value: 'PLUMBER', label: 'Plumber' },
  { value: 'HVAC', label: 'HVAC Technician' },
  { value: 'CARPENTER', label: 'Carpenter' },
  { value: 'ROOFER', label: 'Roofer' },
  { value: 'PAINTER', label: 'Painter' },
  { value: 'MASON', label: 'Mason' },
  { value: 'WELDER', label: 'Welder' },
  { value: 'GENERAL_CONTRACTOR', label: 'General Contractor' },
  { value: 'LANDSCAPER', label: 'Landscaper' },
  { value: 'CONCRETE', label: 'Concrete Specialist' },
  { value: 'DRYWALL', label: 'Drywall Installer' },
  { value: 'FLOORING', label: 'Flooring Specialist' },
  { value: 'GLAZIER', label: 'Glazier' },
  { value: 'INSULATION', label: 'Insulation Installer' },
  { value: 'IRONWORKER', label: 'Ironworker' },
  { value: 'SHEET_METAL', label: 'Sheet Metal Worker' },
  { value: 'TILE_SETTER', label: 'Tile Setter' },
  { value: 'OTHER', label: 'Other Trade' },
]

interface EmployeeOnboardingFormProps {
  employeeId: string
}

export default function EmployeeOnboardingForm({ employeeId }: EmployeeOnboardingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    tradeCategory: '',
    yearsExperience: '',
    location: '',
    bio: '',
    hourlyRate: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/user/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            tradeCategory: formData.tradeCategory,
            yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
            location: formData.location,
            bio: formData.bio || null,
            hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
            isAvailableForHire: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = formData.tradeCategory && formData.yearsExperience && formData.location

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Trade Category */}
        <div>
          <label htmlFor="tradeCategory" className="block text-sm font-medium text-slate-700 mb-2">
            What&apos;s your trade? <span className="text-red-500">*</span>
          </label>
          <select
            id="tradeCategory"
            name="tradeCategory"
            value={formData.tradeCategory}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">Select your trade</option>
            {TRADE_CATEGORIES.map((trade) => (
              <option key={trade.value} value={trade.value}>
                {trade.label}
              </option>
            ))}
          </select>
        </div>

        {/* Years of Experience */}
        <div>
          <label htmlFor="yearsExperience" className="block text-sm font-medium text-slate-700 mb-2">
            Years of experience <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="yearsExperience"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleChange}
            min="0"
            max="50"
            required
            placeholder="e.g., 5"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
            Where are you located? <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., Austin, TX"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Hourly Rate */}
        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-700 mb-2">
            Desired hourly rate <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="e.g., 35"
              className="w-full rounded-lg border border-slate-300 pl-8 pr-16 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">/hour</span>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">
            Tell employers about yourself <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your experience, specialties, and what you're looking for..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            'Complete Profile'
          )}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          You can update your profile anytime from your dashboard.
        </p>
      </div>
    </form>
  )
}
