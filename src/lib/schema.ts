/**
 * Schema.org JSON-LD builders for GrowButtler
 */

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GrowButtler',
  url: 'https://growbuttler.com',
  logo: 'https://growbuttler.com/logo.png',
  description: 'Connect with certified master growers for expert guidance, live diagnostics, and cultivation consulting.',
  sameAs: [
    'https://www.instagram.com/growbuttler',
    'https://www.linkedin.com/company/growbuttler',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+49-30-xxxx',
    contactType: 'Customer Support',
  },
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'GrowButtler',
  description: 'Master grower consulting and expert guidance platform',
  url: 'https://growbuttler.com',
  image: 'https://growbuttler.com/logo.png',
  areaServed: [
    {
      '@type': 'City',
      name: 'Berlin',
      addressCountry: 'DE',
    },
    {
      '@type': 'City',
      name: 'Munich',
      addressCountry: 'DE',
    },
  ],
  serviceArea: {
    '@type': 'GeoShape',
    addressCountry: 'DE',
  },
}

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Expert Consultation',
  description: 'Professional cultivation guidance and expert consulting from certified master growers',
  provider: {
    '@type': 'Organization',
    name: 'GrowButtler',
  },
  serviceType: 'Professional Consulting',
  areaServed: {
    '@type': 'GeoShape',
    addressCountry: 'DE',
  },
  priceRange: '€15-€50',
}

export const aggregateRatingSchema = {
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  ratingValue: '5.0',
  bestRating: '5',
  worstRating: '1',
  ratingCount: 124,
  reviewCount: 124,
}

export function generateSchemaScript(schema: Record<string, any>): string {
  return JSON.stringify(schema)
}
