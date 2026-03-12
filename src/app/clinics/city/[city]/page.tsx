import { createClient } from '@/lib/supabase/server'
import { buildMetadata, buildMedicalWebPageJsonLd } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import ClinicCard from '@/components/public/ClinicCard'
import FaqSection from '@/components/public/FaqSection'
import { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import PageContent from '@/components/public/PageContent'
import RelatedEntities from '@/components/public/RelatedEntities'
import type { Clinic, Location, Peptide, Goal } from '@/lib/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const supabase = await createClient()
  const { data: page } = await supabase
    .from('pages')
    .select('title, meta_description, noindex, canonical_url')
    .eq('slug', city)
    .eq('page_type', 'city')
    .eq('status', 'published')
    .single()

  return buildMetadata({
    title: page?.title || `Peptide Clinics in ${cityName}`,
    description: page?.meta_description || `Find verified peptide therapy clinics in ${cityName}. Compare providers, services, and locations.`,
    path: `/clinics/city/${city}`,
    noindex: page?.noindex || false,
    canonical: page?.canonical_url || undefined,
  })
}

export default async function CityClinicPage({ params }: Props) {
  const { city } = await params
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const supabase = await createClient()

  // Fetch CMS page, clinics, and related data in parallel
  const [locationDataRes, pageRes, peptidesRes, goalsRes] = await Promise.all([
    supabase.from('locations').select('clinic_id, city, state').ilike('city', cityName),
    supabase.from('pages').select('*').eq('slug', city).eq('page_type', 'city').eq('status', 'published').single(),
    supabase.from('peptides').select('id, name, slug, summary').eq('status', 'published').order('name').limit(10),
    supabase.from('goals').select('id, name, slug, description').eq('status', 'published').order('name').limit(10),
  ])

  const page = pageRes.data
  const peptides = (peptidesRes.data || []) as Pick<Peptide, 'id' | 'name' | 'slug' | 'summary'>[]
  const goals = (goalsRes.data || []) as Pick<Goal, 'id' | 'name' | 'slug' | 'description'>[]

  // Find clinics in this city
  const clinicIds = [...new Set((locationDataRes.data || []).map((l) => l.clinic_id))]
  let clinics: (Clinic & { locations: Location[] })[] = []
  if (clinicIds.length > 0) {
    const { data } = await supabase
      .from('clinics')
      .select('*, locations(*)')
      .in('id', clinicIds)
      .eq('status', 'published')
    clinics = (data || []) as (Clinic & { locations: Location[] })[]
  }

  // Fetch FAQs if page exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let faqs: any[] = []
  if (page) {
    const { data } = await supabase.from('faqs').select('*').eq('page_id', page.id).order('sort_order')
    faqs = data || []
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Clinics', href: '/clinics' },
        { label: cityName, href: `/clinics/city/${city}` },
      ]} />

      <JsonLd data={buildMedicalWebPageJsonLd({
        title: `Peptide Clinics in ${cityName}`,
        description: page?.meta_description || `Find peptide therapy clinics in ${cityName}.`,
        url: `/clinics/city/${city}`,
        lastReviewed: page?.last_reviewed_at || undefined,
      })} />

      <DefaultMedicalDisclaimer />

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">Peptide Clinics in {cityName}</h1>

      {/* CMS intro content */}
      {page?.content && Object.keys(page.content).length > 0 && (
        <div className="mb-10">
          <PageContent content={page.content} />
        </div>
      )}

      {!page?.content && (
        <p className="text-[15px] text-gray-400 mb-10">
          Browse {clinics.length} peptide therapy {clinics.length === 1 ? 'clinic' : 'clinics'} in {cityName}.
        </p>
      )}

      {/* Clinic Listings */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-gray-900 mb-5">Clinics in {cityName}</h2>
        {clinics.length === 0 ? (
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-10 text-center">
            <p className="text-gray-400">No clinics listed in {cityName} yet.</p>
            <p className="text-[13px] text-gray-300 mt-2">Check back soon as we continue adding verified clinics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        )}
      </section>

      {/* Internal Links — Peptides */}
      <RelatedEntities
        title="Popular Peptides"
        items={peptides.map((p) => ({ name: p.name, slug: p.slug, href: `/peptides/${p.slug}`, description: p.summary }))}
      />

      {/* Internal Links — Goals */}
      <RelatedEntities
        title="Browse by Goal"
        items={goals.map((g) => ({ name: g.name, slug: g.slug, href: `/goals/${g.slug}`, description: g.description }))}
      />

      {/* FAQs */}
      <FaqSection faqs={faqs} />

      {/* Last reviewed */}
      {page?.last_reviewed_at && (
        <p className="text-xs text-gray-400 mt-8">
          Last reviewed: {new Date(page.last_reviewed_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
