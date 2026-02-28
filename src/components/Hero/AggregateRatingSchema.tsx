'use client'

import { useEffect } from 'react'
import { aggregateRatingSchema } from '@/lib/schema'

export function AggregateRatingSchema() {
  useEffect(() => {
    // This component injects the AggregateRating schema into the page
    // The schema is already injected via the Head in layout.tsx,
    // but this component ensures it's available in the DOM
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(aggregateRatingSchema)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
