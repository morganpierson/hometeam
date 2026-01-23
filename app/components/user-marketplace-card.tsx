'use client'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { saveCandidate } from '@/utils/actions'
import OfferMessageModal from './offer-message-modal'
import { useFormState } from 'react-dom'
import { useState } from 'react'
import Link from 'next/link'
import { TradeCategory } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

// Allow Prisma Decimal or number types
type DecimalLike = number | Decimal | { toString(): string } | null | undefined

interface Employee {
  id: string
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
  tradeCategory?: TradeCategory | null
  yearsExperience?: number | null
  hourlyRate?: DecimalLike
  location?: string | null
  employer?: {
    id: string
    name: string
    logo?: string | null
  } | null
  hireOffers?: Array<{
    offeredRate?: DecimalLike
    rateType?: string | null
  }>
  certifications?: Array<{
    name: string
    verified: boolean
  }>
}

interface UserMarketplaceCardProps {
  user: Employee
  employerImage?: string | null
  employer?: {
    id: string
    name: string
    logo?: string | null
  } | null
}

const UserMarketplaceCard = ({ user, employerImage, employer }: UserMarketplaceCardProps) => {
  const [state, formAction] = useFormState(saveCandidate, {
    success: false,
  })

  const [open, setOpen] = useState(false)

  const displayEmployerName = user.employer?.name || employer?.name || 'Independent'
  const displayEmployerImage = employerImage || user.employer?.logo

  return (
    <form action={formAction}>
      <OfferMessageModal
        open={open}
        setOpen={setOpen}
        candidate={user}
        employer={employer || user.employer}
      />

      <input type="hidden" name="employeeId" value={user.id} />
      <div className="flex flex-col hover:shadow-sm hover:cursor-pointer border border-slate-200 rounded-md bg-zinc-50 pb-12">
        <Link href={`/marketplace/user/${user.id}`}>
          <div className="flex items-center gap-2 p-4 justify-between">
            <div className="flex items-center">
              <div className="flex -space-x-4 items-end">
                {user.profileImage ? (
                  <Image
                    className="h-20 w-20 rounded-full bg-gray-50 ring-2 ring-white"
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    height={80}
                    width={80}
                  />
                ) : (
                  <UserCircleIcon
                    className="h-24 w-24 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                {displayEmployerImage ? (
                  <Image
                    className="h-10 w-10 rounded-full bg-gray-50 ring-2 ring-white"
                    src={displayEmployerImage}
                    alt={`${displayEmployerName} logo`}
                    height={40}
                    width={40}
                  />
                ) : (
                  <UserCircleIcon
                    className="h-10 w-10 text-gray-300"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="flex flex-col items-start ml-4">
                <div className="flex flex-col items-start mb-2">
                  <p className="text-xl font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-md font-light text-gray-900">
                    {displayEmployerName}
                  </p>
                </div>
                {user.tradeCategory && (
                  <div className="bg-cyan-200 rounded-3xl border border-cyan-600">
                    <p className="text-xs font-normal p-1 text-cyan-950">
                      {user.tradeCategory.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 items-end"
              >
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </Link>
        <div className="border border-slate-200 mx-4 rounded-sm font-medium flex mt-8 py-3 px-4 justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              {user.yearsExperience && (
                <span className="text-sm text-gray-600">
                  {user.yearsExperience} years exp.
                </span>
              )}
              {user.hourlyRate && (
                <span className="text-sm font-semibold text-green-600">
                  ${Number(user.hourlyRate).toFixed(0)}/hr
                </span>
              )}
              {user.location && (
                <span className="text-sm text-gray-500">{user.location}</span>
              )}
            </div>
            {user.certifications && user.certifications.length > 0 && (
              <div className="flex gap-2">
                {user.certifications.slice(0, 3).map((cert, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${
                      cert.verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cert.name}
                    {cert.verified && ' ✓'}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <button
              type="submit"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Save
            </button>
            <button
              type="button"
              className="flex items-center gap-1 justify-between rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={() => setOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
              Contact
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default UserMarketplaceCard
