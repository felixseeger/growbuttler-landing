import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      expertId,
      serviceId,
      date,
      time,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = body

    // Validate required fields
    if (!expertId || !serviceId || !date || !time || !customerName || !customerEmail || !customerPhone) {
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

    const auth = Buffer.from(`${username}:${appPassword.replace(/\s+/g, '')}`).toString('base64')

    // Fetch expert details
    const expertResponse = await fetch(`${backendUrl}/wp-json/wp/v2/experts/${expertId}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    })

    if (!expertResponse.ok) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      )
    }

    const expert = await expertResponse.json()
    const expertName = expert.acf?.name || expert.title?.rendered || 'Unknown Expert'
    const expertEmail = expert.acf?.email || null

    // Create booking as custom post type in WordPress
    const bookingDate = new Date(date)
    const bookingTitle = `${customerName} - ${expertName} - ${bookingDate.toLocaleDateString()}`

    const bookingData = {
      title: bookingTitle,
      status: 'publish',
      type: 'booking', // Custom post type
      meta: {
        expert_id: expertId,
        service_id: serviceId,
        booking_date: bookingDate.toISOString().split('T')[0],
        booking_time: time,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        notes: notes || '',
        status: 'pending', // pending, confirmed, completed, cancelled
        created_at: new Date().toISOString(),
      },
    }

    // Create booking in WordPress
    const createResponse = await fetch(`${backendUrl}/wp-json/wp/v2/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(bookingData),
    })

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      console.error('Failed to create booking:', errorData)
      return NextResponse.json(
        { error: 'Failed to create booking in system' },
        { status: 500 }
      )
    }

    const booking = await createResponse.json()

    // Send confirmation email to customer
    await sendEmail({
      to: customerEmail,
      subject: `Booking Confirmed: Consultation with ${expertName}`,
      templateType: 'booking_confirmation_customer',
      data: {
        customerName,
        expertName,
        bookingDate: bookingDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        bookingTime: time,
        notes: notes || 'No additional notes',
      },
    })

    // Send notification email to expert
    if (expertEmail) {
      await sendEmail({
        to: expertEmail,
        subject: `New Booking: ${customerName} - ${bookingDate.toLocaleDateString()}`,
        templateType: 'booking_notification_expert',
        data: {
          expertName,
          customerName,
          customerEmail,
          customerPhone,
          bookingDate: bookingDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          bookingTime: time,
          notes: notes || 'No additional notes',
        },
      })
    }

    // Send notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'felixseeger@googlemail.com',
      subject: `New Booking: ${customerName} with ${expertName}`,
      templateType: 'booking_notification_admin',
      data: {
        bookingId: booking.id,
        expertName,
        customerName,
        customerEmail,
        customerPhone,
        bookingDate: bookingDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        bookingTime: time,
        notes: notes || 'No additional notes',
      },
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        expertName,
        date: bookingDate.toISOString(),
        time,
        status: 'pending',
      },
      message: 'Booking created successfully',
    })
  } catch (error: any) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
