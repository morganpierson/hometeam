'use client'
import {
  UserCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/solid'
import { type PutBlobResult } from '@vercel/blob'
import { useState, useRef, useOptimistic } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createNewEmployee } from '@/utils/actions'
import { TradeCategory } from '@prisma/client'

interface NewEmployeeFormProps {
  orgData: {
    id: string
    name: string
  }
  open?: boolean
  setOpen?: (open: boolean) => void
}

export default function NewEmployeeForm({ orgData, open, setOpen }: NewEmployeeFormProps) {
  const [state, formAction] = useFormState(createNewEmployee, {
    success: false,
  })

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (currentState: any, optimisticValue: any) => [
      currentState,
      optimisticValue,
    ]
  )

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setResume(e.target.files[0])
    }
  }

  const cancelButtonRef = useRef(null)
  const ref = useRef(null)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [blob, setBlob] = useState<PutBlobResult | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [resume, setResume] = useState<File | null>(null)

  const tradeCategoryOptions = Object.values(TradeCategory)

  return (
    <form action={formAction}>
      <input type="hidden" name="employerId" value={orgData.id} />
      <div className="space-y-12 flex justify-start text-left px-4">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            New Employee
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a new trade worker profile
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium leading-6 text-gray-900 text-left"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {image ? (
                  <img src={image} className="h-16 w-16 rounded-full" alt="Profile preview" />
                ) : (
                  <UserCircleIcon
                    className="h-16 w-16 text-gray-300"
                    aria-hidden="true"
                  />
                )}
                <label
                  htmlFor="profileImage"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none hover:text-indigo-500"
                >
                  <span>Upload</span>
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="resume"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Resume
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6">
                <div className="text-center">
                  {resume ? (
                    <span className="font-bold">{resume.name}</span>
                  ) : (
                    <ArrowDownTrayIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        className="sr-only"
                        onChange={handleResumeChange}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PDF, DOC, DOCX, or TXT
                  </p>
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="firstName"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="John"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="lastName"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="phone"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Phone
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="tradeCategory"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Trade Category
              </label>
              <div className="mt-2">
                <select
                  name="tradeCategory"
                  id="tradeCategory"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a trade</option>
                  {tradeCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="yearsExperience"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Years of Experience
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="yearsExperience"
                  id="yearsExperience"
                  min="0"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="5"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Hourly Rate ($)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="hourlyRate"
                  id="hourlyRate"
                  min="0"
                  step="0.01"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="50.00"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="location"
                className="text-left block text-sm font-medium leading-6 text-gray-900"
              >
                Location
              </label>
              <div className="mt-2">
                <input
                  id="location"
                  name="location"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  type="text"
                  placeholder="Austin, TX"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          type="button"
          className="mt-3 inline-flex w-6/12 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          ref={cancelButtonRef}
          onClick={() => setOpen && setOpen(false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex w-6/12 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
        >
          Create Employee
        </button>
      </div>
    </form>
  )
}
