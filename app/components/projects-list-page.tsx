import {
  ChatBubbleLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

import { fetchProjectData } from '@/utils/actions'

const projects = [
  {
    id: 1,
    title: 'Atque perspiciatis et et aut ut porro voluptatem blanditiis?',
    href: '#',
    author: { name: 'Leslie Alexander', href: '#' },
    date: '2d ago',
    dateTime: '2023-01-23T22:34Z',
    status: 'active',
    totalComments: 24,
    commenters: [
      {
        id: 12,
        name: 'Emma Dorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 4,
        name: 'Lindsay Walton',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 16,
        name: 'Benjamin Russel',
        imageUrl:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 23,
        name: 'Hector Gibbons',
        imageUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  },
  {
    id: 2,
    title: 'Et ratione distinctio nesciunt recusandae vel ab?',
    href: '#',
    author: { name: 'Michael Foster', href: '#' },
    date: '2d ago',
    dateTime: '2023-01-23T19:20Z',
    status: 'active',
    totalComments: 6,
    commenters: [
      {
        id: 13,
        name: 'Alicia Bell',
        imageUrl:
          'https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 16,
        name: 'Benjamin Russel',
        imageUrl:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 3,
        name: 'Dries Vincent',
        imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  },
  {
    id: 3,
    title: 'Blanditiis perferendis fugiat optio dolor minus ut?',
    href: '#',
    author: { name: 'Dries Vincent', href: '#' },
    date: '3d ago',
    dateTime: '2023-01-22T12:59Z',
    status: 'resolved',
    totalComments: 22,
    commenters: [
      {
        id: 19,
        name: 'Lawrence Hunter',
        imageUrl:
          'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 21,
        name: 'Angela Fisher',
        imageUrl:
          'https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 14,
        name: 'Jenny Wilson',
        imageUrl:
          'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 16,
        name: 'Benjamin Russel',
        imageUrl:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  },
  {
    id: 4,
    title: 'Voluptatum ducimus voluptatem qui in eum quasi consequatur vel?',
    href: '#',
    author: { name: 'Lindsay Walton', href: '#' },
    date: '5d ago',
    dateTime: '2023-01-20T10:04Z',
    status: 'resolved',
    totalComments: 8,
    commenters: [
      {
        id: 10,
        name: 'Emily Selman',
        imageUrl:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 11,
        name: 'Kristin Watson',
        imageUrl:
          'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  },
  {
    id: 5,
    title: 'Perferendis cum qui inventore ut excepturi nostrum occaecati?',
    href: '#',
    author: { name: 'Courtney Henry', href: '#' },
    date: '5d ago',
    dateTime: '2023-01-20T20:12Z',
    status: 'active',
    totalComments: 15,
    commenters: [
      {
        id: 11,
        name: 'Kristin Watson',
        imageUrl:
          'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 10,
        name: 'Emily Selman',
        imageUrl:
          'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 16,
        name: 'Benjamin Russel',
        imageUrl:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
  },
]

interface Project {
  id: string | number
  title: string
  href?: string
  description?: string
  status?: string
  teams?: Array<{ id: string | number; name: string }>
  users?: Array<{ id: string | number; name?: string; profileImage?: string }>
}

interface ProjectsListPageProps {
  projects: Project[]
}

export default function ProjectsListPage({ projects }: ProjectsListPageProps) {
  return (
    <div className="flex flex-col w-11/12">
      <ul role="list" className="divide-y divide-gray-100 w-11/12">
        {projects.map((project: any) => (
          <li
            key={project.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
          >
            <div>
              <p className="text-sm font-semibold leading-6 text-gray-900 flex items-center ">
                <a
                  href={project.href ? project.href : ''}
                  className="hover:underline"
                >
                  {project.title}
                </a>
                <svg
                  viewBox="0 0 2 2"
                  className="h-0.5 w-0.5 fill-current mx-2"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="flex gap-2">
                  {project.teams?.map((team: { id: string | number; name: string }) => (
                    <p
                      key={team.id}
                      className="text-xs text-gray-500 font-normal"
                    >
                      {team.name}
                    </p>
                  ))}
                </div>
              </p>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p>
                  <a href={''} className="hover:underline">
                    {project.description}
                  </a>
                </p>

                {/* <p>
                <time dateTime={project.dateTime}>{project.date}</time>
              </p> */}
              </div>
            </div>
            <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
              <div className="flex -space-x-0.5">
                <dt className="sr-only">Commenters</dt>
                {project.users?.map((user: { id: string | number; name?: string; profileImage?: string }) => (
                  <dd key={user.id}>
                    <img
                      className={`h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white `}
                      src={user.profileImage}
                      alt={user.name || ''}
                    />
                  </dd>
                ))}
              </div>
              <div className="flex w-16 gap-x-2.5">
                <dt>
                  <span className="sr-only">Total comments</span>
                  {project.status === 'resolved' ? (
                    <CheckCircleIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChatBubbleLeftIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </dt>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div className="flex justify-end mt-6 mb-8 w-11/12">
        <button
          type="button"
          className="rounded-md bg-amber-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        >
          Create Project
        </button>
      </div>
    </div>
  )
}
