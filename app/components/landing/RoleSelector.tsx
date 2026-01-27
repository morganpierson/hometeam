import Link from 'next/link'
import { Container } from './Container'

const roles = [
  {
    name: 'I run a contracting company',
    description: 'Find verified trade talent, manage your crew, and showcase your best work.',
    href: '/for-contractors',
    cta: 'Start hiring',
    icon: BuildingIcon,
    color: 'bg-amber-500',
  },
  {
    name: "I'm a skilled tradesperson",
    description: 'Build your professional profile, find opportunities, and grow your career.',
    href: '/sign-up?redirect_url=/new-user?role=employee',
    cta: 'Find work',
    icon: HardHatIcon,
    color: 'bg-amber-500',
  },
  {
    name: 'I need work done',
    description: 'Post projects, find trusted contractors, and get quality work completed.',
    href: '/for-clients',
    cta: 'Post a project',
    icon: ClipboardIcon,
    color: 'bg-green-600',
    comingSoon: true,
  },
]

function BuildingIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 21h18M5 21V7l8-4v18M13 21V3l6 3v15M9 9v.01M9 12v.01M9 15v.01M9 18v.01M17 9v.01M17 12v.01M17 15v.01M17 18v.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HardHatIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 18h20M4 18v-3a8 8 0 0116 0v3M12 3v4M9 7h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClipboardIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6M9 16h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function RoleSelector() {
  return (
    <section className="py-20 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Choose your path
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Whether you&apos;re hiring, looking for work, or need a project done—we&apos;ve got you covered.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.name}
              className="relative flex flex-col rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              {role.comingSoon && (
                <span className="absolute -top-3 right-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  Coming soon
                </span>
              )}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${role.color}`}>
                <role.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">{role.name}</h3>
              <p className="mt-2 flex-grow text-base text-slate-600">{role.description}</p>
              {role.comingSoon ? (
                <button
                  disabled
                  className="mt-8 block w-full rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-400 cursor-not-allowed"
                >
                  {role.cta}
                </button>
              ) : (
                <Link
                  href={role.href}
                  className={`mt-8 block w-full rounded-lg ${role.color} px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity`}
                >
                  {role.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
