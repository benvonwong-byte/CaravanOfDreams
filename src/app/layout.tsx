import type { Metadata } from 'next'
import { fraunces, dmSans } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Caravan of Dreams — Where the East Village Dreams',
  description:
    'A gathering space for thinkers, doers, and dreamers. Host events, hackathons, and conversations at NYC\'s original vegan cultural hub since 1991.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-cream-200 text-charcoal-700 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
