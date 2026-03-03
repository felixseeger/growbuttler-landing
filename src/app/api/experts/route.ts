import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const WORDPRESS_API = process.env.WORDPRESS_API_URL || 'https://growbuttler-back.felixseeger.de/wp-json'
const APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    
    let url = `${WORDPRESS_API}/wp/v2/experts?per_page=50&_embed`
    if (featured === 'true') {
      url += '&meta_key=is_featured&meta_value=1'
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`felix:${APP_PASSWORD}`).toString('base64')}`,
      },
    })

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }

    const experts = await response.json()

    // Transform to frontend format
    const transformedExperts = experts.map((expert: any) => ({
      id: expert.id,
      name: expert.acf?.name || expert.title?.rendered || 'Unknown Expert',
      title: expert.acf?.title || 'Master Grower',
      yearsExperience: expert.acf?.years_experience || 5,
      specializations: expert.acf?.specializations || '',
      pricePerSession: expert.acf?.price_per_session || 50,
      sessionDuration: expert.acf?.session_duration || 60,
      availability: expert.acf?.availability || 'Available this week',
      isFeatured: expert.acf?.is_featured || false,
      isOnline: expert.acf?.is_online || false,
      photoUrl: expert.acf?.photo || null,
      bio: expert.content?.rendered || '',
    }))

    return NextResponse.json({ experts: transformedExperts })
  } catch (error: any) {
    console.error('Error fetching experts:', error)
    return NextResponse.json({ error: 'Failed to fetch experts' }, { status: 500 })
  }
}
