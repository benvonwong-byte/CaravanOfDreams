import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crawl & Bloom — Caravan of Dreams x Brooklyn Bugs',
  description:
    'One night. Two visionaries. A multi-course tasting menu where organic vegan cuisine meets the world of edible insects. The future of food is here.',
}

export default function CollabLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Hide the root layout Header/Footer and override body bg */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body { background-color: #1e1916 !important; color: #f5f0e8 !important; }
            body > header { display: none !important; }
            body > main { padding-top: 0 !important; }
            body > footer { display: none !important; }
          `,
        }}
      />
      {children}
    </>
  )
}
