'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './ExpertManagement.module.scss'

interface ExpertApplicant {
  id: number
  name: string
  email: string
  phone: string
  location: string
  specializations: string[]
  yearsExperience: string
  certifications: string
  serviceRate: string
  applicationStatus: string
  applicationDate: string
  portfolioImages: string[]
  portfolioImageCount: number
  bio: string
  successStories: string
  availableInterviewTimes: string[]
  interviewAssignedTo: number | null
  interviewScheduledDate: string | null
  interviewRecommendation: string | null
  interviewNotes: string | null
}

interface MasterGrower {
  id: number
  name: string
  email: string
}

export default function ExpertManagementPage() {
  const router = useRouter()
  const [applicants, setApplicants] = useState<ExpertApplicant[]>([])
  const [masterGrowers, setMasterGrowers] = useState<MasterGrower[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplicant, setSelectedApplicant] = useState<ExpertApplicant | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedMasterGrower, setSelectedMasterGrower] = useState<string>('')
  const [interviewDate, setInterviewDate] = useState<string>('')
  const [interviewNotes, setInterviewNotes] = useState<string>('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchApplicants()
    fetchMasterGrowers()
  }, [])

  const fetchApplicants = async () => {
    try {
      const response = await fetch('/api/admin/expert-applicants', {
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/login?redirect=/admin/experts')
          return
        }
        throw new Error('Failed to fetch applicants')
      }

      const data = await response.json()
      setApplicants(data.applicants || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchMasterGrowers = async () => {
    // For now, we'll need to create an endpoint to fetch users with master_grower role
    // Placeholder: you'll need to implement /api/admin/master-growers
    try {
      const response = await fetch('/api/admin/master-growers', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setMasterGrowers(data.masterGrowers || [])
      }
    } catch (err) {
      console.error('Failed to fetch master growers:', err)
      // Set some dummy data for now
      setMasterGrowers([
        { id: 1, name: 'Felix Seeger', email: 'felixseeger@googlemail.com' }
      ])
    }
  }

  const handleAssignInterview = async () => {
    if (!selectedApplicant || !selectedMasterGrower) {
      alert('Please select a Master Grower')
      return
    }

    setProcessing(true)
    try {
      const response = await fetch('/api/admin/assign-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          applicantId: selectedApplicant.id,
          masterGrowerId: parseInt(selectedMasterGrower),
          scheduledDate: interviewDate || null,
          notes: interviewNotes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to assign interview')
      }

      alert('Interview assigned successfully!')
      setShowAssignModal(false)
      fetchApplicants() // Refresh list
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleApproveExpert = async (applicantId: number) => {
    if (!confirm('Approve this expert application?')) return

    setProcessing(true)
    try {
      const response = await fetch('/api/admin/promote-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: applicantId,
          newRole: 'approved_expert',
          notify: true,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to approve expert')
      }

      alert('Expert approved! They will receive a welcome email.')
      fetchApplicants()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending_review: { label: 'Pending Review', color: '#fbbf24' },
      interview_scheduled: { label: 'Interview Scheduled', color: '#60a5fa' },
      interviewed: { label: 'Interviewed', color: '#8b5cf6' },
      approved: { label: 'Approved', color: '#10b981' },
      rejected: { label: 'Rejected', color: '#ef4444' },
    }

    const statusInfo = statusMap[status] || { label: status, color: '#9ca3af' }

    return (
      <span
        className={styles.statusBadge}
        style={{ backgroundColor: statusInfo.color }}
      >
        {statusInfo.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading expert applicants...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Expert Applicant Management</h1>
        <p className={styles.subtitle}>
          {applicants.length} total applicants
        </p>
      </header>

      <div className={styles.applicantsList}>
        {applicants.length === 0 ? (
          <div className={styles.empty}>No expert applicants yet</div>
        ) : (
          applicants.map((applicant) => (
            <div key={applicant.id} className={styles.applicantCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{applicant.name}</h3>
                  <p className={styles.location}>{applicant.location}</p>
                </div>
                {getStatusBadge(applicant.applicationStatus)}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Email:</span>
                    <span>{applicant.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Phone:</span>
                    <span>{applicant.phone || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Experience:</span>
                    <span>{applicant.yearsExperience}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Rate:</span>
                    <span>€{applicant.serviceRate}/hr</span>
                  </div>
                </div>

                <div className={styles.specializations}>
                  <span className={styles.label}>Specializations:</span>
                  <div className={styles.tags}>
                    {applicant.specializations.map((spec, idx) => (
                      <span key={idx} className={styles.tag}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {applicant.portfolioImageCount > 0 && (
                  <div className={styles.portfolio}>
                    <span className={styles.label}>
                      Portfolio: {applicant.portfolioImageCount} images
                    </span>
                  </div>
                )}

                {applicant.interviewAssignedTo && (
                  <div className={styles.interviewInfo}>
                    <span className={styles.label}>Interview Status:</span>
                    <p>Assigned to Master Grower</p>
                    {applicant.interviewScheduledDate && (
                      <p>
                        Scheduled:{' '}
                        {new Date(applicant.interviewScheduledDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setSelectedApplicant(applicant)
                    setShowAssignModal(true)
                  }}
                  disabled={processing}
                >
                  <span className="material-symbols-outlined">calendar_add_on</span>
                  Assign Interview
                </button>

                <button
                  className={styles.btnPrimary}
                  onClick={() => handleApproveExpert(applicant.id)}
                  disabled={processing}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Approve Expert
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Interview Modal */}
      {showAssignModal && selectedApplicant && (
        <div className={styles.modalOverlay} onClick={() => setShowAssignModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Assign Interview</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowAssignModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.applicantSummary}>
                <h3>{selectedApplicant.name}</h3>
                <p>{selectedApplicant.location}</p>
                <p>{selectedApplicant.specializations.join(', ')}</p>
              </div>

              <div className={styles.formGroup}>
                <label>Select Master Grower *</label>
                <select
                  value={selectedMasterGrower}
                  onChange={(e) => setSelectedMasterGrower(e.target.value)}
                >
                  <option value="">-- Select Master Grower --</option>
                  {masterGrowers.map((mg) => (
                    <option key={mg.id} value={mg.id}>
                      {mg.name} ({mg.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Interview Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Notes (Optional)</label>
                <textarea
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Any special instructions or notes..."
                  rows={4}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setShowAssignModal(false)}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleAssignInterview}
                  disabled={processing || !selectedMasterGrower}
                >
                  {processing ? 'Assigning...' : 'Assign Interview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
