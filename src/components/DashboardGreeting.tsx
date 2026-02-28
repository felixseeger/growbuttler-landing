'use client'

import { useEffect, useState } from 'react'

export default function DashboardGreeting() {
  const [userName, setUserName] = useState<string>('Kultivator')
  const [greeting, setGreeting] = useState<string>('Good morning')

  useEffect(() => {
    // Fetch user info from the API
    fetch('/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          // Use firstName if available, otherwise fall back to full name or email
          setUserName(data.user.firstName || data.user.name || data.user.email || 'Kultivator')
        }
      })
      .catch((err) => {
        console.error('Failed to fetch user info:', err)
      })

    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Guten Morgen')
    } else if (hour < 18) {
      setGreeting('Guten Tag')
    } else {
      setGreeting('Guten Abend')
    }
  }, [])

  return (
    <h2>
      {greeting}, {userName}.
    </h2>
  )
}
