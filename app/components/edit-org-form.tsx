'use client'
import {
  PhotoIcon,
  UserCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid'
import EmployeeModalList from './employee-modal-list'
import SelectDropdown from './select-dropdown'
import { updateOrgInfo } from '@/utils/actions'
import { useFormState, useFormStatus } from 'react-dom'
import React, { useState, useOptimistic, useRef } from 'react'
import OrgTeamList from './org-team-list'
import { useRouter } from 'next/navigation'
import AddEmployeeModal from './add-employee-modal'
import AddTeamModal from './add-team-modal'

export default function EditOrgForm({
  org,
  saveTeam,
  cancelSave,
  teamData,
}: {
  org: any
  saveTeam: any
  cancelSave: any
  teamData: any
}) {
  const [state, formAction] = useFormState(updateOrgInfo, {
    name: org.name,
    website: org.website,
  })
  const status = useFormStatus()
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
  const router = useRouter()
  const [openAddEmployee, setOpenAddEmployee] = useState(false)
  const [openAddTeam, setOpenAddTeam] = useState(false)

  return (
    <form
      action={async (formData) => {
        addOptimistic(formData)
        await formAction(formData)
        setTimeout(() => router.push(`/org/${org.id}`), 1000)
      }}
      // ref={ref}
    >
      <AddEmployeeModal
        open={openAddEmployee}
        setOpen={setOpenAddEmployee}
        teamData={teamData}
        orgData={org}
      />
      <AddTeamModal
        open={openAddTeam}
        setOpen={setOpenAddTeam}
        teamData={teamData}
      />
      <input hidden name="id" value={org.id} />
      <div className="h-24 flex items-center justify-end gap-x-6 sticky top-6 backdrop-blur-sm mt-0">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.push(`/org/${org.id}`)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Company Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your company information.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Logo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon
                  className="h-16 w-16 text-gray-300"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="nameame"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={org.name}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="website"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Website
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    http://
                  </span>
                  <input
                    type="text"
                    name="website"
                    id="website"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder={org.website}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 mt-6">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Employees{' '}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Add or remove members from your organization{' '}
            </p>
            <div className="flex  w-full col-start-3 mt-4">
              <button
                className="text-indigo-600 hover:underline"
                onClick={() => setOpenAddEmployee(true)}
                type="button"
              >
                + Add new employee
              </button>
            </div>
          </div>

          <div className=" max-w-2xl gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <EmployeeModalList teamData={teamData} org={org} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 mt-6">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Teams{' '}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit teams within your organization{' '}
            </p>
            <div className="flex  w-full col-start-3 mt-4">
              <button
                className="text-indigo-600 hover:underline"
                type="button"
                onClick={() => setOpenAddTeam(true)}
              >
                + Add new team
              </button>
            </div>
          </div>

          <div className=" max-w-2xl gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <OrgTeamList teamData={teamData} org={org} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Industry
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              What industry does your company primarily operate in?
            </p>
          </div>

          <div className="mt-2">
            <SelectDropdown options={[]} />
          </div>
        </div>
      </div>
    </form>
  )
}
