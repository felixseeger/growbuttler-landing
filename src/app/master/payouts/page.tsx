/**
 * Master Payouts - Payment history, earnings tracking
 */

import { Metadata } from 'next'
import { Card, StatCard, Table } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Payouts - Expert | GrowButtler',
  description: 'Manage your payment history and earnings',
}

export default function MasterPayouts() {
  const payoutHistory = [
    {
      id: 'PO-001',
      period: 'Jan 2024',
      amount: '$2,100',
      status: 'completed',
      date: 'Feb 1, 2024',
      method: 'Bank Transfer'
    },
    {
      id: 'PO-002',
      period: 'Feb 2024',
      amount: '$2,840',
      status: 'processing',
      date: 'In Progress',
      method: 'Bank Transfer'
    },
  ]

  return (
    <div className="page-master-payouts">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/master/dashboard' },
          { label: 'Payouts' }
        ]}
      />

      <header className="page-header">
        <h1>Payment & Earnings</h1>
        <p>Track your earnings and manage payouts</p>
      </header>

      {/* Earnings Summary */}
      <section className="stats-grid">
        <StatCard 
          label="Total Earnings"
          value="$15,240"
          icon="💰"
          color="success"
        />
        <StatCard 
          label="This Month"
          value="$2,840"
          icon="📈"
          color="primary"
        />
        <StatCard 
          label="Pending Payout"
          value="$2,840"
          icon="⏳"
          color="warning"
        />
        <StatCard 
          label="Paid Out"
          value="$12,400"
          icon="✓"
          color="success"
        />
      </section>

      {/* Payout Request */}
      <Card title="Request Payout" subtitle="Your pending balance">
        <div className="payout-form">
          <div className="form-group">
            <label>Available Balance</label>
            <div className="balance-display">$2,840.00</div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="payout-method">Payout Method</label>
              <select id="payout-method" className="form-input">
                <option>Bank Transfer</option>
                <option>PayPal</option>
                <option>Stripe</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="payout-amount">Amount to Withdraw</label>
              <input 
                id="payout-amount"
                type="number" 
                className="form-input"
                placeholder="$0.00"
                defaultValue="2840"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea 
              id="notes"
              className="form-textarea" 
              placeholder="Any notes about this payout..."
              rows={3}
            />
          </div>

          <p className="form-help">
            Processing typically takes 1-2 business days. You'll receive a confirmation email.
          </p>

          <button className="btn btn--primary">Request Payout</button>
        </div>
      </Card>

      {/* Payout History */}
      <Card title="Payout History">
        <Table 
          columns={[
            { key: 'id', label: 'Payout ID' },
            { key: 'period', label: 'Period' },
            { key: 'amount', label: 'Amount' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
            { key: 'method', label: 'Method' },
          ]}
          rows={payoutHistory.map(p => ({
            ...p,
            status: <span className={`badge badge--${p.status === 'completed' ? 'success' : 'warning'}`}>{p.status}</span>
          }))}
        />
      </Card>

      {/* Tax Information */}
      <Card title="Tax & Documentation" subtitle="Important for your records">
        <div className="tax-info">
          <p className="info-text">
            As an independent contractor, you may be responsible for self-employment taxes. 
            Please consult with a tax professional about your obligations.
          </p>
          
          <div className="document-list">
            <h4>Available Documents</h4>
            <ul>
              <li>
                <span>Year-to-Date Earnings Summary 2024</span>
                <a href="#" className="link">Download PDF</a>
              </li>
              <li>
                <span>Monthly Earnings Report - February 2024</span>
                <a href="#" className="link">Download PDF</a>
              </li>
              <li>
                <span>1099-NEC Form (when available)</span>
                <a href="#" className="link">View</a>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export const dynamic = 'force-dynamic'
