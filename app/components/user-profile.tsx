'use client'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { ArrowDownTrayIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import React, { useState, useOptimistic, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { updateEmployeeInfo } from '@/utils/actions'
import { updateUserProfile } from '@/utils/api'
import Image from 'next/image'
import { TradeCategory } from '@prisma/client'
import type { Decimal } from '@prisma/client/runtime/library'

// Allow Prisma Decimal or number types
type DecimalLike = number | Decimal | { toString(): string } | null | undefined

interface Employee {
  id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  profileImage?: string | null
  resume?: string | null
  resumeSummary?: string | null
  bio?: string | null
  location?: string | null
  tradeCategory?: TradeCategory | null
  yearsExperience?: number | null
  hourlyRate?: DecimalLike
  avgRating?: DecimalLike
  isAvailableForHire?: boolean
  isBackgroundChecked?: boolean
  isInsured?: boolean
  employer?: {
    id: string
    name: string
  } | null
  certifications?: Array<{
    id: string
    name: string
    issuingBody?: string | null
    verified: boolean
  }>
  hireOffers?: Array<{
    offeredRate?: DecimalLike
    rateType?: string | null
  }>
  ownedPortfolioItems?: Array<{
    id: string
    title: string
    coverImage?: string | null
  }>
  contributions?: Array<{
    id: string
    title: string
    coverImage?: string | null
  }>
}

interface UserProfileProps {
  user: Employee | null
  org?: string | null
  isOnMarketplace?: boolean
}

const UserProfile = ({ user, org, isOnMarketplace = true }: UserProfileProps) => {
  console.log('USER PROFILE', user)
  console.log('ORG', org)

  const [isEditing, setIsEditing] = useState(false)

  const [state, formAction] = useFormState(updateEmployeeInfo, {
    success: false,
  })
  const status = useFormStatus()

  const listEmployee = async () => {
    if (user) {
      await updateUserProfile(user.id, {
        isAvailableForHire: !user.isAvailableForHire,
      })
    }
  }

  const tradeCategoryOptions = Object.values(TradeCategory)

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (currentState: any, optimisticValue: any) => [
      currentState,
      optimisticValue,
    ]
  )
  const ref = useRef(null)

  if (!user) {
    return <div>Employee not found</div>
  }

  return (
    <>
      <form
        action={async (formData) => {
          addOptimistic(formData)
          setIsEditing(!isEditing)
          await formAction(formData)
        }}
        ref={ref}
        className="ml-0 col-span-3"
      >
        <input type="hidden" name="employerId" value={org || ''} id="employerId" />
        <input type="hidden" name="id" value={user.id} id="id" />
        <div className="px-4 sm:px-0 flex">
          {user.profileImage ? (
            <Image src={user.profileImage} height={96} width={96} alt="" className="rounded-full" />
          ) : (
            <UserCircleIcon
              className="h-24 w-24 text-gray-300"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col justify-center ml-6">
            <h1 className="font-semibold leading-7 text-gray-900 text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 max-w-2xl leading-6 text-gray-500 text-lg">
              {user.tradeCategory?.replace('_', ' ') || 'Trade Worker'}
            </p>
            {user.resume && (
              <div className="flex items-center mt-4 hover:cursor-pointer">
                <div className="flex text-indigo-600 hover:text-indigo-500 mr-4">
                  <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                  <div className="ml-2 flex min-w-0 flex-1 gap-2">
                    <a className="font-medium" href={user.resume}>
                      {user.firstName} {user.lastName}&apos;s resume
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex gap-4 mt-4 px-4">
          {user.isBackgroundChecked && (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Background Checked
            </span>
          )}
          {user.isInsured && (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
              Insured
            </span>
          )}
          {user.yearsExperience && (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              {user.yearsExperience} years experience
            </span>
          )}
          {user.hourlyRate && (
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              ${Number(user.hourlyRate).toFixed(0)}/hr
            </span>
          )}
        </div>

        {!isOnMarketplace && (
          <div className="flex justify-end">
            {!isEditing ? (
              <button
                type="button"
                className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 flex"
                onClick={() => setIsEditing(!isEditing)}
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Edit
              </button>
            ) : (
              <div>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {status.pending ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="rounded-md ml-6 bg-white px-3 py-2 text-sm font-semibold text-red-900 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email address
              </dt>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={user.email || ''}
                    defaultValue={user.email || ''}
                  />
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">{user.email}</span>
                </dd>
              )}
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Trade Category
              </dt>
              {isEditing ? (
                <div>
                  <select
                    name="tradeCategory"
                    id="tradeCategory"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={user.tradeCategory || ''}
                  >
                    <option value="">Select a trade</option>
                    {tradeCategoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user.tradeCategory?.replace('_', ' ') || 'Not specified'}
                  </span>
                </dd>
              )}
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Hourly Rate
              </dt>
              {isEditing ? (
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <input
                    type="number"
                    name="hourlyRate"
                    id="hourlyRate"
                    className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="50"
                    defaultValue={user.hourlyRate ? Number(user.hourlyRate) : ''}
                  />
                  <span className="ml-2">/hr</span>
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user.hourlyRate ? `$${Number(user.hourlyRate).toFixed(0)}/hr` : 'Not specified'}
                  </span>
                </dd>
              )}
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Certifications
              </dt>
              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <div className="flex flex-wrap gap-2">
                  {user.certifications && user.certifications.length > 0 ? (
                    user.certifications.map((cert) => (
                      <span
                        key={cert.id}
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          cert.verified
                            ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                            : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
                        }`}
                      >
                        {cert.name}
                        {cert.verified && ' ✓'}
                      </span>
                    ))
                  ) : (
                    <span>No certifications listed</span>
                  )}
                </div>
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Bio / Summary
              </dt>
              {isEditing ? (
                <div>
                  <textarea
                    name="bio"
                    id="bio"
                    rows={4}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Tell us about your experience and skills..."
                    defaultValue={user.bio || user.resumeSummary || ''}
                  />
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user.bio || user.resumeSummary || 'No bio provided'}
                  </span>
                </dd>
              )}
            </div>

            {/* Portfolio Section */}
            {(user.ownedPortfolioItems?.length || user.contributions?.length) ? (
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Portfolio
                </dt>
                <dd className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="grid grid-cols-3 gap-4">
                    {user.ownedPortfolioItems?.map((item) => (
                      <div key={item.id} className="relative">
                        {item.coverImage && (
                          <Image
                            src={item.coverImage}
                            alt={item.title}
                            width={150}
                            height={100}
                            className="rounded-md object-cover"
                          />
                        )}
                        <p className="text-xs mt-1 text-gray-600">{item.title}</p>
                      </div>
                    ))}
                    {user.contributions?.map((item) => (
                      <div key={item.id} className="relative">
                        {item.coverImage && (
                          <Image
                            src={item.coverImage}
                            alt={item.title}
                            width={150}
                            height={100}
                            className="rounded-md object-cover"
                          />
                        )}
                        <p className="text-xs mt-1 text-gray-600">{item.title}</p>
                        <span className="text-xs text-green-600">Contributed</span>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </form>

      {!isOnMarketplace && (
        <div className="flex justify-end mt-6 mb-8">
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={listEmployee}
          >
            {user.isAvailableForHire
              ? 'Unlist from Marketplace'
              : 'List on Marketplace'}
          </button>
        </div>
      )}
    </>
  )
}

export default UserProfile
