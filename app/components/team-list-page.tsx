'use client'

import Link from 'next/link'
import UserCard from './user-card'
import { useState } from 'react'
import { PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import avatar1 from '@/public/avatar_1.svg'
import avatar2 from '@/public/avatar_2.svg'
import avatar3 from '@/public/avatar_3.svg'
import avatar4 from '@/public/avatar_4.svg'
import AddEmployeeModal from './add-employee-modal'
import Image from 'next/image'
import { TradeCategory, ProjectStatus } from '@prisma/client'

const placeholderAvatars = [avatar1, avatar2, avatar3, avatar4]

interface Employee {
  id: string
  firstName?: string | null
  lastName?: string | null
  profileImage?: string | null
  tradeCategory?: TradeCategory | null
}

interface Project {
  id: string
  title: string
  status: ProjectStatus
  client: {
    companyName?: string | null
    contactName?: string | null
  }
  employees: Employee[]
}

interface Employer {
  id: string
  name: string
  logo?: string | null
  employees: Employee[]
}

interface TeamListPageProps {
  projectData?: Project[]
  orgData: Employer
}

const TeamListPage = ({ projectData = [], orgData }: TeamListPageProps) => {
  const [open, setOpen] = useState(false)

  // Group employees by trade category
  const employeesByTrade = orgData.employees.reduce((acc, employee) => {
    const category = employee.tradeCategory || 'UNASSIGNED'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(employee)
    return acc
  }, {} as Record<string, Employee[]>)

  return (
    <div className="ml-12 mt-12">
      <AddEmployeeModal
        orgData={orgData}
        open={open}
        setOpen={setOpen}
      />
      <header className="flex gap-4 items-center justify-between font-sans">
        <h1 className="text-3xl tracking-widest font-semibold font-sans flex items-center gap-4">
          {orgData.logo ? (
            <Image
              src={orgData.logo}
              height={80}
              width={80}
              alt={`${orgData.name} logo`}
              className="rounded-full min-h-20 min-w-20"
            />
          ) : (
            <UserCircleIcon
              className="h-24 w-24 text-gray-300"
              aria-hidden="true"
            />
          )}
          {orgData.name.toUpperCase()}
        </h1>
        <a
          href={`/org/${orgData.id}/edit`}
          className="text-indigo-600 hover:underline hover:text-indigo-500 flex gap-1 items-center mr-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Edit {orgData.name}
        </a>
      </header>

      {/* Employees grouped by trade */}
      <div className="ml-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6">Employees</h2>
        {Object.entries(employeesByTrade).map(([tradeCategory, employees], index) => (
          <div key={tradeCategory} className="mb-8">
            <h3 className="text-xl mt-4 tracking-widest font-medium flex items-center gap-2">
              {tradeCategory === 'UNASSIGNED' ? 'Unassigned' : tradeCategory.replace('_', ' ')}
              <span className="text-sm text-gray-500">({employees.length})</span>
            </h3>

            <div className="flex items-center flex-wrap gap-2 mt-4">
              {employees.map((employee, empIndex) => (
                <Link key={employee.id} href={`/org/user/${employee.id}`}>
                  <UserCard
                    teamMember={employee}
                    placeholderImage={placeholderAvatars[(index + empIndex) % placeholderAvatars.length]}
                  />
                </Link>
              ))}
              <button
                type="button"
                className="rounded-full bg-white border border-indigo-600 text-indigo-600 p-2 shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setOpen(true)}
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        {Object.keys(employeesByTrade).length === 0 && (
          <div className="text-gray-500 py-8">
            <p>No employees yet.</p>
            <button
              type="button"
              className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              onClick={() => setOpen(true)}
            >
              Add your first employee
            </button>
          </div>
        )}
      </div>

      {/* Active Projects Section */}
      {projectData && projectData.length > 0 && (
        <div className="ml-6 mt-12">
          <h2 className="text-2xl font-semibold mb-6">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectData.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-sm text-gray-500">
                  Client: {project.client.companyName || project.client.contactName || 'Unknown'}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                    project.status === 'IN_PROGRESS'
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                      : project.status === 'COMPLETED'
                      ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                      : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-3 flex -space-x-2">
                  {project.employees.slice(0, 4).map((employee, idx) => (
                    <div key={employee.id} className="relative">
                      {employee.profileImage ? (
                        <Image
                          src={employee.profileImage}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full ring-2 ring-white"
                        />
                      ) : (
                        <Image
                          src={placeholderAvatars[idx % placeholderAvatars.length]}
                          alt=""
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full ring-2 ring-white"
                        />
                      )}
                    </div>
                  ))}
                  {project.employees.length > 4 && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500 ring-2 ring-white">
                      +{project.employees.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamListPage
