import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import Image from 'next/image'
import {
  UserCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import ResumeUpload from '../../components/resume-upload'
import ResumeSummary from '../../components/resume-summary'
import ResumeHeaderActions from '../../components/resume-header-actions'

export const dynamic = 'force-dynamic'

const tradeCategoryLabels: Record<string, string> = {
  ELECTRICIAN: 'Electrician',
  PLUMBER: 'Plumber',
  HVAC: 'HVAC Technician',
  CARPENTER: 'Carpenter',
  ROOFER: 'Roofer',
  PAINTER: 'Painter',
  MASON: 'Mason',
  WELDER: 'Welder',
  GENERAL_CONTRACTOR: 'General Contractor',
  LANDSCAPER: 'Landscaper',
  CONCRETE: 'Concrete Specialist',
  DRYWALL: 'Drywall Installer',
  FLOORING: 'Flooring Specialist',
  GLAZIER: 'Glazier',
  INSULATION: 'Insulation Installer',
  IRONWORKER: 'Ironworker',
  SHEET_METAL: 'Sheet Metal Worker',
  TILE_SETTER: 'Tile Setter',
  OTHER: 'Trade Professional',
}

export default async function ProfilePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const employee = await prisma.employee.findUnique({
    where: { clerkId: userId },
    include: {
      certifications: true,
      workExperiences: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!employee) {
    redirect('/new-user')
  }

  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Candidate'
  const tradeLabel = employee.tradeCategory
    ? tradeCategoryLabels[employee.tradeCategory]
    : 'Trade Professional'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage how employers see you
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-6">
          {employee.profileImage ? (
            <Image
              src={employee.profileImage}
              alt={fullName}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
              <UserCircleIcon className="h-16 w-16 text-amber-600" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
                <p className="text-gray-500">{tradeLabel}</p>
                {employee.resume && (
                  <ResumeHeaderActions resumeUrl={employee.resume} />
                )}
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {employee.location && (
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  {employee.location}
                </span>
              )}
              {employee.yearsExperience && (
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                  {employee.yearsExperience} years experience
                </span>
              )}
              {employee.hourlyRate && (
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                  ${Number(employee.hourlyRate)}/hour
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Upload - only show if no resume uploaded */}
      {!employee.resume && <div className="mb-6"><ResumeUpload /></div>}

      {/* Resume Summary with Work Experiences */}
      <div className="mb-6">
        <ResumeSummary
          employee={{
            firstName: employee.firstName,
            lastName: employee.lastName,
            profileImage: employee.profileImage,
            yearsExperience: employee.yearsExperience,
            location: employee.location,
            isAvailableForHire: employee.isAvailableForHire,
            resume: employee.resume,
            resumeSummary: employee.resumeSummary,
            lookingFor: employee.lookingFor,
          }}
          workExperiences={employee.workExperiences}
        />
      </div>

      {/* Visibility Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${employee.isAvailableForHire ? 'bg-green-50' : 'bg-gray-100'}`}>
              <CheckCircleIcon className={`h-5 w-5 ${employee.isAvailableForHire ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {employee.isAvailableForHire ? 'Visible to employers' : 'Hidden from employers'}
              </p>
              <p className="text-sm text-gray-500">
                {employee.isAvailableForHire
                  ? 'Your profile appears in the talent marketplace'
                  : 'Your profile is not visible in search results'}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700">
            {employee.isAvailableForHire ? 'Hide profile' : 'Make visible'}
          </button>
        </div>
      </div>

      {/* About */}
      {employee.bio && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">About</h3>
            <button className="text-sm font-medium text-amber-600 hover:text-amber-700">Edit</button>
          </div>
          <p className="text-gray-600">{employee.bio}</p>
        </div>
      )}

      {/* Certifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Certifications</h3>
          <button className="text-sm font-medium text-amber-600 hover:text-amber-700">Add</button>
        </div>
        {employee.certifications.length > 0 ? (
          <div className="space-y-3">
            {employee.certifications.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{cert.name}</p>
                  {cert.issuingBody && (
                    <p className="text-sm text-gray-500">{cert.issuingBody}</p>
                  )}
                </div>
                {cert.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No certifications added yet. Add your licenses and certifications to stand out to employers.
          </p>
        )}
      </div>
    </div>
  )
}
