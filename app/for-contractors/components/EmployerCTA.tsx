import Image from 'next/image'

import { Button } from '@/app/components/landing/Button'
import { Container } from '@/app/components/landing/Container'
import backgroundImage from '@/app/images/background-call-to-action.jpg'

export function EmployerCTA() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-amber-500 py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Ready to build your A-team?
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Join hundreds of contractors who are finding top talent faster and building
            stronger teams. Get started in minutes.
          </p>
          <Button href="/sign-up?role=employer" color="white" className="mt-10">
            Start hiring for free
          </Button>
        </div>
      </Container>
    </section>
  )
}
