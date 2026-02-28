import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Extract form data
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const phone = formData.get('phone') as string
    const location = formData.get('location') as string
    const specialization = JSON.parse(formData.get('specialization') as string)
    const bio = formData.get('bio') as string
    const yearsExperience = formData.get('yearsExperience') as string
    const certifications = formData.get('certifications') as string
    const previousClients = formData.get('previousClients') as string
    const preferredMethods = JSON.parse(formData.get('preferredMethods') as string)
    const serviceRate = formData.get('serviceRate') as string
    const successStories = formData.get('successStories') as string
    const availableTimes = JSON.parse(formData.get('availableTimes') as string)

    // Get portfolio images
    const portfolioFiles = formData.getAll('portfolioImages') as File[]

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL
    const username = process.env.WORDPRESS_USERNAME
    const appPassword = process.env.APPLICATION_PASSWORD

    if (!backendUrl || !username || !appPassword) {
      return NextResponse.json(
        { error: 'Backend configuration missing' },
        { status: 500 }
      )
    }

    // Create WordPress user with expert_applicant role
    const wpUser = {
      username: email,
      name: name,
      email: email,
      password: password,
      roles: ['expert_applicant'], // Custom role for pending experts
    }

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    // Step 1: Create user
    const userResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(wpUser),
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: userData.message || 'Failed to create user account' },
        { status: userResponse.status }
      )
    }

    const userId = userData.id

    // Step 2: Store expert application data as user meta
    const expertMetaData = {
      phone,
      location,
      specialization: specialization.join(','),
      bio,
      years_experience: yearsExperience,
      certifications,
      previous_clients: previousClients,
      preferred_methods: preferredMethods.join(','),
      service_rate: serviceRate,
      success_stories: successStories,
      available_interview_times: availableTimes.join(','),
      application_status: 'pending_review',
      application_date: new Date().toISOString(),
      portfolio_image_count: portfolioFiles.length,
    }

    // Update user meta
    const metaResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        meta: expertMetaData,
      }),
    })

    if (!metaResponse.ok) {
      console.error('Failed to store expert metadata')
    }

    // Step 3: Send confirmation email to applicant
    await sendEmail({
      to: email,
      subject: 'Expert Application Received - GrowButtler',
      templateType: 'expert_application_received',
      data: {
        name,
        applicationDate: new Date().toLocaleDateString('de-DE'),
      },
    })

    // Step 4: Send notification to admin
    await sendEmail({
      to: 'felix@felixseeger.de',
      subject: `New Expert Application: ${name} (${location})`,
      templateType: 'expert_application_admin',
      data: {
        applicantName: name,
        applicantEmail: email,
        location,
        experience: yearsExperience,
        specializations: specialization.join(', '),
        serviceRate,
        availableInterviewTimes: availableTimes.join(', '),
        portfolioImagesCount: portfolioFiles.length,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        status: 'pending_review',
      },
      message: 'Application submitted successfully. Check your email for confirmation.',
    })
  } catch (error: any) {
    console.error('Expert application error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
