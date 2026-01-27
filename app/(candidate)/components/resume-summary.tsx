import Image from 'next/image'
import Link from 'next/link'
import {
  UserCircleIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

interface WorkExperience {
  id: string
  title: string
  company: string
  companyLogo: string | null
  startDate: Date | null
  endDate: Date | null
  isCurrent: boolean
  description: string | null
  highlights: string[]
  location: string | null
}

interface ResumeSummaryProps {
  employee: {
    firstName: string | null
    lastName: string | null
    profileImage: string | null
    yearsExperience: number | null
    location: string | null
    isAvailableForHire: boolean
    resume: string | null
    resumeSummary: string | null
    lookingFor: string | null
  }
  workExperiences: WorkExperience[]
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(date))
}

function calculateDuration(startDate: Date | null, endDate: Date | null, isCurrent: boolean): string {
  if (!startDate) return ''

  const start = new Date(startDate)
  const end = isCurrent ? new Date() : (endDate ? new Date(endDate) : new Date())

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  }
}

export default function ResumeSummary({ employee, workExperiences }: ResumeSummaryProps) {
  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Candidate'

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {employee.profileImage ? (
              <Image
                src={employee.profileImage}
                alt={fullName}
                width={72}
                height={72}
                className="h-18 w-18 rounded-full object-cover"
              />
            ) : (
              <div className="h-18 w-18 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
              <p className="text-sm text-gray-600">
                {employee.yearsExperience ? `${employee.yearsExperience} years of exp` : 'Experience not set'}
                {employee.location && ` \u2022 ${employee.location}`}
                {employee.isAvailableForHire && ' \u2022 Open to opportunities'}
              </p>
              {employee.isAvailableForHire && (
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                  Active today
                </span>
              )}
            </div>
          </div>

          {employee.resume && (
            <Link
              href={employee.resume}
              target="_blank"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <DocumentTextIcon className="h-5 w-5" />
              Resume
            </Link>
          )}
        </div>
      </div>

      {/* Looking For Section */}
      {employee.lookingFor && (
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Looking for</p>
          <div className="flex items-start gap-3">
            <SparklesIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{employee.lookingFor}</p>
          </div>
        </div>
      )}

      {/* Experience Section */}
      {workExperiences.length > 0 && (
        <div className="p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Experience</p>
          <div className="space-y-6">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="flex gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  {exp.companyLogo ? (
                    <Image
                      src={exp.companyLogo}
                      alt={exp.company}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <BuildingOffice2Icon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Experience Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(exp.startDate)} to {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    {exp.startDate && (
                      <span className="text-gray-400">
                        {' \u00B7 '}
                        {calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)}
                      </span>
                    )}
                  </p>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                  )}

                  {/* Highlights */}
                  {exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-1.5">\u2022</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {workExperiences.length === 0 && !employee.resumeSummary && (
        <div className="p-6 text-center">
          <DocumentTextIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            Upload your resume to see your experience here
          </p>
        </div>
      )}
    </div>
  )
}
