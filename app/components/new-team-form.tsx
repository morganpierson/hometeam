'use client'
import {
  PhotoIcon,
  UserCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/solid'
import SelectDropdown from './select-dropdown'
import { type PutBlobResult } from '@vercel/blob'
import { upload } from '@vercel/blob/client'
import { useState, useRef, useOptimistic } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createNewTeam, createNewUser } from '@/utils/actions'
import EmployeeModalList from './employee-modal-list'

export default function NewEmployeeForm({ teamData, orgData, open, setOpen }) {
  const [state, formAction] = useFormState(createNewUser, {
    name: '',
    logo: '',
    members: [],
  })
  const status = useFormStatus(formAction)
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
  const cancelButtonRef = useRef(null)
  const ref = useRef(null)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)
  const [image, setImage] = useState<string | null>(null)

  function handleImageChange(e: any) {
    console.log(e.target.files)
    setImage(URL.createObjectURL(e.target.files[0]))
  }
  console.log('STATUS', status)
  return (
    <form action={createNewTeam}>
      <input type="hidden" name="orgId" value={orgData.id} />
      <div className="space-y-12 text-left px-4">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            New Team
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a new team
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="teamLogo"
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Team Logo
              </label>

              <div className="mt-2 flex items-center gap-x-3">
                {image ? (
                  <img src={image} className="h-16 w-16 rounded-full" />
                ) : (
                  <UserCircleIcon
                    className="h-16 w-16 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <label
                  htmlFor="teamLogo"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
                >
                  <div>
                    <span>Upload</span>
                    <input
                      id="teamLogo"
                      name="teamLogo"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                    <span className="font-thin text-sm flex text-gray-600">
                      up to 3mb
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="teamName"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Team Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="teamName"
                    id="teamName"
                    autoComplete="teamName"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Product, Engineering, Sales, etc."
                    required
                  />
                </div>
              </div>
            </div>

            {/* <div className="col-span-full">
              <label
                htmlFor="role"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
              <div className="mt-2">
                <input
                  id="role"
                  name="role"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  placeholder="e.g. Product Manager, Solutions Architect, etc."
                  required
                />
              </div>
            </div> */}
            {/* <div className="col-span-full w-full">
              <label
                htmlFor="team"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Team Members
              </label>
              <div className="mt-2">
                <EmployeeModalList org={orgData} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          className="mt-3 inline-flex w-6/12 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          ref={cancelButtonRef}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex w-6/12 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          Create Team
        </button>
      </div>
    </form>
  )
}
