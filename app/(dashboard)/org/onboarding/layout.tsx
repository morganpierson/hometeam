import { UserButton } from '@clerk/nextjs'
import { ReactNode } from 'react'

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  )
}

export default DashboardLayout
