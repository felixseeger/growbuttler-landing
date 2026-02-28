'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ExpertApply.module.scss'

type Step = 'identity' | 'experience' | 'portfolio' | 'interview' | 'review'

interface FormData {
  // Step 1: Identity & Basics
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  location: string
  specialization: string[]
  bio: string

  // Step 2: Experience
  yearsExperience: string
  certifications: string
  previousClients: string
  preferredMethods: string[]
  serviceRate: string

  // Step 3: Portfolio
  portfolioImages: File[]
  successStories: string

  // Step 4: Interview
  availableTimes: string[]
  agreeTerms: boolean
}

export default function ExpertApplyPage() {
  const [step, setStep] = useState<Step>('identity')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    specialization: [],
    bio: '',
    yearsExperience: '',
    certifications: '',
    previousClients: '',
    preferredMethods: [],
    serviceRate: '',
    portfolioImages: [],
    successStories: '',
    availableTimes: [],
    agreeTerms: false,
  })

  const [error, setError] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const specializations = [
    'Organic Growing',
    'Hydroponic Systems',
    'Pest Management',
    'Nutrient Optimization',
    'Strain Selection',
    'Breeding',
    'Harvest & Curing',
    'Environmental Control',
  ]

  const methods = [
    'Indoor',
    'Outdoor',
    'Greenhouse',
    'Soil',
    'Hydroponics',
    'Aquaponics',
  ]

  const timeSlots = [
    'Mon 14:00-15:00',
    'Mon 18:00-19:00',
    'Wed 10:00-11:00',
    'Wed 15:00-16:00',
    'Fri 14:00-15:00',
    'Fri 18:00-19:00',
  ]

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'confirmPassword') {
      setPasswordsMatch(value === formData.password)
    }
    if (name === 'password' && formData.confirmPassword) {
      setPasswordsMatch(formData.confirmPassword === value)
    }
  }

  const toggleArrayItem = (field: 'specialization' | 'preferredMethods' | 'availableTimes', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value],
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      portfolioImages: [...prev.portfolioImages, ...files],
    }))
  }

  const handleStep1Submit = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields')
      return
    }
    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }
    setError('')
    setStep('experience')
  }

  const handleStep2Submit = () => {
    if (!formData.yearsExperience || formData.preferredMethods.length === 0) {
      setError('Please fill all required fields')
      return
    }
    setError('')
    setStep('portfolio')
  }

  const handleStep3Submit = () => {
    if (formData.portfolioImages.length === 0) {
      setError('Please upload at least one portfolio image')
      return
    }
    setError('')
    setStep('interview')
  }

  const handleStep4Submit = () => {
    if (formData.availableTimes.length === 0 || !formData.agreeTerms) {
      setError('Please select interview times and agree to terms')
      return
    }
    setError('')
    setStep('review')
  }

  const handleSubmitApplication = async () => {
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      
      // Add text fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('specialization', JSON.stringify(formData.specialization))
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('yearsExperience', formData.yearsExperience)
      formDataToSend.append('certifications', formData.certifications)
      formDataToSend.append('previousClients', formData.previousClients)
      formDataToSend.append('preferredMethods', JSON.stringify(formData.preferredMethods))
      formDataToSend.append('serviceRate', formData.serviceRate)
      formDataToSend.append('successStories', formData.successStories)
      formDataToSend.append('availableTimes', JSON.stringify(formData.availableTimes))

      // Add files
      formData.portfolioImages.forEach((file, index) => {
        formDataToSend.append(`portfolioImages`, file)
      })

      const response = await fetch('/api/experts/apply', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Application failed')
      }

      // Success - show confirmation
      alert('Application submitted! Check your email for confirmation.')
      window.location.href = '/experts'
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/experts" className={styles.backBtn}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1>Become a Master Grower</h1>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{
                width:
                  step === 'identity'
                    ? '20%'
                    : step === 'experience'
                      ? '40%'
                      : step === 'portfolio'
                        ? '60%'
                        : step === 'interview'
                          ? '80%'
                          : '100%',
              }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Step 1: Identity */}
          {step === 'identity' && (
            <section className={styles.section}>
              <h2>Create Your Account</h2>
              <p className={styles.sectionDesc}>
                Let's start with your basic information
              </p>

              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+49 123 456789"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Location (City)</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Berlin, Munich, etc."
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={!passwordsMatch ? styles.error : ''}
                />
                {!passwordsMatch && formData.confirmPassword && (
                  <p className={styles.errorMsg}>Passwords do not match</p>
                )}
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button className={styles.nextBtn} onClick={handleStep1Submit}>
                Continue
              </button>
            </section>
          )}

          {/* Step 2: Experience */}
          {step === 'experience' && (
            <section className={styles.section}>
              <h2>Your Expertise</h2>
              <p className={styles.sectionDesc}>
                Tell us about your growing experience
              </p>

              <div className={styles.formGroup}>
                <label>Years of Experience</label>
                <select
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Specializations</label>
                <div className={styles.checkboxGrid}>
                  {specializations.map(spec => (
                    <label key={spec} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.specialization.includes(spec)}
                        onChange={() => toggleArrayItem('specialization', spec)}
                      />
                      {spec}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Preferred Growing Methods</label>
                <div className={styles.checkboxGrid}>
                  {methods.map(method => (
                    <label key={method} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.preferredMethods.includes(method)}
                        onChange={() => toggleArrayItem('preferredMethods', method)}
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Hourly Rate (€)</label>
                <input
                  type="number"
                  name="serviceRate"
                  placeholder="45"
                  value={formData.serviceRate}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Certifications (Optional)</label>
                <textarea
                  name="certifications"
                  placeholder="List any relevant certifications or credentials"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  rows={3}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Professional Bio</label>
                <textarea
                  name="bio"
                  placeholder="Tell growers why they should work with you"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                ></textarea>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.buttonGroup}>
                <button className={styles.backBtn} onClick={() => setStep('identity')}>
                  Back
                </button>
                <button className={styles.nextBtn} onClick={handleStep2Submit}>
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* Step 3: Portfolio */}
          {step === 'portfolio' && (
            <section className={styles.section}>
              <h2>Your Portfolio</h2>
              <p className={styles.sectionDesc}>
                Show us your best work
              </p>

              <div className={styles.formGroup}>
                <label>Portfolio Images (Upload at least 1)</label>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    id="portfolio-upload"
                    hidden
                  />
                  <label htmlFor="portfolio-upload" className={styles.uploadLabel}>
                    <span className="material-symbols-outlined">cloud_upload</span>
                    <p>Click to upload or drag and drop</p>
                    <span className={styles.hint}>PNG, JPG up to 10MB</span>
                  </label>
                </div>
                {formData.portfolioImages.length > 0 && (
                  <div className={styles.imageList}>
                    <p>Selected images: {formData.portfolioImages.length}</p>
                    {formData.portfolioImages.map((file, i) => (
                      <p key={i} className={styles.fileName}>{file.name}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Success Stories</label>
                <textarea
                  name="successStories"
                  placeholder="Describe successful grows, challenges overcome, and results achieved"
                  value={formData.successStories}
                  onChange={handleInputChange}
                  rows={5}
                ></textarea>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.buttonGroup}>
                <button className={styles.backBtn} onClick={() => setStep('experience')}>
                  Back
                </button>
                <button className={styles.nextBtn} onClick={handleStep3Submit}>
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* Step 4: Interview Scheduling */}
          {step === 'interview' && (
            <section className={styles.section}>
              <h2>Schedule Your Interview</h2>
              <p className={styles.sectionDesc}>
                All experts must complete a video interview with our master growers before approval
              </p>

              <div className={styles.interviewInfo}>
                <span className="material-symbols-outlined">info</span>
                <p>
                  Your interview will be 30 minutes. We'll discuss your experience, methods, and answer any questions about the GrowButtler platform.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label>Select Available Times (CET)</label>
                <div className={styles.timeSlots}>
                  {timeSlots.map(slot => (
                    <label key={slot} className={styles.timeSlot}>
                      <input
                        type="checkbox"
                        checked={formData.availableTimes.includes(slot)}
                        onChange={() => toggleArrayItem('availableTimes', slot)}
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  id="agree"
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="agree">
                  I agree to the{' '}
                  <Link href="/terms">Terms of Service</Link>
                  {' '}and confirm this information is accurate
                </label>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.buttonGroup}>
                <button className={styles.backBtn} onClick={() => setStep('portfolio')}>
                  Back
                </button>
                <button className={styles.nextBtn} onClick={handleStep4Submit}>
                  Review Application
                </button>
              </div>
            </section>
          )}

          {/* Step 5: Review & Submit */}
          {step === 'review' && (
            <section className={styles.section}>
              <h2>Review Your Application</h2>
              <p className={styles.sectionDesc}>
                Please verify all information before submitting
              </p>

              <div className={styles.reviewCard}>
                <h3>Personal Information</h3>
                <div className={styles.reviewRow}>
                  <span>Name:</span>
                  <strong>{formData.name}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Email:</span>
                  <strong>{formData.email}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Location:</span>
                  <strong>{formData.location}</strong>
                </div>
              </div>

              <div className={styles.reviewCard}>
                <h3>Experience</h3>
                <div className={styles.reviewRow}>
                  <span>Years Experience:</span>
                  <strong>{formData.yearsExperience}</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Hourly Rate:</span>
                  <strong>€{formData.serviceRate}/hour</strong>
                </div>
                <div className={styles.reviewRow}>
                  <span>Specializations:</span>
                  <strong>{formData.specialization.join(', ')}</strong>
                </div>
              </div>

              <div className={styles.reviewCard}>
                <h3>Interview Times</h3>
                <div className={styles.reviewRow}>
                  <span>Selected:</span>
                  <strong>{formData.availableTimes.join(', ')}</strong>
                </div>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.buttonGroup}>
                <button className={styles.backBtn} onClick={() => setStep('interview')}>
                  Back
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmitApplication}
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
