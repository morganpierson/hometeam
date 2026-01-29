'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

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

interface ParsedResumeData {
  resumeUrl: string
  summary: string
  lookingFor: string
  experiences: Array<{
    title: string
    company: string
    startDate: string | null
    endDate: string | null
    isCurrent: boolean
    description: string | null
    highlights: string[]
    location: string | null
  }>
  inferredData: {
    tradeCategory: string | null
    yearsExperience: number | null
    location: string | null
    bio: string | null
  }
}

export default function EmployeeOnboardingForm({ employeeId }: EmployeeOnboardingFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [resumeParsed, setResumeParsed] = useState(false)
  const [parsedResumeData, setParsedResumeData] = useState<ParsedResumeData | null>(null)

  const [formData, setFormData] = useState({
    tradeCategory: '',
    yearsExperience: '',
    location: '',
    bio: '',
    hourlyRate: '',
  })

  // Track which fields were auto-filled vs need attention
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set())

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Remove from auto-filled if user manually changes
    if (autoFilledFields.has(name)) {
      setAutoFilledFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete(name)
        return newSet
      })
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setResumeError('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setResumeError('File size must be less than 10MB')
      return
    }

    setIsParsingResume(true)
    setResumeError(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('resume', file)

      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formDataUpload,
      })

      // Check content type to ensure we got JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume')
      }

      setParsedResumeData(data)
      setResumeParsed(true)

      // Pre-fill form fields with inferred data
      const newAutoFilled = new Set<string>()
      const updates: Partial<typeof formData> = {}

      if (data.inferredData.tradeCategory && !formData.tradeCategory) {
        updates.tradeCategory = data.inferredData.tradeCategory
        newAutoFilled.add('tradeCategory')
      }

      if (data.inferredData.yearsExperience !== null && !formData.yearsExperience) {
        updates.yearsExperience = String(data.inferredData.yearsExperience)
        newAutoFilled.add('yearsExperience')
      }

      if (data.inferredData.location && !formData.location) {
        updates.location = data.inferredData.location
        newAutoFilled.add('location')
      }

      if (data.inferredData.bio && !formData.bio) {
        updates.bio = data.inferredData.bio
        newAutoFilled.add('bio')
      }

      if (Object.keys(updates).length > 0) {
        setFormData((prev) => ({ ...prev, ...updates }))
        setAutoFilledFields(newAutoFilled)
      }
    } catch (err) {
      setResumeError(err instanceof Error ? err.message : 'Failed to parse resume')
    } finally {
      setIsParsingResume(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // First save the profile data
      const response = await fetch(`/api/user/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            tradeCategory: formData.tradeCategory || null,
            yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
            location: formData.location || null,
            bio: formData.bio || null,
            hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
            isAvailableForHire: true,
            // If resume was parsed, include resume data
            ...(parsedResumeData && {
              resume: parsedResumeData.resumeUrl,
              resumeSummary: parsedResumeData.summary,
              lookingFor: parsedResumeData.lookingFor,
            }),
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save profile')
      }

      // If we have parsed work experiences, save them
      if (parsedResumeData?.experiences?.length) {
        await fetch('/api/work-experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId,
            experiences: parsedResumeData.experiences,
          }),
        })
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = formData.tradeCategory && formData.yearsExperience && formData.location

  // Determine which required fields still need attention
  const needsAttention = {
    tradeCategory: resumeParsed && !formData.tradeCategory,
    yearsExperience: resumeParsed && !formData.yearsExperience,
    location: resumeParsed && !formData.location,
  }

  const getFieldClasses = (fieldName: keyof typeof needsAttention) => {
    const baseClasses = 'w-full rounded-lg border px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent'

    if (needsAttention[fieldName]) {
      return `${baseClasses} border-amber-400 bg-amber-50`
    }
    if (autoFilledFields.has(fieldName)) {
      return `${baseClasses} border-violet-300 bg-violet-50`
    }
    return `${baseClasses} border-slate-300`
  }

  return (
    <div className="space-y-6">
      {/* AI Resume Upload Section */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 bg-violet-100 rounded-lg">
              <SparklesIcon className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Quick Fill with AI</h2>
              <p className="text-xs text-gray-500">
                Upload your resume to auto-fill the form
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
              disabled={isParsingResume}
            />

            {resumeParsed ? (
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-green-200 rounded-lg flex-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700">
                    Found {parsedResumeData?.experiences?.length || 0} experiences
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isParsingResume}
                  className="px-4 py-2 text-sm font-medium text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                >
                  Upload Different
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsingResume}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {isParsingResume ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Analyzing resume...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4" />
                    Upload Resume (PDF)
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {resumeError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <ExclamationCircleIcon className="h-4 w-4" />
            {resumeError}
          </div>
        )}
      </div>

      {/* Attention Banner */}
      {resumeParsed && (needsAttention.tradeCategory || needsAttention.yearsExperience || needsAttention.location) && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
          <SparklesIcon className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-violet-800">AI couldn&apos;t determine some details</p>
            <p className="text-sm text-violet-700 mt-1">
              Please complete the highlighted fields below to finish your profile.
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Trade Category */}
          <div>
            <label htmlFor="tradeCategory" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
              <span>What&apos;s your trade? <span className="text-red-500">*</span></span>
              {autoFilledFields.has('tradeCategory') && (
                <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
              )}
              {needsAttention.tradeCategory && (
                <ExclamationCircleIcon className="h-3.5 w-3.5 text-amber-500" />
              )}
            </label>
            <select
              id="tradeCategory"
              name="tradeCategory"
              value={formData.tradeCategory}
              onChange={handleChange}
              required
              className={getFieldClasses('tradeCategory')}
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
            <label htmlFor="yearsExperience" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
              <span>Years of experience <span className="text-red-500">*</span></span>
              {autoFilledFields.has('yearsExperience') && (
                <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
              )}
              {needsAttention.yearsExperience && (
                <ExclamationCircleIcon className="h-3.5 w-3.5 text-amber-500" />
              )}
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
              className={`${getFieldClasses('yearsExperience')} placeholder:text-slate-400`}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
              <span>Where are you located? <span className="text-red-500">*</span></span>
              {autoFilledFields.has('location') && (
                <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
              )}
              {needsAttention.location && (
                <ExclamationCircleIcon className="h-3.5 w-3.5 text-amber-500" />
              )}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Austin, TX"
              className={`${getFieldClasses('location')} placeholder:text-slate-400`}
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
            <label htmlFor="bio" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
              <span>Tell employers about yourself <span className="text-slate-400 font-normal">(optional)</span></span>
              {autoFilledFields.has('bio') && (
                <SparklesIcon className="h-3.5 w-3.5 text-violet-500" />
              )}
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your experience, specialties, and what you're looking for..."
              className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none ${
                autoFilledFields.has('bio') ? 'border-violet-300 bg-violet-50' : 'border-slate-300'
              }`}
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
    </div>
  )
}
