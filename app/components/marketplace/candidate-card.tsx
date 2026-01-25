'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import {
  UserCircleIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShareIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { saveCandidate } from '@/utils/actions'
import OfferMessageModal from '../offer-message-modal'
import { TradeCategory } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

type DecimalLike = number | Decimal | { toString(): string } | null | undefined

interface Certification {
  id: string
  name: string
  issuingBody?: string | null
  verified: boolean
}

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
  certifications?: Certification[]
}

interface CandidateCardProps {
  candidate: Employee
}

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

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const [state, formAction] = useFormState(saveCandidate, { success: false })
  const [showContactModal, setShowContactModal] = useState(false)

  const fullName = [candidate.firstName, candidate.lastName].filter(Boolean).join(' ') || 'Anonymous'
  const tradeLabel = candidate.tradeCategory ? tradeCategoryLabels[candidate.tradeCategory] : 'Trade Professional'
  const experience = candidate.yearsExperience ? `${candidate.yearsExperience} years of exp` : null
  const hourlyRate = candidate.hourlyRate ? `$${Number(candidate.hourlyRate).toFixed(0)}/hr` : null

  // Build info line like "10 years of exp • Denver, CO • Available"
  const infoItems = [experience, candidate.location, 'Open to work'].filter(Boolean)

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <OfferMessageModal
        open={showContactModal}
        setOpen={setShowContactModal}
        candidate={candidate}
        employer={candidate.employer}
      />

      <div className="p-5">
        {/* Header row: Photo, Name, Quick actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Profile Photo */}
            <Link href={`/marketplace/user/${candidate.id}`}>
              {candidate.profileImage ? (
                <Image
                  src={candidate.profileImage}
                  alt={fullName}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCircleIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </Link>

            {/* Name and basic info */}
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/marketplace/user/${candidate.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-emerald-600"
                >
                  {fullName}
                </Link>
                {candidate.isBackgroundChecked && (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" title="Background Checked" />
                )}
              </div>
              <p className="text-sm text-gray-600">{infoItems.join(' • ')}</p>

              {/* Active badge */}
              <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active this week
              </span>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-2">
            {candidate.resumeSummary && (
              <button className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-md flex items-center gap-1">
                <DocumentTextIcon className="h-4 w-4" />
                Resume
              </button>
            )}
            <Link
              href={`/marketplace/user/${candidate.id}`}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Bio/Summary */}
        {(candidate.bio || candidate.resumeSummary) && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Looking for</p>
            <p className="text-sm text-gray-700 line-clamp-3">
              {candidate.bio || candidate.resumeSummary}
            </p>
          </div>
        )}

        {/* Trade & Experience */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Trade Specialty</p>
          <div className="flex items-center gap-3">
            {candidate.employer?.logo ? (
              <Image
                src={candidate.employer.logo}
                alt={candidate.employer.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500">
                  {candidate.employer?.name?.charAt(0) || tradeLabel.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{tradeLabel}</p>
              <p className="text-xs text-gray-500">
                {candidate.employer?.name || 'Independent'} • {experience || 'Experience not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        {candidate.certifications && candidate.certifications.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {candidate.certifications.slice(0, 4).map((cert) => (
                <span
                  key={cert.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    cert.verified
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cert.verified && <CheckBadgeIcon className="h-3.5 w-3.5" />}
                  {cert.name}
                </span>
              ))}
              {candidate.certifications.length > 4 && (
                <span className="text-xs text-gray-500 self-center">
                  +{candidate.certifications.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Preferences row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {hourlyRate && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-gray-100 text-gray-700">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
              {hourlyRate}
            </span>
          )}
          {candidate.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-gray-100 text-gray-700">
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              {candidate.location}
            </span>
          )}
          {candidate.isInsured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm bg-blue-50 text-blue-700">
              <CheckCircleIcon className="h-4 w-4" />
              Insured
            </span>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50 rounded-b-lg">
        <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ShareIcon className="h-4 w-4" />
          Share
        </button>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
            <XMarkIcon className="h-4 w-4" />
            Not interested
          </button>
          <form action={formAction} className="inline">
            <input type="hidden" name="employeeId" value={candidate.id} />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Save
            </button>
          </form>
          <button
            onClick={() => setShowContactModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            Request to chat
          </button>
        </div>
      </div>
    </div>
  )
}
