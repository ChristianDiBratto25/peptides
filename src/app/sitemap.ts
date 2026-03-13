import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const SITE_URL = 'https://peptideindex.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()

  // Fetch all published entities for dynamic pages
  const [peptidesRes, goalsRes, learnPagesRes, cityPagesRes] = await Promise.all([
    supabase.from('peptides').select('slug, updated_at').eq('status', 'published'),
    supabase.from('goals').select('slug, updated_at').eq('status', 'published'),
    supabase.from('pages').select('slug, updated_at, canonical_url').eq('page_type', 'learn').eq('status', 'published'),
    supabase.from('pages').select('slug, updated_at').eq('page_type', 'city').eq('status', 'published'),
  ])

  const peptides = peptidesRes.data || []
  const goals = goalsRes.data || []
  const learnPages = learnPagesRes.data || []
  const cityPages = cityPagesRes.data || []

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/peptides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/clinics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/goals`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/learn`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]

  // Dynamic peptide pages
  const peptidePages: MetadataRoute.Sitemap = peptides.map((p) => ({
    url: `${SITE_URL}/peptides/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dynamic goal pages
  const goalPages: MetadataRoute.Sitemap = goals.map((g) => ({
    url: `${SITE_URL}/goals/${g.slug}`,
    lastModified: new Date(g.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic city pages
  const cityPageUrls: MetadataRoute.Sitemap = cityPages.map((p) => ({
    url: `${SITE_URL}/clinics/city/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic learn pages (includes legal pages stored as page_type='learn' with canonical_url)
  const learnPageUrls: MetadataRoute.Sitemap = learnPages.map((p) => ({
    url: p.canonical_url || `${SITE_URL}/learn/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...peptidePages,
    ...goalPages,
    ...cityPageUrls,
    ...learnPageUrls,
  ]
}
