import { NextResponse } from 'next/server'
import { sendEmail, EmailTemplateType } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { to, subject, templateType, data } = await request.json()

    if (!to || !subject || !templateType) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, templateType' },
        { status: 400 }
      )
    }

    const result = await sendEmail({
      to,
      subject,
      templateType: templateType as EmailTemplateType,
      data: data || {},
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Email API route error:', error)
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 })
  }
}
