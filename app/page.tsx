import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import { prisma } from '@/utils/db'

import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const { userId } = await auth()
  console.log('USER ID ', userId)
  const supabase = createClient()
  const { data: industry } = await supabase.from('industry').select()

  let match
  let userOrg
  if (userId) {
    match = await prisma.user.findUnique({
      where: {
        clerkId: userId as string,
      },
    })
    userOrg = await prisma.company.findFirst({
      where: {
        id: match?.companyId,
      },
    })
  }

  let href = match ? `/org/${userOrg?.name.toLowerCase()}` : '/new-user'

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center ">
      <div>
        <h1>HR APP HOME</h1>
      </div>
      <div>
        <Link href={href}>
          <button className="bg-blue-600 px-4 py-2 rounded-md">
            get started
          </button>
        </Link>
        {/* <pre className="text-white">{JSON.stringify(industry, null, 2)}</pre> */}
      </div>
    </div>
  )
}
