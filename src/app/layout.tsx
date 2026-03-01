import type { Metadata } from 'next'
import '@/styles/globals.scss'
import { organizationSchema, localBusinessSchema, serviceSchema, aggregateRatingSchema } from '@/lib/schema'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://growbuttler.com'

export const metadata: Metadata = {
  title: 'GrowButtler - Master Cultivation with Local Experts,
  description: 'Connect with certified master growers in your area for guidance, live diagnostics, and a shared journey to harvest.',
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false },
  alternates: { canonical: `${baseUrl}/`, languages: { 'en-US': `${baseUrl}/en`, 'de-DE': `${baseUrl}/de` } },
  openGraph: {
    title: 'GrowButtler - Master Cultivation with Local Experts',
    description: 'Connect with certified master growers in your area for guidance, live diagnostics, and a shared journey to harvest.',
    url: `${baseUrl}/`,
    siteName: 'GrowButtler',
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: 'GrowButtler - Connect with expert master growers' }],
    locale: 'en_US',
    type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'GrowButtler - Master Cultivation with Local Experts', description: 'Connect with certified master growers...', images: [`${baseUrl}/og-image.png`] }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Satoshi:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
        
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }} />
        
        <link rel="canonical" href={`${baseUrl}/`} />
        <link rel="alternate" hrefLang="en-US" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="de-DE" href={`${baseUrl}/de`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/`} />
        
        {/* PWA & Mobile App */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D5016" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GrowButtler" />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="paper-texture" aria-hidden />
        {children}
      </body>
    </html>
  )
}
