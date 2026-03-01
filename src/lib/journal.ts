import { getAuthenticatedUser } from './auth'

export async function getJournalEntries() {
  const user = await getAuthenticatedUser()
  if (!user) return null

  const backendUrl = process.env.BACKEND_URL
  if (!backendUrl) return null

  const res = await fetch(
    `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) return null

  const entries = await res.json()

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
        plant_id: acf.plant_id,
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

export async function getJournalEntriesForPlant(plantId: string) {
  const allEntries = await getJournalEntries()
  if (!allEntries) return []

  // Filter by plant_id, sort by date descending
  return allEntries
    .filter((entry) => entry.acf?.plant_id === plantId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPlantById(plantId: string) {
  // For now, read from plants API which returns plants map
  // In future, could cache plants per user
  const plants = await getPlants()
  return plants.find((p) => p.id === plantId) || null
}

export async function getPlants() {
  // Use the existing plants API client-side
  const response = await fetch('/api/plants')
  if (!response.ok) return []
  const data = await response.json()
  return data.plants || []
}
