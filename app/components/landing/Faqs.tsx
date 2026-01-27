import Image from 'next/image'

import { Container } from '@/app/components/landing/Container'
import backgroundImage from '@/app/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'How do I find qualified trade professionals?',
      answer:
        'Browse our marketplace of verified electricians, plumbers, HVAC technicians, and other skilled tradespeople. Filter by trade, experience, location, and availability to find the perfect match for your team.',
    },
    {
      question: 'How does the resume parsing work?',
      answer:
        'When candidates upload their resume, our AI automatically extracts their work history, skills, and experience to create a professional profile. This saves time and ensures accurate, consistent profiles across the platform.',
    },
    {
      question: 'Can I message candidates directly?',
      answer:
        'Yes! Once you find a candidate you like, you can send them a message directly through the platform. All conversations are kept in one place, making it easy to manage your recruiting pipeline.',
    },
  ],
  [
    {
      question: 'How do I create a profile as a tradesperson?',
      answer:
        'Sign up, select your trade category, and upload your resume. Our system will automatically parse your experience and create a professional profile. You can also add certifications, set your hourly rate, and indicate your availability.',
    },
    {
      question: 'Is my information visible to all employers?',
      answer:
        'You control your visibility. Toggle your profile on or off at any time. When visible, employers can find you in the marketplace and reach out about opportunities that match your skills.',
    },
    {
      question: 'How do job recommendations work?',
      answer:
        'We match you with jobs based on your trade category, experience level, location preferences, and the information in your profile. The more complete your profile, the better your matches.',
    },
  ],
  [
    {
      question: 'What trades are supported on the platform?',
      answer:
        'We support electricians, plumbers, HVAC technicians, carpenters, roofers, painters, masons, welders, general contractors, landscapers, concrete specialists, drywall installers, and many more skilled trades.',
    },
    {
      question: 'Is there a cost to use the platform?',
      answer:
        'Creating a profile and browsing opportunities is free for tradespeople. Contractors can post jobs and browse talent with our flexible pricing plans designed for businesses of all sizes.',
    },
    {
      question: 'How do I post a job opening?',
      answer:
        'As a contractor, navigate to your dashboard and click "Post a Job." Fill in the details including trade category, requirements, location, and compensation. Your posting will be visible to qualified candidates immediately.',
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
