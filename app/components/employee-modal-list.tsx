'use client'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { deleteUserProfile } from '@/utils/api'
import avatar1 from '@/public/avatar_1.svg'
import avatar2 from '@/public/avatar_2.svg'
import avatar3 from '@/public/avatar_3.svg'
import avatar4 from '@/public/avatar_4.svg'
import Image from 'next/image'

const placeholderAvatars = [avatar1, avatar2, avatar3, avatar4]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function EmployeeModalList({ teamData, org }) {
  console.log('TEAM DATA', teamData)
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-scroll max-h-80"
    >
      {org.employees.map((person, index) => (
        <li key={person.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <Image
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={
                person.profileImage
                  ? person.profileImage
                  : placeholderAvatars[index]
              }
              alt=""
              width={96}
              height={96}
            />
            <div className="min-w-0 flex-auto">
              <div className="flex gap-1">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <a href={person.href} className="hover:underline">
                    {person.firstName}
                  </a>
                </p>
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  <a href={person.href} className="hover:underline">
                    {person.lastName}
                  </a>
                </p>
              </div>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                <a
                  href={`mailto:${person.email}`}
                  className="truncate hover:underline"
                >
                  {person.email}
                </a>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-6">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{person.role}</p>
              {person.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen{' '}
                  <time dateTime={person.lastSeenDateTime}>
                    {person.lastSeen}
                  </time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
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
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                        onClick={() => deleteUserProfile(person.id, org.id)}
                      >
                        Delete
                        <span className="sr-only">, {person.name}</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`/org/user/${person.id}`}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Edit<span className="sr-only">, {person.name}</span>
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
