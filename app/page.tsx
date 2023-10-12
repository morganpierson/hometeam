import { auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()

  let href = userId ? '/org' : '/new-user'

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center text-white">
      <div>
        <h1>HR APP HOME</h1>
      </div>
      <div>
        <Link href={href}>
          <button className="bg-blue-600 px-4 py-2 rounded-md">
            get started
          </button>
        </Link>
      </div>
    </div>
  )
}
