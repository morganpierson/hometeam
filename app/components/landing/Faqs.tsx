import Image from 'next/image'

import { Container } from '@/app/components/landing/Container'
import backgroundImage from '@/app/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'How does automatic performance tracking work?',
      answer:
        'We use AI to track your employees performance and contributions over the course of their employment. It’s like having a digital manager.',
    },
    {
      question: 'How does your solution help companies attract top talent?',
      answer:
        "Think of it like employment insurance. An employee is much more likely to join a company if they know that company will invest in that employee's future even after it's time to say goodbye.",
    },
    {
      question: 'How do I get early access to top talent?',
      answer:
        'Companies list their soon-to-be-furloughed employees on our platform. In doing so, employee profiles become available for your review before they hit the job boards.',
    },
  ],
  [
    {
      question: 'How does "Try Before You Buy" work?',
      answer:
        'Companies are incentivized to pay you to take their furloughed employees off their hands. It keeps their unemployment tax rate low and their reputation high. You should consider it for your next RIF.',
    },
    {
      question: 'How does incentivized employee acquisition work?',
      answer:
        'Companies take part of their employee severance package, and apply that to an acquisition offer. For example, a company that would otherwise pay 3 months severance can use part of money to pay you to try out their employee. It is a win-win.',
    },
    {
      question:
        'Why on earth would a company pay me to take their furloughed employees?',
      answer:
        'Maintain and grow a solid reputation with past, present and future employees, keep unemployment tax rates low, attract top talent. These are just a few reasons.',
    },
  ],
  [
    {
      question: 'Can I create my own acquisition terms?',
      answer:
        "Of course. We leave it up to the companies to find a suitable agreement. We're just here to help facilitate the process.",
    },
    {
      question: 'Do you take a cut of the acquisition?',
      answer:
        "Nope. We take zero commission on any acquisition. We're just here to help you find the right fit for your team.",
    },
    {
      question: 'Do you offer a free trial?',
      answer:
        "We offer you unlimited access to the Talented platform until you make your first acquisition offer. We're confident you'll love it.",
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto flex  flex-col justify-center lg:mx-0">
          <h2
            id="faq-title"
            className="text-center font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-center text-lg tracking-tight text-slate-700">
            If you can&apos;t find what you&apos;re looking for, email our team and we&apos;ll
            get back to you ASAP.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
