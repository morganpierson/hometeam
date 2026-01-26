'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TradeCategory } from '@prisma/client'
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface Employer {
  id: string
  name: string
  size?: string | null
  website?: string | null
  description?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  city?: string | null
  state?: string | null
}

interface JobPostingFormProps {
  employer: Employer
  orgId: string
}

const tradeCategoryOptions: { value: TradeCategory; label: string }[] = [
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
  { value: 'OTHER', label: 'Other' },
]

const jobTypeOptions = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' },
]

const payTypeOptions = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'SALARY', label: 'Salary' },
  { value: 'PROJECT_BASED', label: 'Project-based' },
]

const benefitOptions = [
  'Health Insurance',
  'Dental Insurance',
  'Vision Insurance',
  '401(k)',
  '401(k) Matching',
  'Paid Time Off',
  'Paid Holidays',
  'Flexible Schedule',
  'Tools Provided',
  'Company Vehicle',
  'Gas Allowance',
  'Training & Development',
  'Safety Equipment Provided',
  'Overtime Pay',
  'Performance Bonuses',
]

const certificationOptions = [
  'Licensed Journeyman',
  'Licensed Master',
  'OSHA 10',
  'OSHA 30',
  'EPA Certification',
  'CDL License',
  'First Aid/CPR',
  'Confined Space',
  'Fall Protection',
  'Forklift Certified',
  'Welding Certification',
  'Backflow Prevention',
  'Fire Alarm License',
  'Low Voltage License',
]

const companySizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
]

export default function JobPostingForm({ employer, orgId }: JobPostingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [sectionsNeedingAttention, setSectionsNeedingAttention] = useState<string[]>([])

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    jobType: 'FULL_TIME',

    // Role Requirements
    primaryTrade: '' as TradeCategory | '',
    requiredCertifications: [] as string[],
    minYearsExperience: '',
    maxYearsExperience: '',

    // Location
    city: employer.city || '',
    state: employer.state || '',
    zipCode: '',
    isRemote: false,

    // Compensation
    payType: 'HOURLY',
    payRangeMin: '',
    payRangeMax: '',

    // Benefits
    benefits: [] as string[],

    // Contact
    contactName: '',
    contactEmail: employer.contactEmail || '',
    contactPhone: employer.contactPhone || '',

    // Company
    companySize: employer.size || '',
    companyWebsite: employer.website || '',
    companyDescription: employer.description || '',
  })

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'benefits' | 'requiredCertifications', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/jobs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate job posting')
      }

      const generatedData = await response.json()

      // Update form with generated data
      setFormData(prev => ({
        ...prev,
        title: generatedData.title || prev.title,
        description: generatedData.description || prev.description,
        primaryTrade: generatedData.primaryTrade || prev.primaryTrade,
        jobType: generatedData.jobType || prev.jobType,
        minYearsExperience: generatedData.minYearsExperience || prev.minYearsExperience,
        maxYearsExperience: generatedData.maxYearsExperience || prev.maxYearsExperience,
        requiredCertifications: generatedData.requiredCertifications?.length > 0
          ? generatedData.requiredCertifications
          : prev.requiredCertifications,
        city: generatedData.city || prev.city,
        state: generatedData.state || prev.state,
        payType: generatedData.payType || prev.payType,
        payRangeMin: generatedData.payRangeMin || prev.payRangeMin,
        payRangeMax: generatedData.payRangeMax || prev.payRangeMax,
        benefits: generatedData.benefits?.length > 0
          ? generatedData.benefits
          : prev.benefits,
      }))

      // Set sections that need attention
      setSectionsNeedingAttention(generatedData.needsAttention || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate job posting')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, status: 'DRAFT' | 'ACTIVE') => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
          employerId: employer.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create job posting')
      }

      router.push(`/org/${orgId}/jobs`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  return (
    <form className="max-w-4xl mx-auto">
      {/* AI Auto-Fill Section */}
      <section className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 rounded-lg">
            <SparklesIcon className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Fill with AI</h2>
            <p className="text-sm text-gray-500">
              Describe your ideal candidate and we&apos;ll fill out the form for you
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isGenerating) {
                e.preventDefault()
                handleGenerateWithAI()
              }
            }}
            placeholder="e.g., Journeyman electrician with 10 years of commercial experience in the Denver metro area"
            className="flex-1 px-4 py-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
          />
          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={isGenerating || !aiPrompt.trim()}
            className="px-5 py-3 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
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
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </section>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Sections Needing Attention Alert */}
      {sectionsNeedingAttention.length > 0 && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-300 p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Please confirm the following sections:
              </p>
              <ul className="mt-1 text-sm text-amber-700">
                {sectionsNeedingAttention.includes('location') && (
                  <li>• Location details</li>
                )}
                {sectionsNeedingAttention.includes('requirements') && (
                  <li>• Requirements (experience & certifications)</li>
                )}
                {sectionsNeedingAttention.includes('compensation') && (
                  <li>• Compensation details</li>
                )}
                {sectionsNeedingAttention.includes('benefits') && (
                  <li>• Benefits</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <BriefcaseIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Licensed Electrician, HVAC Technician"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="primaryTrade" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Trade *
              </label>
              <select
                id="primaryTrade"
                required
                value={formData.primaryTrade}
                onChange={(e) => updateField('primaryTrade', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select a trade</option>
                {tradeCategoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                Position Type *
              </label>
              <select
                id="jobType"
                required
                value={formData.jobType}
                onChange={(e) => updateField('jobType', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {jobTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Experience & Certifications */}
      <section className={clsx(
        "bg-white rounded-xl border p-6 mb-6",
        sectionsNeedingAttention.includes('requirements')
          ? "border-amber-300 bg-amber-50/30"
          : "border-gray-200"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className={clsx(
            "p-2 rounded-lg",
            sectionsNeedingAttention.includes('requirements') ? "bg-amber-100" : "bg-blue-100"
          )}>
            <UserIcon className={clsx(
              "h-5 w-5",
              sectionsNeedingAttention.includes('requirements') ? "text-amber-600" : "text-blue-600"
            )} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
          {sectionsNeedingAttention.includes('requirements') && (
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              Needs review
            </span>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  min="0"
                  value={formData.minYearsExperience}
                  onChange={(e) => updateField('minYearsExperience', e.target.value)}
                  placeholder="Minimum"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  value={formData.maxYearsExperience}
                  onChange={(e) => updateField('maxYearsExperience', e.target.value)}
                  placeholder="Maximum (optional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Certifications
            </label>
            <div className="flex flex-wrap gap-2">
              {certificationOptions.map(cert => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleArrayItem('requiredCertifications', cert)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    formData.requiredCertifications.includes(cert)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {formData.requiredCertifications.includes(cert) && (
                    <CheckIcon className="inline h-3.5 w-3.5 mr-1" />
                  )}
                  {cert}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className={clsx(
        "bg-white rounded-xl border p-6 mb-6",
        sectionsNeedingAttention.includes('location')
          ? "border-amber-300 bg-amber-50/30"
          : "border-gray-200"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className={clsx(
            "p-2 rounded-lg",
            sectionsNeedingAttention.includes('location') ? "bg-amber-100" : "bg-purple-100"
          )}>
            <MapPinIcon className={clsx(
              "h-5 w-5",
              sectionsNeedingAttention.includes('location') ? "text-amber-600" : "text-purple-600"
            )} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Location</h2>
          {sectionsNeedingAttention.includes('location') && (
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              Needs review
            </span>
          )}
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                required
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="Denver"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                id="state"
                required
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="CO"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => updateField('zipCode', e.target.value)}
                placeholder="80202"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isRemote}
              onChange={(e) => updateField('isRemote', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">This position allows remote work</span>
          </label>
        </div>
      </section>

      {/* Compensation */}
      <section className={clsx(
        "bg-white rounded-xl border p-6 mb-6",
        (sectionsNeedingAttention.includes('compensation') || sectionsNeedingAttention.includes('benefits'))
          ? "border-amber-300 bg-amber-50/30"
          : "border-gray-200"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className={clsx(
            "p-2 rounded-lg",
            (sectionsNeedingAttention.includes('compensation') || sectionsNeedingAttention.includes('benefits'))
              ? "bg-amber-100"
              : "bg-green-100"
          )}>
            <CurrencyDollarIcon className={clsx(
              "h-5 w-5",
              (sectionsNeedingAttention.includes('compensation') || sectionsNeedingAttention.includes('benefits'))
                ? "text-amber-600"
                : "text-green-600"
            )} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Compensation</h2>
          {(sectionsNeedingAttention.includes('compensation') || sectionsNeedingAttention.includes('benefits')) && (
            <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              Needs review
            </span>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="payType" className="block text-sm font-medium text-gray-700 mb-1">
              Pay Type *
            </label>
            <select
              id="payType"
              required
              value={formData.payType}
              onChange={(e) => updateField('payType', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {payTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pay Range {formData.payType === 'HOURLY' ? '($/hr)' : formData.payType === 'SALARY' ? '($/year)' : '($)'}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  value={formData.payRangeMin}
                  onChange={(e) => updateField('payRangeMin', e.target.value)}
                  placeholder="Minimum"
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  value={formData.payRangeMax}
                  onChange={(e) => updateField('payRangeMax', e.target.value)}
                  placeholder="Maximum"
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
            </label>
            <div className="flex flex-wrap gap-2">
              {benefitOptions.map(benefit => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => toggleArrayItem('benefits', benefit)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    formData.benefits.includes(benefit)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {formData.benefits.includes(benefit) && (
                    <CheckIcon className="inline h-3.5 w-3.5 mr-1" />
                  )}
                  {benefit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 rounded-lg">
            <UserIcon className="h-5 w-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Recruiting Contact</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              value={formData.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              placeholder="hiring@company.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Company Details */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg">
            <BuildingOfficeIcon className="h-5 w-5 text-slate-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Company Details</h2>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                Company Size
              </label>
              <select
                id="companySize"
                value={formData.companySize}
                onChange={(e) => updateField('companySize', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select size</option>
                {companySizeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                Company Website
              </label>
              <input
                type="url"
                id="companyWebsite"
                value={formData.companyWebsite}
                onChange={(e) => updateField('companyWebsite', e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">
              About the Company
            </label>
            <textarea
              id="companyDescription"
              rows={4}
              value={formData.companyDescription}
              onChange={(e) => updateField('companyDescription', e.target.value)}
              placeholder="Tell candidates about your company, culture, and what makes it a great place to work..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'DRAFT')}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'ACTIVE')}
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Job'}
        </button>
      </div>
    </form>
  )
}
