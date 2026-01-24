import { Container } from '@/app/components/landing/Container'

const benefits = [
  {
    name: 'Reduce hiring time by 70%',
    description:
      'Skip the job boards and recruiting agencies. Access pre-vetted talent ready to work, with verified credentials and work history.',
    icon: ClockIcon,
  },
  {
    name: 'Showcase your best work',
    description:
      'Build a company portfolio that wins clients. Every completed project becomes a testimonial for your next bid.',
    icon: PhotoIcon,
  },
  {
    name: 'Manage your crew in one place',
    description:
      'Track certifications, licenses, and availability. Know who\'s ready to deploy before your next project kicks off.',
    icon: UsersIcon,
  },
  {
    name: 'Verify credentials instantly',
    description:
      'Background checks, insurance verification, and license validation—all handled automatically.',
    icon: ShieldIcon,
  },
  {
    name: 'Flexible hiring options',
    description:
      'Hire full-time, bring on for a project, or try before you commit. Find the arrangement that works for your business.',
    icon: AdjustmentsIcon,
  },
  {
    name: 'Grow your network',
    description:
      'Connect with other contractors for referrals, subcontracting opportunities, and industry insights.',
    icon: NetworkIcon,
  },
]

function ClockIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PhotoIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UsersIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 21v-2a3 3 0 00-3-3h-1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ShieldIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3l8 4v5c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V7l8-4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AdjustmentsIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function NetworkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v4M12 11l-5.5 6M12 11l5.5 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function EmployerBenefits() {
  return (
    <section id="benefits" aria-label="Benefits for contractors" className="py-20 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Why contractors choose us
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Built by contractors, for contractors. We understand what it takes to run a successful trade business.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  {benefit.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">
                  {benefit.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
