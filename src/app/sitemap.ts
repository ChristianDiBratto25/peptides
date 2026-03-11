import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peptidedirectory.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  entries.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  )

  // Peptides
  const { data: peptides } = await supabase.from('peptides').select('slug, updated_at').eq('status', 'published')
  for (const p of peptides || []) {
    entries.push({ url: `${SITE_URL}/peptides/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'weekly', priority: 0.8 })
  }

  // Clinics
  const { data: clinics } = await supabase.from('clinics').select('slug, updated_at').eq('status', 'published')
  for (const c of clinics || []) {
    entries.push({ url: `${SITE_URL}/clinics/${c.slug}`, lastModified: new Date(c.updated_at), changeFrequency: 'weekly', priority: 0.7 })
  }

  // Goals
  const { data: goals } = await supabase.from('goals').select('slug, updated_at').eq('status', 'published')
  for (const g of goals || []) {
    entries.push({ url: `${SITE_URL}/goals/${g.slug}`, lastModified: new Date(g.updated_at), changeFrequency: 'weekly', priority: 0.7 })
  }

  // CMS Pages (learn, compare) — only indexed ones
  const { data: pages } = await supabase.from('pages').select('slug, page_type, updated_at, noindex').eq('status', 'published').eq('noindex', false)
  for (const page of pages || []) {
    const pathMap: Record<string, string> = {
      learn: '/learn/',
      compare: '/compare/',
    }
    const prefix = pathMap[page.page_type]
    if (prefix) {
      entries.push({ url: `${SITE_URL}${prefix}${page.slug}`, lastModified: new Date(page.updated_at), changeFrequency: 'monthly', priority: 0.6 })
    }
  }

  // City pages from locations
  const { data: locations } = await supabase.from('locations').select('city').neq('city', null)
  const cities = [...new Set((locations || []).map((l) => l.city.toLowerCase().replace(/\s+/g, '-')))]
  for (const city of cities) {
    entries.push({ url: `${SITE_URL}/clinics/city/${city}`, changeFrequency: 'weekly', priority: 0.6 })
  }

  return entries
}
