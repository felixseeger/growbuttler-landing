import type { Metadata } from 'next'
import SubpageLayout from '@/components/SubpageLayout/SubpageLayout'

export const metadata: Metadata = {
  title: 'Settings - GrowButtler',
  description: 'Account and app settings.',
}

export default function SettingsPage() {
  return (
    <SubpageLayout>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
        Settings
      </h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
        Account and preferences. Coming soon.
      </p>
    </SubpageLayout>
  )
}
