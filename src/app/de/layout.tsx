import type { Metadata } from 'next'
import '@/styles/globals.scss'
import { organizationSchema, localBusinessSchema, serviceSchema, aggregateRatingSchema } from '@/lib/schema'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://growbuttler.com'

export const metadata: Metadata = {
  title: 'GrowButtler - Meisterhafte Kultivierung mit lokalen Experten',
  description: 'Verbinden Sie sich mit zertifizierten Meistergärtnern in Ihrer Nähe für Beratung, Live-Diagnostik und eine gemeinsame Reise zur Ernte.',
  alternates: {
    canonical: `${baseUrl}/de`,
    languages: {
      'en-US': `${baseUrl}/en`,
      'de-DE': `${baseUrl}/de`,
    },
  },
  openGraph: {
    title: 'GrowButtler - Meisterhafte Kultivierung mit lokalen Experten',
    description: 'Verbinden Sie sich mit zertifizierten Meistergärtnern in Ihrer Nähe für Beratung, Live-Diagnostik und eine gemeinsame Reise zur Ernte.',
    url: `${baseUrl}/de`,
    siteName: 'GrowButtler',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'GrowButtler - Verbinden Sie sich mit Experten-Meistergärtnern',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrowButtler - Meisterhafte Kultivierung mit lokalen Experten',
    description: 'Verbinden Sie sich mit zertifizierten Meistergärtnern in Ihrer Nähe für Beratung, Live-Diagnostik und eine gemeinsame Reise zur Ernte.',
    images: [`${baseUrl}/og-image.png`],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Satoshi:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        
        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
        />
        
        {/* Canonical URL & Hreflang */}
        <link rel="canonical" href={`${baseUrl}/de`} />
        <link rel="alternate" hrefLang="en-US" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="de-DE" href={`${baseUrl}/de`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="paper-texture" aria-hidden />
        {children}
      </body>
    </html>
  )
}
