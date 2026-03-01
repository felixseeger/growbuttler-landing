import { getAuthenticatedUser } from './auth'

export async function getJournalEntries() {
  const user = await getAuthenticatedUser()
  if (!user) return null

  const backendUrl = process.env.BACKEND_URL
  if (!backendUrl) return null

  // Fetch all journal entries for the user with embedded media
  const res = await fetch(
    `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) return null

  const entries = await res.json()

  // Transform entries
  return entries.map((entry: any) => {
    const acf = entry.acf || {}
    let imageUrl = null
    const featuredMedia = (entry._embedded as any)?.['wp:featuredmedia']
    if (featuredMedia?.[0]?.source_url) {
      imageUrl = featuredMedia[0].source_url
    }

    return {
      id: entry.id,
      date: entry.date,
      title: entry.title?.rendered || '',
      content: entry.content?.rendered || '',
      imageUrl,
      acf: {
        plant_name: acf.plant_name,
        day_number: acf.day_number,
        week_number: acf.week_number,
        stage: acf.stage,
        entry_type: acf.entry_type,
        temperature_fahrenheit: acf.temperature_fahrenheit,
        humidity_percent: acf.humidity_percent,
        nutrient_mix: acf.nutrient_mix,
        ph_level: acf.ph_level,
      },
    }
  })
}
