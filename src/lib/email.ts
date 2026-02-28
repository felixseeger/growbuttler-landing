import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export type EmailTemplateType = 'welcome' | 'expert_application_received' | 'expert_application_admin' | 'expert_approved'

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

    default:
      return {
        html: '<p>GrowButtler notification</p>',
        text: 'GrowButtler notification',
      }
  }
}

export async function sendEmail({ to, subject, templateType, data = {} }: EmailParams) {
  if (!resend) {
    console.log('--- EMAIL MOCK (NO API KEY) ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log('------------------------------')
    return { success: true, mocked: true }
  }

  const { html, text } = getEmailTemplate(templateType, data)

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
