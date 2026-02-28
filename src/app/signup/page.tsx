'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Signup.module.scss'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }))

    // Check password match on confirm password change
    if (name === 'confirmPassword') {
      setPasswordsMatch(value === formData.password)
    }
    if (name === 'password' && formData.confirmPassword) {
      setPasswordsMatch(formData.confirmPassword === value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordsMatch) {
      alert('Passwords do not match')
      return
    }

    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      console.log('Signup successful:', result)
      // Redirect to dashboard on success
      window.location.href = '/dashboard'
    } catch (err: any) {
      alert(err.message || 'An error occurred during signup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className="material-symbols-outlined">spa</span>
            <span>GrowButler</span>
          </Link>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Join the Garden</h1>
          <p className={styles.subtitle}>Start your cultivation journey today</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className={styles.hint}>
                At least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={!passwordsMatch ? styles.error : ''}
              />
              {!passwordsMatch && formData.confirmPassword && (
                <p className={styles.errorMessage}>Passwords do not match</p>
              )}
            </div>

            <div className={styles.checkboxGroup}>
              <input
                id="terms"
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="terms">
                I agree to the{' '}
                <Link href="/terms">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isLoading || !passwordsMatch || !formData.agreeTerms}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}>⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">person_add</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button className={styles.oauthBtn}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <p className={styles.login}>
            Already have an account? <Link href="/login">Sign in</Link>
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
