import { UserButton } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  )
}

export default DashboardLayout
