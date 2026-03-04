'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './ResetPassword.module.scss'
import Branding from '@/components/Branding/Branding'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password')
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <h2>Password Reset Successful</h2>
        <p>Your password has been updated. You can now sign in with your new password.</p>
        <Link href="/login" className={styles.backToLogin}>
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className={styles.subtitle}>
        Choose a strong password for your GrowButtler account.
      </p>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!token}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={!token}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={isLoading || !token}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}>⏳</span>
              Resetting Password...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">lock_reset</span>
              Update Password
            </>
          )}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Branding className={styles.centeredBranding} />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>New Password</h1>
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>

          <p className={styles.backLink}>
            Back to <Link href="/login">Sign in</Link>
          </p>
        </div>

        <div className={styles.footer}>
          <p className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms">Terms of Service</Link>
          </p>
        </div>
      </div>

      <div className={styles.decoration} />
    </div>
  )
}
