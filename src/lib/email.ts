import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export type EmailTemplateType =
  | 'welcome'
  | 'password_reset'
  | 'expert_application_received'
  | 'expert_application_admin'
  | 'expert_approved'
  | 'booking_confirmation_customer'
  | 'booking_notification_expert'
  | 'booking_notification_admin'

interface EmailParams {
  to: string
  subject: string
  templateType: EmailTemplateType
  data?: Record<string, any>
}

function getEmailTemplate(
  templateType: EmailTemplateType,
  data: Record<string, any>
): { html: string; text: string } {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://growbuttler.felixseeger.de'
  
  switch (templateType) {
    case 'welcome':
      return {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h1 style="color: #13ec3b;">Welcome to GrowButtler, ${data.name}!</h1>
            <p>Your account has been created successfully.</p>
            <p>You can now access your cultivation journal, find expert mentors, and track your plants.</p>
            <div style="margin: 30px 0;">
              <a href="${baseUrl}/dashboard" style="background: #13ec3b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Happy growing!<br/>The GrowButtler Team</p>
          </div>
        `,
        text: `Welcome to GrowButtler, ${data.name}!\n\nYour account has been created successfully.\n\nGo to: ${baseUrl}/dashboard`,
      }

    case 'password_reset':
      return {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h1 style="color: #13ec3b;">Reset Your Password</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password for your GrowButtler account.</p>
            <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
            <div style="margin: 30px 0;">
              <a href="${baseUrl}/reset-password?token=${data.token}&email=${encodeURIComponent(data.email)}" style="background: #13ec3b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
          </div>
        `,
        text: `Reset Your Password\n\nHello,\n\nWe received a request to reset your password for your GrowButtler account.\n\nReset your password here: ${baseUrl}/reset-password?token=${data.token}&email=${encodeURIComponent(data.email)}\n\nIf you didn't request this, you can safely ignore this email.`,
      }

    case 'expert_application_received':
      return {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h1 style="color: #13ec3b;">Application Received</h1>
            <p>Dear ${data.name},</p>
            <p>Thank you for applying to become a master grower on GrowButtler!</p>
            <p>We received your application on ${data.applicationDate}. Our team is reviewing your portfolio now.</p>
            <p><strong>Next Step:</strong> We will contact you shortly to schedule your mandatory video interview with one of our master experts.</p>
            <div style="margin: 30px 0;">
              <a href="${baseUrl}/login" style="background: #13ec3b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Check Status</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
          </div>
        `,
        text: `Dear ${data.name},\n\nThank you for applying to become a master grower on GrowButtler!\n\nWe received your application on ${data.applicationDate}. Next step: Video interview.\n\nCheck status: ${baseUrl}/login`,
      }

    case 'expert_application_admin':
      return {
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb;">
            <h2>New Expert Application</h2>
            <p><strong>Name:</strong> ${data.applicantName}</p>
            <p><strong>Email:</strong> ${data.applicantEmail}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Experience:</strong> ${data.experience}</p>
            <p><strong>Specializations:</strong> ${data.specializations}</p>
            <p><strong>Rate:</strong> €${data.serviceRate}/hr</p>
            <p><strong>Available for Interview:</strong> ${data.availableInterviewTimes}</p>
            <p><strong>Portfolio:</strong> ${data.portfolioImagesCount} images</p>
            <hr/>
            <a href="${process.env.BACKEND_URL}/wp-admin/users.php">Review in WordPress</a>
          </div>
        `,
        text: `New Expert Application: ${data.applicantName} (${data.location}). Review in WP: ${process.env.BACKEND_URL}/wp-admin/users.php`,
      }

    case 'expert_approved':
      return {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h1 style="color: #13ec3b;">🎉 Welcome to the Expert Network!</h1>
            <p>Dear ${data.name},</p>
            <p>Congratulations! Your expert application has been approved.</p>
            <p>Your profile is now live and visible to growers looking for mentorship.</p>
            <div style="margin: 30px 0;">
              <a href="${baseUrl}/expert/${data.expertId}" style="background: #13ec3b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Your Profile</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
          </div>
        `,
        text: `Congratulations! Your expert application has been approved.\n\nYour profile is now live: ${baseUrl}/expert/${data.expertId}`,
      }

    case 'booking_confirmation_customer':
      return {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h1 style="color: #13ec3b;">🗓️ Booking Confirmed!</h1>
            <p>Hi ${data.customerName},</p>
            <p>Your consultation with <strong>${data.expertName}</strong> has been confirmed.</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${data.bookingDate}</p>
              <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${data.bookingTime}</p>
              <p style="margin: 5px 0;"><strong>👤 Expert:</strong> ${data.expertName}</p>
              ${data.notes ? `<p style="margin: 5px 0;"><strong>📝 Notes:</strong> ${data.notes}</p>` : ''}
            </div>
            <p>You'll receive a reminder 24 hours before your consultation.</p>
            <div style="margin: 30px 0;">
              <a href="${baseUrl}/dashboard" style="background: #13ec3b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Dashboard</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
          </div>
        `,
        text: `Booking Confirmed!\n\nHi ${data.customerName},\n\nYour consultation with ${data.expertName} has been confirmed.\n\nDate: ${data.bookingDate}\nTime: ${data.bookingTime}\n\nView dashboard: ${baseUrl}/dashboard`,
      }

    case 'booking_notification_expert':
      return {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h1 style="color: #13ec3b;">📅 New Booking</h1>
            <p>Hi ${data.expertName},</p>
            <p>You have a new consultation booking!</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>👤 Customer:</strong> ${data.customerName}</p>
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> ${data.customerEmail}</p>
              <p style="margin: 5px 0;"><strong>📞 Phone:</strong> ${data.customerPhone}</p>
              <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${data.bookingDate}</p>
              <p style="margin: 5px 0;"><strong>🕐 Time:</strong> ${data.bookingTime}</p>
              ${data.notes ? `<p style="margin: 10px 0 5px;"><strong>📝 Customer Notes:</strong><br/>${data.notes}</p>` : ''}
            </div>
            <p>Please reach out to confirm the consultation details.</p>
            <p style="color: #6b7280; font-size: 14px;">Best regards,<br/>The GrowButtler Team</p>
          </div>
        `,
        text: `New Booking!\n\nHi ${data.expertName},\n\nCustomer: ${data.customerName}\nEmail: ${data.customerEmail}\nPhone: ${data.customerPhone}\nDate: ${data.bookingDate}\nTime: ${data.bookingTime}\n${data.notes ? `Notes: ${data.notes}` : ''}`,
      }

    case 'booking_notification_admin':
      return {
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb;">
            <h2>New Booking Created</h2>
            <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            <p><strong>Expert:</strong> ${data.expertName}</p>
            <p><strong>Customer:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Phone:</strong> ${data.customerPhone}</p>
            <p><strong>Date:</strong> ${data.bookingDate}</p>
            <p><strong>Time:</strong> ${data.bookingTime}</p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
            <hr/>
            <a href="${process.env.BACKEND_URL}/wp-admin/edit.php?post_type=booking">View in WordPress</a>
          </div>
        `,
        text: `New Booking: ${data.customerName} with ${data.expertName} on ${data.bookingDate} at ${data.bookingTime}`,
      }

    default:
      return {
        html: '<p>GrowButtler notification</p>',
        text: 'GrowButtler notification',
      }
  }
}

export async function sendEmail({ to, subject, templateType, data = {} }: EmailParams) {
  const { html, text } = getEmailTemplate(templateType, data)

  if (!resend) {
    console.log('\n' + '='.repeat(80))
    console.log('📧 EMAIL MOCK MODE (RESEND_API_KEY not configured)')
    console.log('='.repeat(80))
    console.log(`📨 To: ${to}`)
    console.log(`📋 Subject: ${subject}`)
    console.log(`🏷️  Template: ${templateType}`)
    console.log('-'.repeat(80))
    console.log('📝 Plain Text Content:')
    console.log(text)
    console.log('-'.repeat(80))
    console.log('💡 To send real emails, add RESEND_API_KEY to .env.local')
    console.log('   See EMAIL_SETUP.md for instructions')
    console.log('='.repeat(80) + '\n')
    return { success: true, mocked: true }
  }

  // Use onboarding@resend.dev as fallback if domain is not verified
  // Once domain is verified, use noreply@felixseeger.de
  const from = process.env.EMAIL_FROM || 'GrowButtler <onboarding@resend.dev>'

  try {
    const { data: resendData, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: resendData?.id }
  } catch (error: any) {
    console.error('Email sending exception:', error)
    return { success: false, error: error.message }
  }
}
