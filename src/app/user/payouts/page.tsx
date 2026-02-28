/**
 * User Payouts - Subscription/payment status
 */

import { Metadata } from 'next'
import { Card, StatCard } from '@/components/DashboardComponents'
import { Breadcrumbs } from '@/components/DashboardNav'

export const metadata: Metadata = {
  title: 'Account & Billing | GrowButtler',
  description: 'Manage your subscription and payment methods',
}

export default function UserPayouts() {
  return (
    <div className="page-user-payouts">
      <Breadcrumbs 
        items={[
          { label: 'Dashboard', href: '/user/dashboard' },
          { label: 'Account & Billing' }
        ]}
      />

      <header className="page-header">
        <h1>Account & Billing</h1>
        <p>Manage your subscription and payment information</p>
      </header>

      {/* Subscription Summary */}
      <section className="stats-grid">
        <StatCard 
          label="Current Plan"
          value="Pro"
          icon="📦"
          color="primary"
        />
        <StatCard 
          label="Next Billing"
          value="Mar 15"
          icon="📅"
          color="primary"
        />
        <StatCard 
          label="Monthly Cost"
          value="$9.99"
          icon="💳"
          color="success"
        />
        <StatCard 
          label="Status"
          value="Active"
          icon="✓"
          color="success"
        />
      </section>

      {/* Active Subscription */}
      <Card title="Your Current Subscription">
        <div className="subscription-details-card">
          <div className="subscription-plan">
            <h3>Pro Plan</h3>
            <p className="plan-description">Full access to all expert consultations</p>
            <p className="plan-price">$9.99 per month</p>
          </div>

          <div className="subscription-features">
            <h4>Plan Includes:</h4>
            <ul>
              <li>✓ Unlimited consultation bookings</li>
              <li>✓ Access to all certified experts</li>
              <li>✓ Session recordings</li>
              <li>✓ Priority support</li>
              <li>✓ Certificate programs</li>
              <li>✓ Monthly newsletters</li>
            </ul>
          </div>

          <div className="subscription-info-box">
            <div className="info-item">
              <span>Start Date:</span>
              <strong>Feb 15, 2024</strong>
            </div>
            <div className="info-item">
              <span>Next Billing:</span>
              <strong>Mar 15, 2024</strong>
            </div>
            <div className="info-item">
              <span>Auto-Renewal:</span>
              <strong>Enabled</strong>
            </div>
            <div className="info-item">
              <span>Status:</span>
              <strong className="status-active">Active</strong>
            </div>
          </div>

          <div className="subscription-actions">
            <button className="btn btn--secondary">Change Plan</button>
            <button className="btn btn--secondary">Pause Subscription</button>
            <button className="btn btn--danger">Cancel Subscription</button>
          </div>
        </div>
      </Card>

      {/* Available Plans */}
      <Card title="Other Available Plans">
        <div className="plans-comparison">
          <div className="plan-option">
            <h4>Starter Plan</h4>
            <p className="price">Free</p>
            <ul className="features-list">
              <li>✓ 1 consultation per month</li>
              <li>✓ Basic expert access</li>
              <li>✓ Community access</li>
            </ul>
            <button className="btn btn--secondary" disabled>Current Plan</button>
          </div>

          <div className="plan-option">
            <h4>Pro Plan</h4>
            <p className="price">$9.99/mo</p>
            <p className="status-badge">CURRENT PLAN</p>
            <ul className="features-list">
              <li>✓ Unlimited consultations</li>
              <li>✓ All experts</li>
              <li>✓ Recordings</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="btn btn--secondary" disabled>Current Plan</button>
          </div>

          <div className="plan-option">
            <h4>Premium Plus</h4>
            <p className="price">$19.99/mo</p>
            <ul className="features-list">
              <li>✓ Everything in Pro</li>
              <li>✓ 1-on-1 expert mentoring</li>
              <li>✓ Custom learning path</li>
              <li>✓ VIP support</li>
            </ul>
            <button className="btn btn--primary">Upgrade</button>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card title="Payment Method">
        <div className="payment-methods">
          <div className="current-payment">
            <h4>Current Payment Method</h4>
            <div className="payment-card">
              <span className="card-type">💳 Visa</span>
              <span className="card-number">**** **** **** 4242</span>
              <span className="card-expiry">Expires 12/2026</span>
            </div>
            <button className="btn btn--secondary">Update Payment Method</button>
          </div>

          <div className="add-payment">
            <h4>Add Another Payment Method</h4>
            <div className="form-group">
              <label htmlFor="card-holder">Cardholder Name</label>
              <input id="card-holder" type="text" className="form-input" placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label htmlFor="card-number">Card Number</label>
              <input id="card-number" type="text" className="form-input" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="card-expiry">Expiry Date</label>
                <input id="card-expiry" type="text" className="form-input" placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label htmlFor="card-cvc">CVC</label>
                <input id="card-cvc" type="text" className="form-input" placeholder="123" />
              </div>
            </div>

            <button className="btn btn--primary">Add Payment Method</button>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card title="Billing History">
        <div className="billing-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mar 15, 2024</td>
                <td>Pro Plan Subscription</td>
                <td>$9.99</td>
                <td><span className="status-badge status-paid">Paid</span></td>
                <td><a href="#" className="link">Download</a></td>
              </tr>
              <tr>
                <td>Feb 15, 2024</td>
                <td>Pro Plan Subscription</td>
                <td>$9.99</td>
                <td><span className="status-badge status-paid">Paid</span></td>
                <td><a href="#" className="link">Download</a></td>
              </tr>
              <tr>
                <td>Jan 15, 2024</td>
                <td>Pro Plan Subscription</td>
                <td>$9.99</td>
                <td><span className="status-badge status-paid">Paid</span></td>
                <td><a href="#" className="link">Download</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tax Settings */}
      <Card title="Tax & Legal">
        <div className="tax-info">
          <p>Your subscription includes any applicable taxes based on your location.</p>
          
          <div className="form-group">
            <label htmlFor="tax-id">Tax ID (optional)</label>
            <input id="tax-id" type="text" className="form-input" placeholder="Enter your tax ID" />
            <p className="form-help">If you have a tax ID, enter it here for tax exemption</p>
          </div>

          <button className="btn btn--primary">Save Tax Information</button>
        </div>
      </Card>

      {/* Refund Policy */}
      <Card title="Refund & Cancellation Policy">
        <div className="policy-text">
          <h4>Subscription Cancellation</h4>
          <p>You can cancel your subscription at any time. Your access will remain active until the end of your billing period.</p>

          <h4>Refunds</h4>
          <p>Refunds are provided only for accidental duplicate charges or technical errors. Cancellations are non-refundable but you'll retain access until your billing period ends.</p>

          <h4>Questions?</h4>
          <p>Contact our support team at support@growbuttler.com for billing questions.</p>
        </div>
      </Card>
    </div>
  )
}

export const dynamic = 'force-dynamic'
