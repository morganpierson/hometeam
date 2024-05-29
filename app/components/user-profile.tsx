'use client'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { ArrowDownTrayIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import React, { useState, useOptimistic, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createNewUser, updateUserInfo } from '@/utils/actions'
import { updateUserProfile } from '@/utils/api'
import SelectDropdown from './select-dropdown'
import Image from 'next/image'

const UserProfile = ({ user, org, isOnMarketplace = true }) => {
  console.log('USER PROFILE', user)
  console.log('ORG', org)

  const [isEditing, setIsEditing] = useState(false)
  const [tempImage, setTempImage] = useState('')

  const [state, formAction] = useFormState(updateUserInfo, {
    name: user.name,
    email: user.email,
    availableForAcquisition: user.availableForAcquisition,
    acquisitionOffer: user.acquisitionOffer,
  })
  const status = useFormStatus()

  const listEmployee = async () => {
    await updateUserProfile(user.id, {
      availableForAcquisition: !user.availableForAcquisition,
    })
  }

  const options = ['Requesting', 'Offering']

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState: any, optimisticValue: any) => [
      currentState,
      optimisticValue,
      // merge and return new state
      // with optimistic value
    ]
  )
  const ref = useRef(null)
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
        <input type="hidden" name="orgId" value={org} id="orgId" />
        <input type="hidden" name="id" value={user.id} id="id" />
        <div className="px-4 sm:px-0 flex">
          {/* <EditUserModal open={open} setOpen={setOpen} user={user} /> */}
          {user.profileImage ? (
            <Image src={user.profileImage} height={96} width={96} alt="" />
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
            <p className="mt-1 max-w-2xl  leading-6 text-gray-500 text-lg">
              {user.role}
            </p>
            <div className="flex items-center mt-4 hover:cursor-pointer">
              <div className="flex text-indigo-600 hover:text-indigo-500 mr-4">
                <ArrowDownTrayIcon className="h-5 w-5  " aria-hidden="true" />
                <div className="ml-2 flex min-w-0 flex-1 gap-2">
                  <a className="font-medium " href={user.resume}>
                    {user.firstName} {user.lastName}'s resume
                  </a>
                </div>
              </div>
            </div>
          </div>
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
                  className=" rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
                    placeholder={user.email}
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
                Acquisition Offer
              </dt>
              {user.acquisitionOffer && !isEditing ? (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user.company.name} is{' '}
                    <strong>{user.acquisitionOffer.offerType}</strong> $
                    {`${user.acquisitionOffer.amount}`} for the acquisition of{' '}
                    {user.firstName} {user.lastName}
                  </span>
                </dd>
              ) : isEditing ? (
                <div className="flex items-center w-full">
                  {/* <SelectDropdown
                    options={options}
                    id={'offerType'}
                    name={'offerType'}
                    className={undefined}
                  /> */}
                  <select name="offerType" id="offerType">
                    {options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <span className="ml-4">
                    $
                    <input
                      type="number"
                      name="offerAmount"
                      id="offerAmount"
                      className="ml-1 w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="10,000"
                    />
                  </span>
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user.company.name} has not yet created an offer for{' '}
                    {user.firstName} {user.lastName}
                    's acquisition
                  </span>
                </dd>
              )}
              {/* {isEditing ? (
                <div className="flex items-center w-full">
                  <SelectDropdown
                    options={options}
                    id={'offerType'}
                    name={'offerType'}
                  />
                  <span className="ml-4">
                    $
                    <input
                      type="number"
                      name="offerAmount"
                      id="offerAmount"
                      className="ml-1 w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="10,000"
                    />
                  </span>
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    {user.company.name} is{' '}
                    <strong>{user.acquisitionOffer.offerType}</strong> $
                    {`${user.acquisitionOffer.amount}`} for the acquisition of{' '}
                    {user.name}
                  </span>
                </dd>
              )} */}
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Employee Contributions
              </dt>
              {isEditing ? (
                <div>
                  <textarea
                    name="projects"
                    id="projects"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu."
                  />
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                    incididunt cillum culpa consequat. Excepteur qui ipsum
                    aliquip consequat sint. Sit id mollit nulla mollit nostrud
                    in ea officia proident. Irure nostrud pariatur mollit ad
                    adipisicing reprehenderit deserunt qui eu.
                  </span>
                </dd>
              )}
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Referral Message
              </dt>
              {isEditing ? (
                <div>
                  <textarea
                    name="referral"
                    id="referral"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu."
                  />
                </div>
              ) : (
                <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span className="flex-grow">
                    Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                    incididunt cillum culpa consequat. Excepteur qui ipsum
                    aliquip consequat sint. Sit id mollit nulla mollit nostrud
                    in ea officia proident. Irure nostrud pariatur mollit ad
                    adipisicing reprehenderit deserunt qui eu.
                  </span>
                </dd>
              )}
            </div>
          </dl>
        </div>
      </form>
      {!isOnMarketplace && (
        <div className="flex justify-end mt-6 mb-8">
          <button
            type="button"
            disabled={user.acquisitionOffer === null}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
            onClick={listEmployee}
          >
            {user.availableForAcquisition
              ? 'Unlist from Marketplace'
              : 'List on Marketplace'}
          </button>
        </div>
      )}
    </>
  )
}

export default UserProfile
