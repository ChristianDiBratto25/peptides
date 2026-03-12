import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata, buildOrganizationJsonLd } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import FaqSection from '@/components/public/FaqSection'
import CitationList from '@/components/public/CitationList'
import { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import RelatedEntities from '@/components/public/RelatedEntities'
import PageContent from '@/components/public/PageContent'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: clinic } = await supabase.from('clinics').select('name, description').eq('slug', slug).eq('status', 'published').single()
  if (!clinic) return {}

  const { data: page } = await supabase.from('pages').select('title, meta_description, noindex, canonical_url').eq('slug', slug).eq('page_type', 'clinic').eq('status', 'published').single()

  return buildMetadata({
    title: page?.title || `${clinic.name} — Peptide Clinic`,
    description: page?.meta_description || clinic.description || `${clinic.name} offers peptide therapy services.`,
    path: `/clinics/${slug}`,
    noindex: page?.noindex || false,
    canonical: page?.canonical_url || undefined,
  })
}

export default async function ClinicPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: clinic } = await supabase
    .from('clinics')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!clinic) notFound()

  const [locationsRes, providersRes, peptidesRes, pageRes] = await Promise.all([
    supabase.from('locations').select('*').eq('clinic_id', clinic.id),
    supabase.from('clinic_providers').select('provider:providers(*)').eq('clinic_id', clinic.id),
    supabase.from('clinic_peptides').select('peptide:peptides(id, name, slug, summary)').eq('clinic_id', clinic.id),
    supabase.from('pages').select('*').eq('slug', slug).eq('page_type', 'clinic').eq('status', 'published').single(),
  ])

  const locations = locationsRes.data || []
  const providers = (providersRes.data || []).map((r: Record<string, unknown>) => r.provider).filter(Boolean) as { id: string; name: string; slug: string; credentials: string | null; title: string | null }[]
  const peptides = (peptidesRes.data || []).map((r: Record<string, unknown>) => r.peptide).filter(Boolean) as { id: string; name: string; slug: string; summary: string | null }[]
  const page = pageRes.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let faqs: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pageSources: any[] = []

  if (page) {
    const [faqRes, sourceRes] = await Promise.all([
      supabase.from('faqs').select('*').eq('page_id', page.id).order('sort_order'),
      supabase.from('page_sources').select('*, source:sources(*)').eq('page_id', page.id).order('citation_index'),
    ])
    faqs = faqRes.data || []
    pageSources = sourceRes.data || []
  }

  const primaryLocation = locations[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Clinics', href: '/clinics' },
        { label: clinic.name, href: `/clinics/${slug}` },
      ]} />

      <JsonLd data={buildOrganizationJsonLd({
        name: clinic.name,
        url: clinic.website || undefined,
        description: clinic.description || undefined,
        phone: clinic.phone || undefined,
        address: primaryLocation ? {
          street: primaryLocation.address || undefined,
          city: primaryLocation.city,
          state: primaryLocation.state || undefined,
          zip: primaryLocation.zip || undefined,
          country: primaryLocation.country,
        } : undefined,
      })} />

      <DefaultMedicalDisclaimer />

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900">{clinic.name}</h1>
          {clinic.verified && (
            <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-semibold uppercase tracking-wide rounded-full border border-emerald-100">
              Verified Clinic
            </span>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5 mb-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {clinic.phone && (
          <div>
            <span className="text-[11px] text-gray-400 uppercase tracking-[0.1em] font-medium">Phone</span>
            <p className="font-medium text-gray-900 mt-0.5">{clinic.phone}</p>
          </div>
        )}
        {clinic.website && (
          <div>
            <span className="text-[11px] text-gray-400 uppercase tracking-[0.1em] font-medium">Website</span>
            <p className="mt-0.5">
              <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#7f21f6] hover:text-[#5a0fc0] transition-colors">
                Visit Website
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2h6v6M10 2L4 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </a>
            </p>
          </div>
        )}
        {clinic.email && (
          <div>
            <span className="text-[11px] text-gray-400 uppercase tracking-[0.1em] font-medium">Email</span>
            <p className="font-medium text-gray-900 mt-0.5">{clinic.email}</p>
          </div>
        )}
      </div>

      {clinic.description && (
        <p className="text-[15px] text-gray-600 leading-relaxed mb-10">{clinic.description}</p>
      )}

      {page?.content && Object.keys(page.content).length > 0 && (
        <PageContent content={page.content} />
      )}

      {/* Locations */}
      {locations.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl text-gray-900 mb-5">Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {locations.map((loc) => (
              <div key={loc.id} className="border border-gray-100 rounded-xl p-5">
                {loc.address && <p className="font-medium text-gray-900">{loc.address}</p>}
                <p className="text-[13px] text-gray-500 mt-1">
                  {[loc.city, loc.state, loc.zip].filter(Boolean).join(', ')}
                </p>
                <p className="text-gray-300 text-[12px] mt-0.5">{loc.country}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Providers */}
      {providers.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl text-gray-900 mb-5">Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providers.map((p) => (
              <div key={p.id} className="border border-gray-100 rounded-xl p-5">
                <p className="font-medium text-gray-900">{p.name}</p>
                {p.credentials && <p className="text-[13px] text-gray-400 mt-0.5">{p.credentials}</p>}
                {p.title && <p className="text-[13px] text-gray-400">{p.title}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Peptides Offered */}
      <RelatedEntities
        title="Peptides Offered"
        items={peptides.map((p) => ({ name: p.name, slug: p.slug, href: `/peptides/${p.slug}`, description: p.summary }))}
      />

      <FaqSection faqs={faqs} />
      <CitationList sources={pageSources} />

      {page?.last_reviewed_at && (
        <p className="text-xs text-gray-400 mt-8">
          Last reviewed: {new Date(page.last_reviewed_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
