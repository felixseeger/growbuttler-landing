export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'

const WORDPRESS_API = process.env.WORDPRESS_API_URL || 'https://growbuttler-back.felixseeger.de/wp-json'
const APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expertId = params.id

    const url = `${WORDPRESS_API}/wp/v2/experts/${expertId}?_embed`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`felix:${APP_PASSWORD}`).toString('base64')}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Expert not found' }, { status: 404 })
      }
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const expert = await response.json()

    // Transform to frontend format with all details
    const transformedExpert = {
      id: expert.id,
      name: expert.acf?.name || expert.title?.rendered || 'Unknown Expert',
      title: expert.acf?.title || 'Master Grower',
      experience: expert.acf?.years_experience || '5+ Years',
      rating: parseFloat(expert.acf?.rating || '4.5'),
      reviews: parseInt(expert.acf?.reviews_count || '12', 10),
      consultations: parseInt(expert.acf?.consultations_count || '25', 10),
      bio: expert.content?.rendered || expert.acf?.bio || 'No bio available yet. This expert is a certified GrowButtler master grower specializing in various cultivation techniques.',
      image: expert.acf?.photo || expert._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
      specialties: expert.acf?.specializations
        ? (typeof expert.acf.specializations === 'string'
            ? expert.acf.specializations.split(',').map((s: string) => s.trim())
            : expert.acf.specializations)
        : ['Cultivation', 'Optimization'],
      location: expert.acf?.location || 'Berlin, Germany',
      phone: expert.acf?.phone || null,
      email: expert.acf?.email || null,
      pricePerSession: parseInt(expert.acf?.service_rate || expert.acf?.price_per_session || '50', 10),
      sessionDuration: parseInt(expert.acf?.session_duration || '60', 10),
      availability: expert.acf?.availability || 'Contact for availability',
      isVerified: !!expert.acf?.is_verified,
      isFeatured: !!expert.acf?.is_featured,
      isOnline: !!expert.acf?.is_online,
      certifications: expert.acf?.certifications || '',
      preferredMethods: expert.acf?.preferred_methods
        ? (typeof expert.acf.preferred_methods === 'string'
            ? expert.acf.preferred_methods.split(',').map((s: string) => s.trim())
            : expert.acf.preferred_methods)
        : [],
      portfolioImages: expert.acf?.portfolio_images || [],
      successStories: expert.acf?.success_stories || '',
      services: expert.acf?.services || [
        {
          id: '1',
          icon: 'query_stats',
          title: 'Quick Diagnosis',
          description: 'Photo review & analysis',
          price: `€${expert.acf?.service_rate || 15}`,
          unit: 'Per task',
        },
        {
          id: '2',
          icon: 'videocam',
          title: 'Video Consultation',
          description: '1:1 Session via video',
          price: `€${expert.acf?.service_rate || 45}`,
          unit: `/ ${expert.acf?.session_duration || 60} min`,
        }
      ]
    }

    return NextResponse.json({ expert: transformedExpert })
  } catch (error: any) {
    console.error('Error fetching expert:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expert details' },
      { status: 500 }
    )
  }
}
