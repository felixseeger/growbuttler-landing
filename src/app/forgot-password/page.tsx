'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './ForgotPassword.module.scss'
import Branding from '@/components/Branding/Branding'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to request password reset')
      }

      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Branding className={styles.centeredBranding} />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Reset Password</h1>
          
          {!isSubmitted ? (
            <>
              <p className={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && <div className={styles.errorAlert}>{error}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className={styles.spinner}>⏳</span>
                      Sending Link...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <span className="material-symbols-outlined">mark_email_read</span>
              </div>
              <h2>Check your email</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox (and spam folder) and follow the instructions.
              </p>
              <Link href="/login" className={styles.backToLogin}>
                Back to Login
              </Link>
            </div>
          )}

          {!isSubmitted && (
            <p className={styles.backLink}>
              Remember your password? <Link href="/login">Sign in</Link>
            </p>
          )}
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
