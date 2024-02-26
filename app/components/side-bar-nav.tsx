'use client'
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { fetchOrgData } from '@/utils/actions'
import { UserButton } from '@clerk/nextjs'
import { getUserByClerkID } from '@/utils/auth'
import Link from 'next/link'

const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SideBarNav({ children, orgData, user }) {
  const pathname = usePathname()
  console.log('PATHNAME', pathname)
  // const user = await getUserByClerkID()

  // const orgData = await fetchOrgData()
  console.log('ORG DATA', orgData)

  const navigation = [
    {
      name: 'Inbox',
      href: '/inbox',
      icon: HomeIcon,
      count: '5',
    },
    {
      name: 'Team Org',
      href: `/org/${orgData.id}`,
      icon: UsersIcon,
    },
    {
      name: 'My Candidates',
      href: `/candidates`,
      icon: FolderIcon,
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      icon: BuildingStorefrontIcon,
    },
  ]

  return (
    <div className="grid grid-cols-6 gap-0 ">
      <div className="sticky top-0 col-span-1 flex h-screen flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',

                        {
                          'bg-gray-50 text-indigo-600': pathname.includes(
                            item.href
                          ),
                        }
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.count ? (
                        <span
                          className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                          aria-hidden="true"
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <div className="flex mb-12 items-center justify-start gap-2">
            <UserButton afterSignOutUrl="/" />{' '}
            <p className="font-medium">{user.name}</p>
          </div>
        </nav>
      </div>
      <main className="py-10 col-span-5 px-6">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
