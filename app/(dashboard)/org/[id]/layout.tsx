import { UserButton } from '@clerk/nextjs'
import { ReactNode } from 'react'

const OrgPageLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-[15%_85%] grid-rows-[5%_95%] h-screen">
      <header className="col-span-2 row-span-1 border-b border-black/30 flex justify-end items-center bg-bg_primary">
        <div className="px-6 ">
          <UserButton />
        </div>
      </header>
      <aside className="border-r border-black/30 col-span-1 col-start-1 bg-bg_primary">
        hometeam
      </aside>
      <div className="col-start-2">{children}</div>
    </div>
  )
}

export default OrgPageLayout
