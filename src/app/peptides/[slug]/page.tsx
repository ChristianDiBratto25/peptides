import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata, buildMedicalWebPageJsonLd } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import FaqSection from '@/components/public/FaqSection'
import CitationList from '@/components/public/CitationList'
import DisclaimerBanner, { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import RelatedEntities from '@/components/public/RelatedEntities'
import PageContent from '@/components/public/PageContent'
import Badge from '@/components/ui/Badge'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: peptide } = await supabase.from('peptides').select('name, summary').eq('slug', slug).eq('status', 'published').single()
  if (!peptide) return {}

  const { data: page } = await supabase.from('pages').select('title, meta_description, noindex, canonical_url').eq('slug', slug).eq('page_type', 'peptide').eq('status', 'published').single()

  return buildMetadata({
    title: page?.title || `${peptide.name} — Peptide Guide`,
    description: page?.meta_description || peptide.summary || `Learn about ${peptide.name} — uses, research, and clinics offering this peptide.`,
    path: `/peptides/${slug}`,
    noindex: page?.noindex || false,
    canonical: page?.canonical_url || undefined,
  })
}

export default async function PeptidePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: peptide } = await supabase
    .from('peptides')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!peptide) notFound()

  // Fetch related data in parallel
  const [goalsRes, jurisdictionsRes, pageRes, learnPagesRes, relatedPeptidesRes, cityPagesRes] = await Promise.all([
    supabase
      .from('peptide_goals')
      .select('goal:goals(*)')
      .eq('peptide_id', peptide.id),
    supabase
      .from('jurisdictions')
      .select('*')
      .eq('peptide_id', peptide.id),
    supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('page_type', 'peptide')
      .eq('status', 'published')
      .single(),
    supabase
      .from('pages')
      .select('slug, title, meta_description')
      .eq('page_type', 'learn')
      .eq('status', 'published')
      .order('title')
      .limit(5),
    supabase
      .from('peptides')
      .select('name, slug, summary')
      .eq('status', 'published')
      .neq('slug', slug)
      .order('name')
      .limit(6),
    supabase
      .from('pages')
      .select('slug, title, meta_description')
      .eq('page_type', 'city')
      .eq('status', 'published')
      .order('title')
      .limit(5),
  ])

  const goals = (goalsRes.data || []).map((r: Record<string, unknown>) => r.goal).filter(Boolean) as { id: string; name: string; slug: string; description: string | null }[]
  const jurisdictions = jurisdictionsRes.data || []
  const page = pageRes.data
  const learnPages = learnPagesRes.data || []
  const relatedPeptides = relatedPeptidesRes.data || []
  const cityPages = cityPagesRes.data || []

  // Fetch page-specific data if page exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let faqs: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pageSources: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let disclaimers: any[] = []

  if (page) {
    const [faqRes, sourceRes, disclaimerRes] = await Promise.all([
      supabase.from('faqs').select('*').eq('page_id', page.id).order('sort_order'),
      supabase.from('page_sources').select('*, source:sources(*)').eq('page_id', page.id).order('citation_index'),
      supabase.from('disclaimers').select('*').eq('page_id', page.id),
    ])
    faqs = faqRes.data || []
    pageSources = sourceRes.data || []
    disclaimers = disclaimerRes.data || []
  }

  // Fetch related clinics
  const { data: clinicLinks } = await supabase
    .from('clinic_peptides')
    .select('clinic:clinics(id, name, slug, description)')
    .eq('peptide_id', peptide.id)
    .limit(6)

  const relatedClinics = (clinicLinks || []).map((r: Record<string, unknown>) => r.clinic).filter(Boolean) as { id: string; name: string; slug: string; description: string | null }[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Peptides', href: '/peptides' },
        { label: peptide.name, href: `/peptides/${slug}` },
      ]} />

      <JsonLd data={buildMedicalWebPageJsonLd({
        title: peptide.name,
        description: peptide.summary || `Information about ${peptide.name}`,
        url: `/peptides/${slug}`,
        lastReviewed: page?.last_reviewed_at || undefined,
      })} />

      {disclaimers.length > 0 ? (
        <DisclaimerBanner disclaimers={disclaimers} />
      ) : (
        <DefaultMedicalDisclaimer />
      )}

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">{peptide.name}</h1>

      {peptide.alternative_names?.length > 0 && (
        <p className="text-gray-500 text-sm mb-4">
          Also known as: {peptide.alternative_names.join(', ')}
        </p>
      )}

      {peptide.category && (
        <span className="inline-block mb-8 px-3 py-1 bg-[#f3ecfe] text-[#7f21f6] text-[12px] font-medium rounded-full">
          {peptide.category}
        </span>
      )}

      {/* Quick Facts */}
      {(peptide.molecular_weight || peptide.sequence) && (
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5 mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
          {peptide.molecular_weight && (
            <div>
              <span className="text-[12px] text-gray-500 uppercase tracking-[0.1em] font-medium">Molecular Weight</span>
              <p className="font-medium text-gray-900 mt-0.5">{peptide.molecular_weight}</p>
            </div>
          )}
          {peptide.sequence && (
            <div>
              <span className="text-[12px] text-gray-500 uppercase tracking-[0.1em] font-medium">Sequence</span>
              <p className="font-mono text-sm text-gray-700 mt-0.5">{peptide.sequence}</p>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {peptide.summary && (
        <p className="text-[17px] text-gray-600 leading-relaxed mb-8">{peptide.summary}</p>
      )}

      {/* CMS Page Content */}
      {page?.content && Object.keys(page.content).length > 0 && (
        <PageContent content={page.content} />
      )}

      {peptide.description && !page?.content && (
        <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{peptide.description}</div>
      )}

      {/* Jurisdictions */}
      {jurisdictions.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-gray-900 mb-5">Legal Status by Jurisdiction</h2>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-5 py-3 text-[12px] uppercase tracking-[0.1em] text-gray-500 font-medium">Country</th>
                  <th className="text-left px-5 py-3 text-[12px] uppercase tracking-[0.1em] text-gray-500 font-medium">State/Region</th>
                  <th className="text-left px-5 py-3 text-[12px] uppercase tracking-[0.1em] text-gray-500 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-[12px] uppercase tracking-[0.1em] text-gray-500 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jurisdictions.map((j) => (
                  <tr key={j.id}>
                    <td className="px-5 py-3 text-gray-700">{j.country}</td>
                    <td className="px-5 py-3 text-gray-700">{j.state || '—'}</td>
                    <td className="px-5 py-3"><Badge status={j.legal_status} /></td>
                    <td className="px-5 py-3 text-gray-500">{j.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related Goals */}
      <RelatedEntities
        title="Related Goals"
        items={goals.map((g) => ({ name: g.name, slug: g.slug, href: `/goals/${g.slug}`, description: g.description }))}
      />

      {/* Related Peptides */}
      <RelatedEntities
        title="Compare Related Peptides"
        items={relatedPeptides.map((p) => ({ name: p.name, slug: p.slug, href: `/peptides/${p.slug}`, description: p.summary }))}
      />

      {/* City Clinic Directory */}
      <RelatedEntities
        title="Find Peptide Clinics Near You"
        items={cityPages.map((p) => ({ name: p.title, slug: p.slug, href: `/clinics/city/${p.slug}`, description: p.meta_description }))}
      />

      {/* Related Clinics */}
      <RelatedEntities
        title="Clinics Offering This Peptide"
        items={relatedClinics.map((c) => ({ name: c.name, slug: c.slug, href: `/clinics/${c.slug}`, description: c.description }))}
      />

      {/* Further Reading — Learn pages */}
      <RelatedEntities
        title="Further Reading"
        items={learnPages.map((p) => ({ name: p.title, slug: p.slug, href: `/learn/${p.slug}`, description: p.meta_description }))}
      />

      {/* FAQs */}
      <FaqSection faqs={faqs} />

      {/* Citations */}
      <CitationList sources={pageSources} />

      {/* Last reviewed */}
      {page?.last_reviewed_at && (
        <p className="text-sm text-gray-500 mt-8">
          Last reviewed: {new Date(page.last_reviewed_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
