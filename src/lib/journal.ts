import { getAuthenticatedUser, TokenPayload } from './auth'

interface Plant {
  id: string
  name: string
  strain?: string
  location?: string
  stage: string
  dayNumber: number
  weekNumber: number
  imageUrl?: string | null
  lastUpdated?: string
}

async function getAuthUser() {
  return await getAuthenticatedUser()
}

export async function getJournalEntries() {
  const user = await getAuthUser()
  if (!user) return null

  const backendUrl = process.env.BACKEND_URL
  if (!backendUrl) return null

  const res = await fetch(
    `${backendUrl}/wp-json/wp/v2/journal_entries?author=${user.userId}&per_page=100&orderby=date&order=desc&_embed=wp:featuredmedia`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) return null

  const entries = await res.json()

  type JournalEntry = {
    id: number
    date: string
    title: { rendered: string }
    content: { rendered: string }
    _embedded?: Record<string, any>
    acf: Record<string, any>
  }

  return (entries as JournalEntry[]).map((entry) => {
    let imageUrl: string | null = null
    const featuredMedia = entry._embedded?.['wp:featuredmedia']
    if (featuredMedia?.[0]?.source_url) {
      imageUrl = featuredMedia[0].source_url
    }

    return {
      id: entry.id,
      date: entry.date,
      title: entry.title.rendered,
      content: entry.content.rendered,
      imageUrl,
      acf: {
        plant_id: entry.acf.plant_id,
        plant_name: entry.acf.plant_name,
        day_number: entry.acf.day_number,
        week_number: entry.acf.week_number,
        stage: entry.acf.stage,
        entry_type: entry.acf.entry_type,
        temperature_fahrenheit: entry.acf.temperature_fahrenheit,
        humidity_percent: entry.acf.humidity_percent,
        nutrient_mix: entry.acf.nutrient_mix,
        ph_level: entry.acf.ph_level,
      },
    }
  })
}

export async function getJournalEntriesForPlant(plantId: string) {
  const allEntries = await getJournalEntries()
  if (!allEntries) return []

  return allEntries
    .filter((entry) => entry.acf?.plant_id === plantId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPlantById(plantId: string) {
  const plants = await getPlants()
  return plants.find((p) => p.id === plantId) || null
}

export async function getPlants(): Promise<Plant[]> {
  const response = await fetch('/api/plants', { next: { revalidate: 60 } })
  if (!response.ok) return []
  const data = await response.json()
  return (data.plants || []) as Plant[]
}
