'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './ExpertProfile.module.scss'
import BookingModal from '@/components/BookingModal'

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
  experience: string
  rating: number
  reviews: number
  consultations: number
  bio: string
  image: string
  specialties: string[]
  services: Service[]
}

const sampleExpert: Expert = {
  id: '1',
  name: 'Dr. Aris Thorne',
  title: 'Master Agronomist',
  experience: '15+ Years Experience',
  rating: 4.9,
  reviews: 1200,
  consultations: 200,
  bio: 'Specializing in organic pest management and living soil, Dr. Thorne brings a sophisticated, ecological approach to modern agronomy. His editorial expertise focuses on sustainable crop health and regenerative practices that bridge the gap between traditional wisdom and scientific innovation.',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABhWuSas02un_jcSnHb1phOH-zUhEXKupRG_neIhTm87_6ja0kS1wVkZRIc0M7nTKtppu-ONxrZyaO9s8IAr0jqH5A3HYCYMy5BlyAIB77-UDzC-Og7sISPTgGqX3zV5hA1zdorc54kvZKONSvJbGea3zDLSYYqRn_SJM_LiBbRnFPjaNxjT2-rP-NxcPMnVQjc6ebOncX2lGava-GHdaxr_1FwZNW8UDXTZ1wHLLcLpgEYb01dX-kXOMrRp7UO61uzNYarOgpsS8',
  specialties: ['organic pest management', 'living soil'],
  services: [
    {
      id: '1',
      icon: 'query_stats',
      title: 'Quick Diagnosis',
      description: 'Photo review & analysis',
      price: '$15',
      unit: 'Per task',
    },
    {
      id: '2',
      icon: 'videocam',
      title: 'Video Consultation',
      description: '1:1 Session via video',
      price: '$45',
      unit: '/ 15 min',
    },
    {
      id: '3',
      icon: 'history_edu',
      title: 'Full Soil Report',
      description: 'Detailed lab analysis',
      price: '$120',
      unit: 'Detailed',
    },
  ],
}

export default function ExpertProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [expert, setExpert] = useState<Expert | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  useEffect(() => {
    async function fetchExpert() {
      try {
        const response = await fetch(`/api/experts/${params.id}`)

        if (response.status === 404) {
          setError('Expert not found')
          setLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error('Failed to load expert')
        }

        const data = await response.json()

        // Transform API data to match Expert interface
        const transformedExpert: Expert = {
          id: data.expert.id.toString(),
          name: data.expert.name,
          title: data.expert.title,
          experience: data.expert.experience,
          rating: data.expert.rating,
          reviews: data.expert.reviews,
          consultations: data.expert.consultations,
          bio: stripHtml(data.expert.bio),
          image: data.expert.image || sampleExpert.image,
          specialties: data.expert.specialties,
          services: data.expert.services.map((s: any) => ({
            id: s.id.toString(),
            icon: s.icon,
            title: s.title,
            description: s.description,
            price: s.price,
            unit: s.unit,
          }))
        }

        setExpert(transformedExpert)
      } catch (err) {
        console.error('Error fetching expert:', err)
        setError('Failed to load expert details')
        // Fallback to sample data
        setExpert(sampleExpert)
      } finally {
        setLoading(false)
      }
    }

    fetchExpert()
  }, [params.id])

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading expert profile...</p>
        </div>
      </div>
    )
  }

  if (error && !expert) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>{error}</h2>
          <button onClick={() => router.push('/experts')} style={{ marginTop: '1rem' }}>
            Back to Experts
          </button>
        </div>
      </div>
    )
  }

  if (!expert) return null

  return (
    <div className={styles.container}>
      {/* Header Image Section */}
      <div className={styles.headerImage} style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent), url('${expert.image}')`
      }}>
        <div className={styles.floatingNav}>
          <button className={styles.navBtn} onClick={() => router.push('/experts')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button className={styles.navBtn} onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: expert.name,
                text: `Check out ${expert.name} on GrowButtler`,
                url: window.location.href
              }).catch(err => console.log('Share failed:', err))
            }
          }}>
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <h1 className={styles.name}>{expert.name}</h1>
          <div className={styles.meta}>
            <span className={styles.title}>{expert.title}</span>
            <span className={styles.dot}></span>
            <span className={styles.experience}>{expert.experience}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Rating</p>
            <div className={styles.statValue}>
              <strong>{expert.rating}</strong>
              <span className="material-symbols-outlined">star</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Reviews</p>
            <p className={styles.statNumber}>{expert.reviews.toLocaleString()}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Consults</p>
            <p className={styles.statNumber}>{expert.consultations}+</p>
          </div>
        </div>

        {/* Biography Section */}
        <section className={styles.bioSection}>
          <h3 className={styles.sectionLabel}>Biography</h3>
          <p className={styles.bioText}>
            {expert.specialties.length > 0 && (
              <>
                Specializing in{' '}
                {expert.specialties.map((specialty, i) => (
                  <span key={i}>
                    <strong>{specialty}</strong>
                    {i < expert.specialties.length - 1 ? (i === expert.specialties.length - 2 ? ' and ' : ', ') : ''}
                  </span>
                ))}.{' '}
              </>
            )}
            {expert.bio}
          </p>
        </section>

        {/* Services Section */}
        <section className={styles.servicesSection}>
          <div className={styles.servicesHeader}>
            <h3>Consultation Services</h3>
            <span className={styles.calendarLink}>View Calendar</span>
          </div>
          <div className={styles.servicesList}>
            {expert.services.map((service) => (
              <div 
                key={service.id} 
                className={styles.serviceCard}
                onClick={() => setSelectedService(service)}
              >
                <div className={styles.serviceContent}>
                  <div className={styles.serviceIcon}>
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </div>
                  <div className={styles.serviceInfo}>
                    <p className={styles.serviceTitle}>{service.title}</p>
                    <p className={styles.serviceDesc}>{service.description}</p>
                  </div>
                </div>
                <div className={styles.servicePrice}>
                  <p className={styles.price}>{service.price}</p>
                  <p className={styles.unit}>{service.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Extra spacing */}
        <div style={{ height: '2rem' }}></div>
      </div>

      {/* Fixed Bottom Action */}
      <footer className={styles.footer}>
        <button
          className={styles.bookBtn}
          onClick={() => setIsBookingModalOpen(true)}
        >
          <span className="material-symbols-outlined">calendar_today</span>
          Book Consultation
        </button>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={{
          id: expert.id,
          name: expert.name,
          title: expert.title,
          image: expert.image,
        }}
        services={expert.services}
        selectedService={selectedService}
      />
    </div>
  )
}
