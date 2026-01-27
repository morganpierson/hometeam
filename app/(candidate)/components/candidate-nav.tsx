'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import clsx from 'clsx'

interface CandidateNavProps {
  employee: {
    id: string
    firstName: string | null
    lastName: string | null
    profileImage: string | null
    tradeCategory: string | null
  }
  unreadMessageCount?: number
}

const tradeCategoryLabels: Record<string, string> = {
  ELECTRICIAN: 'Electrician',
  PLUMBER: 'Plumber',
  HVAC: 'HVAC Technician',
  CARPENTER: 'Carpenter',
  ROOFER: 'Roofer',
  PAINTER: 'Painter',
  MASON: 'Mason',
  WELDER: 'Welder',
  GENERAL_CONTRACTOR: 'General Contractor',
  LANDSCAPER: 'Landscaper',
  CONCRETE: 'Concrete Specialist',
  DRYWALL: 'Drywall Installer',
  FLOORING: 'Flooring Specialist',
  GLAZIER: 'Glazier',
  INSULATION: 'Insulation Installer',
  IRONWORKER: 'Ironworker',
  SHEET_METAL: 'Sheet Metal Worker',
  TILE_SETTER: 'Tile Setter',
  OTHER: 'Trade Professional',
}

export default function CandidateNav({ employee, unreadMessageCount = 0 }: CandidateNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Find Work', href: '/dashboard/jobs', icon: MagnifyingGlassIcon },
    { name: 'Applied', href: '/dashboard/applied', icon: DocumentTextIcon },
    { name: 'Messages', href: '/dashboard/inbox', icon: ChatBubbleLeftRightIcon, badge: unreadMessageCount > 0 ? unreadMessageCount : undefined },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Candidate'
  const tradeLabel = employee.tradeCategory
    ? tradeCategoryLabels[employee.tradeCategory]
    : 'Trade Professional'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S:</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:ml-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
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
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-x-3">
            <div className="hidden md:flex items-center gap-x-3 pl-3 border-l border-gray-200">
              <UserButton afterSignOutUrl="/" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-500">{tradeLabel}</p>
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium',
                    isActive(item.href)
                      ? 'bg-amber-50 text-amber-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-x-3 px-3">
              <UserButton afterSignOutUrl="/" />
              <div>
                <p className="text-sm font-medium text-gray-900">{fullName}</p>
                <p className="text-xs text-gray-500">{tradeLabel}</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
