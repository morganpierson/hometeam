import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import SideBarNav from '@/app/components/side-bar-nav'
import { fetchOrgData } from '@/utils/actions'
import { getUserByClerkID } from '@/utils/auth'
const navigation = [
  { name: 'Inbox', href: '#', icon: HomeIcon, current: true },
  { name: 'Team Org', href: '/org/hometeam', icon: UsersIcon, current: false },
  { name: 'Team Projects', href: '#', icon: CalendarIcon, current: false },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: FolderIcon,
    current: false,
  },

  //   { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  //   { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
// const teams = [
//   { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
//   { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
//   { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
// ]
const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default async function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('LAYOUT RENDEREDDD')
  // const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = await getUserByClerkID()
  const orgData = await fetchOrgData()

  console.log('LAYOUT ORG DATA', orgData)

  return (
    <>
      <SideBarNav children={children} orgData={orgData} user={user} />
    </>
  )
}
