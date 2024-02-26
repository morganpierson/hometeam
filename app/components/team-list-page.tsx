'use client'

import Link from 'next/link'
import UserCard from './user-card'
import { useState } from 'react'
import EditTeamModal from './edit-team-modal'
import { PlusIcon } from '@heroicons/react/24/outline'
import avatar1 from '@/public/avatar_1.svg'
import avatar2 from '@/public/avatar_2.svg'
import avatar3 from '@/public/avatar_3.svg'
import avatar4 from '@/public/avatar_4.svg'

const placeholderAvatars = [avatar1, avatar2, avatar3, avatar4]

const TeamListPage = ({ teamData, mockTeamData, orgData }) => {
  const [open, setOpen] = useState(false)
  console.log('TEAM LIST PAGE DATA ', teamData[0].members)
  return (
    <div className="ml-12 mt-12">
      <header className="flex gap-4 items-center justify-between">
        <h1 className="text-3xl font-sans tracking-widest font-semibold">
          {orgData.name.toUpperCase()}
        </h1>
        <a
          href={`/org/${orgData.id}/edit`}
          className="text-indigo-600 hover:underline hover:text-indigo-500  flex gap-1 items-center mr-12"
          // onClick={() => setOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Edit {orgData.name}
        </a>
      </header>

      {/* The function below needs to be optimized to a better time complexity */}
      <div className="ml-6 mt-8">
        {teamData.map((team, index) => {
          return (
            <div key={team.id}>
              <h2
                key={team.id}
                className="text-xl mt-8 tracking-widest font-medium flex items-center gap-2"
              >
                {team.name}
              </h2>

              <div className="flex items-center">
                {team.members.map((member) => (
                  <Link key={member.id} href={`/org/user/${member.id}`}>
                    <UserCard
                      teamMember={member}
                      placeholderImage={placeholderAvatars[index]}
                    />
                  </Link>
                ))}
                <button
                  type="button"
                  className="rounded-full bg-white border border-indigo-600 text-indigo-600 p-2 shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TeamListPage
