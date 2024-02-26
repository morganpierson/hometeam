'use client'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { deleteUserProfile } from '@/utils/api'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function EmployeeModalList({ teamData, org }) {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-scroll max-h-80"
    >
      {teamData.map((team) => (
        <li
          key={team.email}
          className="flex justify-between gap-x-6 py-5 items-center"
        >
          <div className="flex min-w-0 gap-x-4 items-center">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={team.logo || ''}
              alt=""
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={team.href || ''} className="hover:underline">
                  {team.name}
                </a>
              </p>
              {/* <p className="mt-1 flex text-xs leading-5 text-gray-500">
                <a
                  href={`mailto:${team.email}`}
                  className="truncate hover:underline"
                >
                  {team.email}
                </a>
              </p> */}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-6">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{team.role}</p>
              {team.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen{' '}
                  <time dateTime={team.lastSeenDateTime}>{team.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-2">
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
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>

                  <p className="text-xs leading-5 text-gray-500">
                    {team.members.length} members
                  </p>
                </div>
              )}
            </div>
            <Menu as="div" className="relative flex-none">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  {/* <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                        onClick={() => deleteUserProfile(team.id, org.id)}
                      >
                        Delete
                        <span className="sr-only">, {team.name}</span>
                      </button>
                    )}
                  </Menu.Item> */}
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`/org/user/${team.id}`}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Edit<span className="sr-only">, {team.name}</span>
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  )
}
