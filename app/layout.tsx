import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Skilled Trades Marketplace',
    default: 'Skilled Trades Marketplace - Find talented tradespeople',
  },
  description:
    'Connect with skilled tradespeople and find the talent you need for your projects.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={clsx(
          'h-full scroll-smooth bg-white antialiased',
          inter.variable,
          lexend.variable,
        )}
      >
        <body className="flex h-full flex-col">{children}</body>
      </html>
    </ClerkProvider>
  )
}
