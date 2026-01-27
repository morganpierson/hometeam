import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/utils/db'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CheckCircleIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import ResumeUpload from '../components/resume-upload'
import ResumeSummary from '../components/resume-summary'

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

export default async function CandidateDashboard() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const employee = await prisma.employee.findUnique({
    where: { clerkId: userId },
    include: {
      conversations: {
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          employers: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
        },
      },
      workExperiences: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  })

  if (!employee) {
    redirect('/new-user')
  }

  const fullName = [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Candidate'
  const tradeLabel = employee.tradeCategory
    ? tradeCategoryLabels[employee.tradeCategory]
    : 'Trade Professional'

  // Count unread messages (messages not sent by this employee)
  const unreadCount = employee.conversations.reduce((count, conv) => {
    const lastMessage = conv.messages[0]
    if (lastMessage && lastMessage.senderId !== employee.id && !lastMessage.readAt) {
      return count + 1
    }
    return count
  }, 0)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center gap-4">
        {employee.profileImage ? (
          <Image
            src={employee.profileImage}
            alt={fullName}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
            <UserCircleIcon className="h-10 w-10 text-amber-600" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {employee.firstName || 'there'}!
          </h1>
          <p className="text-gray-500">{tradeLabel}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Messages Card */}
        <Link
          href="/dashboard/inbox"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-amber-200 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{employee.conversations.length}</p>
                <p className="text-sm text-gray-500">Messages</p>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                {unreadCount} new
              </span>
            )}
          </div>
        </Link>

        {/* Profile Status Card */}
        <Link
          href="/dashboard/profile"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-amber-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Active</p>
              <p className="text-sm text-gray-500">Visible to employers</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Profile Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
          <Link
            href="/dashboard/profile"
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">
              {employee.yearsExperience
                ? `${employee.yearsExperience} years experience`
                : 'Experience not set'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">{employee.location || 'Location not set'}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">
              {employee.hourlyRate
                ? `$${Number(employee.hourlyRate)}/hour`
                : 'Rate not set'}
            </span>
          </div>
        </div>

        {employee.bio && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{employee.bio}</p>
          </div>
        )}
      </div>

      {/* Resume Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ResumeUpload />
        </div>
        <div className="lg:col-span-2">
          <ResumeSummary
            employee={{
              firstName: employee.firstName,
              lastName: employee.lastName,
              profileImage: employee.profileImage,
              yearsExperience: employee.yearsExperience,
              location: employee.location,
              isAvailableForHire: employee.isAvailableForHire,
              resume: employee.resume,
              resumeSummary: employee.resumeSummary,
              lookingFor: employee.lookingFor,
            }}
            workExperiences={employee.workExperiences}
          />
        </div>
      </div>

      {/* Recent Messages */}
      {employee.conversations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
            <Link
              href="/dashboard/inbox"
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {employee.conversations.slice(0, 3).map((conversation) => {
              const employer = conversation.employers[0]
              const lastMessage = conversation.messages[0]
              const isUnread = lastMessage && lastMessage.senderId !== employee.id && !lastMessage.readAt

              return (
                <Link
                  key={conversation.id}
                  href={`/dashboard/inbox/${conversation.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {employer?.logo ? (
                    <Image
                      src={employer.logo}
                      alt={employer.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}`}>
                      {employer?.name || 'Unknown Company'}
                    </p>
                    {lastMessage && (
                      <p className={`text-sm truncate ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                  {isUnread && (
                    <span className="h-2 w-2 bg-amber-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {employee.conversations.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Your profile is visible to employers. When they reach out, their messages will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
