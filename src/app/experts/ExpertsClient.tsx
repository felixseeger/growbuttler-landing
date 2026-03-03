'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './ExpertsPage.module.scss'

interface Expert {
  id?: number
  name: string
  is_verified?: boolean
  rating?: string
  reviews_count?: number
  location?: string
  price_amount?: number
  price_unit?: string
  tags?: Array<{ item: string }>
  bio_snippet?: string
  avatar?: string
}

interface ExpertsClientProps {
  initialExperts: Expert[]
}

export default function ExpertsClient({ initialExperts }: ExpertsClientProps) {
  const [experts] = useState<Expert[]>(initialExperts)
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(initialExperts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<'specialty' | 'price' | null>(null)

  // Extract unique specialties from all experts
  const allSpecialties = Array.from(
    new Set(
      experts.flatMap(expert =>
        (expert.tags || []).map(tag => tag.item)
      )
    )
  )

  useEffect(() => {
    let filtered = [...experts]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(expert =>
        expert.name?.toLowerCase().includes(query) ||
        expert.location?.toLowerCase().includes(query) ||
        expert.bio_snippet?.toLowerCase().includes(query) ||
        (expert.tags || []).some(tag => tag.item.toLowerCase().includes(query))
      )
    }

    // Specialty filter
    if (selectedSpecialty) {
      filtered = filtered.filter(expert =>
        (expert.tags || []).some(tag => tag.item === selectedSpecialty)
      )
    }

    // Price filter
    if (priceRange) {
      filtered = filtered.filter(expert => {
        const price = expert.price_amount || 0
        switch (priceRange) {
          case 'under-40':
            return price < 40
          case '40-60':
            return price >= 40 && price <= 60
          case 'over-60':
            return price > 60
          default:
            return true
        }
      })
    }

    setFilteredExperts(filtered)
  }, [searchQuery, selectedSpecialty, priceRange, experts])

  const toggleDropdown = (name: 'specialty' | 'price') => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const closeDropdowns = () => setActiveDropdown(null)

  return (
    <>
      {/* Search and Filters */}
      <div className={styles.filtersBar}>
        <div className={styles.search}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search by name, location, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.chips}>
          {/* Specialty Filter */}
          <div className={styles.filterGroup}>
            <button 
              className={selectedSpecialty ? styles.active : ''}
              onClick={() => toggleDropdown('specialty')}
            >
              {selectedSpecialty || 'Specialty'} 
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            {activeDropdown === 'specialty' && (
              <div className={styles.dropdown}>
                <button
                  className={selectedSpecialty === null ? styles.selected : ''}
                  onClick={() => { setSelectedSpecialty(null); closeDropdowns() }}
                >
                  All Specialties
                </button>
                {allSpecialties.map(specialty => (
                  <button
                    key={specialty}
                    className={selectedSpecialty === specialty ? styles.selected : ''}
                    onClick={() => { setSelectedSpecialty(specialty); closeDropdowns() }}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className={styles.filterGroup}>
            <button 
              className={priceRange ? styles.active : ''}
              onClick={() => toggleDropdown('price')}
            >
              Price {priceRange === 'under-40' ? '< €40' : priceRange === '40-60' ? '€40-60' : priceRange === 'over-60' ? '> €60' : ''} 
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            {activeDropdown === 'price' && (
              <div className={styles.dropdown}>
                {[
                  { label: 'Any Price', value: null },
                  { label: 'Under €40', value: 'under-40' },
                  { label: '€40 - €60', value: '40-60' },
                  { label: 'Over €60', value: 'over-60' }
                ].map(opt => (
                  <button
                    key={opt.label}
                    className={priceRange === opt.value ? styles.selected : ''}
                    onClick={() => { setPriceRange(opt.value); closeDropdowns() }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className={styles.layout}>
        <div className={styles.resultsSide}>
          <div className={styles.resultsHeader}>
            <h3>
              {selectedSpecialty || searchQuery
                ? `Experts ${selectedSpecialty ? `- ${selectedSpecialty}` : ''}`
                : 'Top Experts in Berlin'}
            </h3>
            <span className={styles.count}>{filteredExperts.length} Result{filteredExperts.length !== 1 ? 's' : ''}</span>
          </div>

          {filteredExperts.length === 0 ? (
            <div className={styles.noResults}>
              <p>No experts found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSpecialty(null)
                  setPriceRange(null)
                }}
                className={styles.clearFiltersBtn}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredExperts.map((expert, i) => (
                <div key={expert.id || i} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.expertBrief}>
                      <div className={styles.avatarWrap}>
                        <Image
                          src={expert.avatar as string || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG6ZYFYopok3wpRZVkSy6v_dg33oo9RYzfGi8bDkC40Ee3W1e9m_4AzeN0QBIXEe9-r26YtOYud3jLKSdVcQ6K5a6_UH5orU_1_1gvaauehdtu9ESsWGMG-Yhe-HbXtd7I2DD1bkNpQU03xNkGuCV5zcoYhRdRIoz47sxuflH-XalvqJd1-17wkztxdLtckzpsKxsDXxsHWEfwlRTuv7z3X9fbX-z_rPD723z-QIGhgjeEcwrAR_KzNW6TFkdtlrRoR5SS60wUYnTF'}
                          alt={expert.name as string}
                          width={64}
                          height={64}
                          className={styles.avatar}
                          unoptimized
                        />
                        {!!expert.is_verified && <span className={styles.verifiedIcon}><span className="material-symbols-outlined">verified</span></span>}
                      </div>
                      <div className={styles.meta}>
                        <h4>{expert.name as string}</h4>
                        <div className={styles.rating}>
                          <span className="material-symbols-outlined">star</span>
                          <strong>{expert.rating as string}</strong>
                          <span>({expert.reviews_count as number} reviews)</span>
                        </div>
                        <p className={styles.loc}>
                          <span className="material-symbols-outlined">location_on</span>
                          {expert.location as string}
                        </p>
                      </div>
                    </div>
                    <div className={styles.price}>
                      <strong>€{expert.price_amount as number}</strong>
                      <span>{expert.price_unit as string}</span>
                    </div>
                  </div>

                  <div className={styles.tags}>
                    {(expert.tags || []).map((tag, j) => (
                      <span key={j} className={styles.tag}>{tag.item}</span>
                    ))}
                  </div>

                  <p className={styles.bio}>{expert.bio_snippet as string}</p>

                  <div className={styles.actions}>
                    <Link href={`/expert/${expert.id || i + 1}`} className={styles.btnSec}>
                      View Profile
                    </Link>
                    <button className={styles.btnPri}>Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={styles.mapSide}>
          <div className={styles.mapWrap}>
            <div className={styles.mapOverlay}>
              <div className={styles.mapTitle}>Expert Map</div>
            </div>
            <div className={styles.mapImage} />

            {/* Fake pins */}
            <div className={styles.pin} style={{ top: '35%', left: '45%' }}>
              <div className={styles.pinIcon}><span className="material-symbols-outlined">spa</span></div>
            </div>
            <div className={styles.pin} style={{ top: '55%', left: '30%' }}>
              <div className={`${styles.pinIcon} ${styles.pinSec}`}><span className="material-symbols-outlined">water_drop</span></div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
