'use client'

import { useEffect, useState } from 'react'

function getFirstName(user: {
  firstName?: string
  name?: string
  email?: string
}): string {
  if (user.firstName?.trim()) return user.firstName.trim()
  const fullName = user.name?.trim()
  // Only use name if it looks like a display name (not an email/username)
  if (fullName && !fullName.includes('@')) {
    const first = fullName.split(/\s+/)[0]
    if (first) return first
  }
  // Never show full email; use local part as fallback (e.g. "felix" from "felix@…")
  if (user.email?.includes('@')) {
    const local = user.email.split('@')[0].trim()
    if (local) return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase()
  }
  return 'Kultivator'
}

export default function DashboardGreeting() {
  const [firstName, setFirstName] = useState<string>('Kultivator')
  const [greeting, setGreeting] = useState<string>('Good morning')

  useEffect(() => {
    fetch('/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFirstName(getFirstName(data.user))
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
      {greeting}, {firstName}.
    </h2>
  )
}
