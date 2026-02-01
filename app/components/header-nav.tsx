'use client'
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface HeaderNavProps {
  children: React.ReactNode
  orgData: {
    id: string
    name: string
    logo?: string | null
  } | null
  user: {
    firstName?: string | null
    lastName?: string | null
    profileImage?: string | null
  } | null
  unreadMessageCount?: number
}

export default function HeaderNav({ children, orgData, user, unreadMessageCount = 0 }: HeaderNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const orgId = orgData?.id || ''
  const orgName = orgData?.name || 'Organization'

  const navigation = [
    { name: 'Dashboard', href: `/org/${orgId}` },
    { name: 'Jobs', href: `/org/${orgId}/jobs` },
    { name: 'Find Talent', href: '/marketplace' },
    { name: 'Messages', href: `/org/${orgId}/inbox`, badge: unreadMessageCount > 0 ? unreadMessageCount : undefined },
  ]

  const isActive = (href: string) => {
    if (href === `/org/${orgId}`) {
      return pathname === href || pathname === `${href}/edit`
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded"
                />
              </Link>

              {/* Navigation */}
              <div className="hidden md:flex md:items-center md:ml-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    className={clsx(
                      'relative px-4 py-4 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    )}
                  >
                    <span className="flex items-center gap-x-2">
                      {item.name}
                      {item.badge && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Search, Settings, Profile */}
            <div className="flex items-center gap-x-3">
              <button
                type="button"
                className="hidden md:flex p-2 text-gray-400 hover:text-gray-500"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="hidden md:flex p-2 text-gray-400 hover:text-gray-500"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>

              <div className="hidden md:flex items-center gap-x-3 pl-3 border-l border-gray-200">
                <UserButton afterSignOutUrl="/" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{orgName}</p>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium',
                      isActive(item.href)
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {item.name}
                    {item.badge && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-x-3 px-3">
                <UserButton afterSignOutUrl="/" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{orgName}</p>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content - Full width for marketplace and jobs pages */}
      <main className={clsx(
        pathname.startsWith('/marketplace') || pathname.includes('/jobs')
          ? ''
          : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'
      )}>
        {children}
      </main>
    </div>
  )
}
