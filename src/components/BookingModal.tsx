'use client'

import { useState, useEffect } from 'react'
import styles from './BookingModal.module.scss'

interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: string
  unit: string
}

interface Expert {
  id: string
  name: string
  title: string
  image: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  expert: Expert
  services: Service[]
  selectedService?: Service | null
}

interface TimeSlot {
  time: string
  available: boolean
}

export default function BookingModal({
  isOpen,
  onClose,
  expert,
  services,
  selectedService: initialService,
}: BookingModalProps) {
  const [step, setStep] = useState(1) // 1: Service, 2: Date/Time, 3: Details, 4: Confirmation
  const [selectedService, setSelectedService] = useState<Service | null>(initialService || null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset to step 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSelectedService(initialService || null)
      setSelectedDate(null)
      setSelectedTime(null)
      setError(null)
    }
  }, [isOpen, initialService])

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates: Date[] = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  // Fetch available time slots for selected date
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    if (selectedDate && expert.id) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate, expert.id])

  const fetchAvailableSlots = async (date: Date) => {
    setLoadingSlots(true)
    try {
      const dateStr = date.toISOString().split('T')[0]
      const response = await fetch(`/api/experts/${expert.id}/availability?date=${dateStr}`)

      if (response.ok) {
        const data = await response.json()
        const slots: TimeSlot[] = data.availableSlots.map((time: string) => ({
          time,
          available: !data.blockedSlots.some((blocked: any) => blocked.time === time)
        }))
        setTimeSlots(slots)
      } else {
        // Fallback: generate default slots
        setTimeSlots(generateDefaultSlots())
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
      // Fallback: generate default slots
      setTimeSlots(generateDefaultSlots())
    } finally {
      setLoadingSlots(false)
    }
  }

  // Generate default time slots as fallback
  const generateDefaultSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    // Generate slots from 9 AM to 5 PM (every 30 minutes)
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 17 && minute === 30) break // Stop at 5:00 PM
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        // Randomly mark some as unavailable for demo purposes
        const available = Math.random() > 0.3
        slots.push({ time, available })
      }
    }
    return slots
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          expertId: expert.id,
          serviceId: selectedService?.id,
          date: selectedDate?.toISOString(),
          time: selectedTime,
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          notes: formData.notes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create booking')
      }

      setStep(4) // Show confirmation
    } catch (err: any) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      // Reset form after animation
      setTimeout(() => {
        setStep(1)
        setSelectedService(null)
        setSelectedDate(null)
        setSelectedTime(null)
        setFormData({ name: '', email: '', phone: '', notes: '' })
        setError(null)
      }, 300)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {step > 1 && step < 4 && (
              <button
                className={styles.backBtn}
                onClick={() => setStep(step - 1)}
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <h2 className={styles.title}>
              {step === 1 && 'Select Service'}
              {step === 2 && 'Choose Date & Time'}
              {step === 3 && 'Your Details'}
              {step === 4 && 'Booking Confirmed'}
            </h2>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Expert Info */}
        <div className={styles.expertInfo}>
          <div className={styles.expertAvatar} style={{ backgroundImage: `url(${expert.image})` }} />
          <div>
            <p className={styles.expertName}>{expert.name}</p>
            <p className={styles.expertTitle}>{expert.title}</p>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className={styles.servicesList}>
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`${styles.serviceCard} ${
                    selectedService?.id === service.id ? styles.selected : ''
                  }`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className={styles.serviceIcon}>
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </div>
                  <div className={styles.serviceInfo}>
                    <p className={styles.serviceTitle}>{service.title}</p>
                    <p className={styles.serviceDesc}>{service.description}</p>
                  </div>
                  <div className={styles.servicePrice}>
                    <p className={styles.price}>{service.price}</p>
                    <p className={styles.unit}>{service.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className={styles.dateTimeSection}>
              {/* Selected Service Summary */}
              {selectedService && (
                <div className={styles.selectedSummary}>
                  <span className="material-symbols-outlined">{selectedService.icon}</span>
                  <div>
                    <p className={styles.summaryTitle}>{selectedService.title}</p>
                    <p className={styles.summaryPrice}>{selectedService.price} {selectedService.unit}</p>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className={styles.dateSelection}>
                <h3>Select Date</h3>
                <div className={styles.dateGrid}>
                  {getAvailableDates().map((date, index) => (
                    <button
                      key={index}
                      className={`${styles.dateButton} ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? styles.selected
                          : ''
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <span className={styles.dateDay}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={styles.dateNumber}>{date.getDate()}</span>
                      <span className={styles.dateMonth}>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className={styles.timeSelection}>
                  <h3>Select Time</h3>
                  {loadingSlots ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                      Loading available times...
                    </p>
                  ) : timeSlots.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                      No available time slots for this date
                    </p>
                  ) : (
                    <div className={styles.timeGrid}>
                        {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          className={`${styles.timeButton} ${
                            !slot.available ? styles.unavailable : ''
                          } ${selectedTime === slot.time ? styles.selected : ''}`}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer Details */}
          {step === 3 && (
            <div className={styles.detailsForm}>
              {/* Booking Summary */}
              <div className={styles.bookingSummary}>
                <div className={styles.summaryRow}>
                  <span className="material-symbols-outlined">event</span>
                  <span>{selectedDate && formatDate(selectedDate)} at {selectedTime}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className="material-symbols-outlined">{selectedService?.icon}</span>
                  <span>{selectedService?.title} - {selectedService?.price}</span>
                </div>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              {/* Form Fields */}
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Additional Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder="Any specific questions or topics you'd like to discuss..."
                  rows={4}
                />
              </div>

              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className={styles.confirmation}>
              <div className={styles.confirmIcon}>
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <h3>Booking Confirmed!</h3>
              <p className={styles.confirmMessage}>
                Your consultation has been booked with {expert.name}.
                You'll receive a confirmation email shortly with all the details.
              </p>

              <div className={styles.confirmDetails}>
                <div className={styles.confirmRow}>
                  <span className="material-symbols-outlined">event</span>
                  <div>
                    <p className={styles.confirmLabel}>Date & Time</p>
                    <p className={styles.confirmValue}>
                      {selectedDate && formatDate(selectedDate)} at {selectedTime}
                    </p>
                  </div>
                </div>

                <div className={styles.confirmRow}>
                  <span className="material-symbols-outlined">{selectedService?.icon}</span>
                  <div>
                    <p className={styles.confirmLabel}>Service</p>
                    <p className={styles.confirmValue}>{selectedService?.title}</p>
                  </div>
                </div>

                <div className={styles.confirmRow}>
                  <span className="material-symbols-outlined">person</span>
                  <div>
                    <p className={styles.confirmLabel}>Expert</p>
                    <p className={styles.confirmValue}>{expert.name}</p>
                  </div>
                </div>
              </div>

              <button className={styles.doneBtn} onClick={handleClose}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
