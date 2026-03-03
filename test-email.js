#!/usr/bin/env node

/**
 * Email Test Script
 *
 * This script demonstrates what email content would be sent for different scenarios.
 * Run with: node test-email.js
 */

console.log('\n📧 GrowButtler Email Templates Demo\n')
console.log('This shows what emails would look like for different actions.\n')
console.log('='.repeat(80) + '\n')

// Simulate booking confirmation email
const bookingConfirmation = {
  to: 'customer@example.com',
  subject: 'Booking Confirmed: Consultation with John Doe',
  template: 'booking_confirmation_customer',
  data: {
    customerName: 'Jane Smith',
    expertName: 'John Doe',
    bookingDate: 'Monday, March 10, 2026',
    bookingTime: '14:00',
    notes: 'I need help with pest management on my tomato plants',
  }
}

console.log('📅 BOOKING CONFIRMATION EMAIL (to Customer)')
console.log('='.repeat(80))
console.log(`To: ${bookingConfirmation.to}`)
console.log(`Subject: ${bookingConfirmation.subject}`)
console.log('-'.repeat(80))
console.log(`
Booking Confirmed!

Hi ${bookingConfirmation.data.customerName},

Your consultation with ${bookingConfirmation.data.expertName} has been confirmed.

Date: ${bookingConfirmation.data.bookingDate}
Time: ${bookingConfirmation.data.bookingTime}
${bookingConfirmation.data.notes ? `Notes: ${bookingConfirmation.data.notes}` : ''}

View dashboard: https://growbuttler.felixseeger.de/dashboard
`)
console.log('='.repeat(80) + '\n')

// Simulate expert notification
const expertNotification = {
  to: 'expert@example.com',
  subject: 'New Booking: Jane Smith - March 10, 2026',
  template: 'booking_notification_expert',
  data: {
    expertName: 'John Doe',
    customerName: 'Jane Smith',
    customerEmail: 'customer@example.com',
    customerPhone: '+1 (555) 123-4567',
    bookingDate: 'Monday, March 10, 2026',
    bookingTime: '14:00',
    notes: 'I need help with pest management on my tomato plants',
  }
}

console.log('🔔 BOOKING NOTIFICATION EMAIL (to Expert)')
console.log('='.repeat(80))
console.log(`To: ${expertNotification.to}`)
console.log(`Subject: ${expertNotification.subject}`)
console.log('-'.repeat(80))
console.log(`
New Booking!

Hi ${expertNotification.data.expertName},

Customer: ${expertNotification.data.customerName}
Email: ${expertNotification.data.customerEmail}
Phone: ${expertNotification.data.customerPhone}
Date: ${expertNotification.data.bookingDate}
Time: ${expertNotification.data.bookingTime}
${expertNotification.data.notes ? `Notes: ${expertNotification.data.notes}` : ''}
`)
console.log('='.repeat(80) + '\n')

// Simulate admin notification
const adminNotification = {
  to: 'felix@felixseeger.de',
  subject: 'New Booking: Jane Smith with John Doe',
  template: 'booking_notification_admin',
  data: {
    bookingId: '123',
    expertName: 'John Doe',
    customerName: 'Jane Smith',
    customerEmail: 'customer@example.com',
    customerPhone: '+1 (555) 123-4567',
    bookingDate: 'Monday, March 10, 2026',
    bookingTime: '14:00',
    notes: 'I need help with pest management on my tomato plants',
  }
}

console.log('👨‍💼 BOOKING NOTIFICATION EMAIL (to Admin)')
console.log('='.repeat(80))
console.log(`To: ${adminNotification.to}`)
console.log(`Subject: ${adminNotification.subject}`)
console.log('-'.repeat(80))
console.log(`
New Booking: ${adminNotification.data.customerName} with ${adminNotification.data.expertName} on ${adminNotification.data.bookingDate} at ${adminNotification.data.bookingTime}

Booking ID: ${adminNotification.data.bookingId}
Expert: ${adminNotification.data.expertName}
Customer: ${adminNotification.data.customerName}
Email: ${adminNotification.data.customerEmail}
Phone: ${adminNotification.data.customerPhone}
Date: ${adminNotification.data.bookingDate}
Time: ${adminNotification.data.bookingTime}
${adminNotification.data.notes ? `Notes: ${adminNotification.data.notes}` : ''}
`)
console.log('='.repeat(80) + '\n')

console.log('✅ Email templates are ready!')
console.log('\nCurrent status:')
console.log('  • Templates: ✅ Created (7 templates)')
console.log('  • Mock mode: ✅ Working (logs to console)')
console.log('  • Real emails: ⏳ Need RESEND_API_KEY in .env.local')
console.log('\nSee EMAIL_SETUP.md for setup instructions.\n')
