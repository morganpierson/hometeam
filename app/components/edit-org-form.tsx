'use client'
import {
  UserCircleIcon,
} from '@heroicons/react/24/solid'
import EmployeeModalList from './employee-modal-list'
import SelectDropdown from './select-dropdown'
import { updateEmployerInfo } from '@/utils/actions'
import { useFormState, useFormStatus } from 'react-dom'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AddEmployeeModal from './add-employee-modal'
import UploadImage from './upload-image'
import { TradeCategory } from '@prisma/client'

interface Employee {
  id: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  tradeCategory?: TradeCategory | null
}

interface Employer {
  id: string
  name: string
  website?: string | null
  logo?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  isInsured?: boolean
  isLicensed?: boolean
  licenseNumber?: string | null
  specialties?: TradeCategory[]
  employees: Employee[]
}

interface EditOrgFormProps {
  org: Employer
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}

export default function EditOrgForm({ org }: EditOrgFormProps) {
  const [state, formAction] = useFormState(updateEmployerInfo, {
    success: false,
  })
  const ref = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [openAddEmployee, setOpenAddEmployee] = useState(false)

  const tradeCategoryOptions = Object.values(TradeCategory)

  // Handle successful save - redirect to org page
  useEffect(() => {
    if (state.success) {
      router.push(`/org/${org.id}`)
      router.refresh()
    }
  }, [state.success, org.id, router])

  return (
    <form ref={ref} action={formAction}>
      <AddEmployeeModal
        open={openAddEmployee}
        setOpen={setOpenAddEmployee}
        orgData={org}
      />
      <input type="hidden" name="id" value={org.id} />
      <div className="h-24 flex items-center justify-end gap-x-6 sticky top-6 backdrop-blur-sm mt-0">
        {state.error && (
          <div className="text-sm text-red-600">{state.error}</div>
        )}
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.push(`/org/${org.id}`)}
        >
          Cancel
        </button>
        <SubmitButton />
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
              <UploadImage uploadText={'Upload'} id={'logo'} name={'logo'} />
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
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
                    defaultValue={org.name}
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
                    placeholder={org.website || 'www.example.com'}
                    defaultValue={org.website || ''}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Contact Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="contact@example.com"
                  defaultValue={org.contactEmail || ''}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="contactPhone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Contact Phone
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="contactPhone"
                  id="contactPhone"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="(555) 123-4567"
                  defaultValue={org.contactPhone || ''}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 mt-6">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Location
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Your business address
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street Address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="123 Main St"
                  defaultValue={org.address || ''}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Austin"
                  defaultValue={org.city || ''}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                State
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="state"
                  id="state"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="TX"
                  defaultValue={org.state || ''}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="78701"
                  defaultValue={org.zipCode || ''}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3 mt-6">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Employees
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Add or remove members from your organization
            </p>
            <div className="flex w-full col-start-3 mt-4">
              <button
                className="text-indigo-600 hover:underline"
                onClick={() => setOpenAddEmployee(true)}
                type="button"
              >
                + Add new employee
              </button>
            </div>
          </div>

          <div className="max-w-2xl gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <EmployeeModalList org={org} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Trade Specialties
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              What trades does your company specialize in?
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="col-span-full">
              <div className="mt-2 grid grid-cols-2 gap-2">
                {tradeCategoryOptions.map((trade) => (
                  <label key={trade} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="specialties"
                      value={trade}
                      defaultChecked={org.specialties?.includes(trade)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm text-gray-700">
                      {trade.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Verification
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Insurance and licensing information
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isInsured"
                  defaultChecked={org.isInsured}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-gray-900">Insured</span>
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isLicensed"
                  defaultChecked={org.isLicensed}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm font-medium text-gray-900">Licensed</span>
              </label>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                License Number
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="licenseNumber"
                  id="licenseNumber"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="License #"
                  defaultValue={org.licenseNumber || ''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
