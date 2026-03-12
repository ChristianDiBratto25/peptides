import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata, buildMedicalWebPageJsonLd } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import FaqSection from '@/components/public/FaqSection'
import CitationList from '@/components/public/CitationList'
import DisclaimerBanner, { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import PageContent from '@/components/public/PageContent'
import RelatedEntities from '@/components/public/RelatedEntities'
import type { FAQ, Disclaimer } from '@/lib/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('title, meta_description, noindex, canonical_url').eq('slug', slug).eq('page_type', 'legal').eq('status', 'published').single()
  if (!page) return {}

  return buildMetadata({
    title: page.title,
    description: page.meta_description || `Legal information about peptides.`,
    path: `/legal/${slug}`,
    noindex: page.noindex,
    canonical: page.canonical_url || undefined,
  })
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_type', 'legal')
    .eq('status', 'published')
    .single()

  if (!page) notFound()

  const [faqRes, sourceRes, disclaimerRes] = await Promise.all([
    supabase.from('faqs').select('*').eq('page_id', page.id).order('sort_order'),
    supabase.from('page_sources').select('*, source:sources(*)').eq('page_id', page.id).order('citation_index'),
    supabase.from('disclaimers').select('*').eq('page_id', page.id),
  ])

  const faqs = (faqRes.data || []) as FAQ[]
  const pageSources = sourceRes.data || []
  const disclaimers = (disclaimerRes.data || []) as Disclaimer[]

  // Fetch related entities from content JSONB
  const contentData = page.content as { related_peptides?: string[]; related_goals?: string[] }
  let relatedPeptides: { name: string; slug: string }[] = []
  let relatedGoals: { name: string; slug: string; description: string | null }[] = []

  if (contentData.related_peptides?.length) {
    const { data } = await supabase
      .from('peptides')
      .select('name, slug')
      .in('slug', contentData.related_peptides)
      .eq('status', 'published')
    relatedPeptides = data || []
  }

  if (contentData.related_goals?.length) {
    const { data } = await supabase
      .from('goals')
      .select('name, slug, description')
      .in('slug', contentData.related_goals)
      .eq('status', 'published')
    relatedGoals = data || []
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Learn', href: '/learn' },
        { label: page.title, href: `/legal/${slug}` },
      ]} />

      <JsonLd data={buildMedicalWebPageJsonLd({
        title: page.title,
        description: page.meta_description || '',
        url: `/legal/${slug}`,
        lastReviewed: page.last_reviewed_at || undefined,
      })} />

      {disclaimers.length > 0 ? (
        <DisclaimerBanner disclaimers={disclaimers} />
      ) : (
        <DefaultMedicalDisclaimer />
      )}

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-8">{page.title}</h1>

      <PageContent content={page.content} />

      {/* Related Peptides */}
      <RelatedEntities
        title="Related Peptides"
        items={relatedPeptides.map((p) => ({ name: p.name, slug: p.slug, href: `/peptides/${p.slug}` }))}
      />

      {/* Related Goals */}
      <RelatedEntities
        title="Related Goals"
        items={relatedGoals.map((g) => ({ name: g.name, slug: g.slug, href: `/goals/${g.slug}`, description: g.description }))}
      />

      <FaqSection faqs={faqs} />
      <CitationList sources={pageSources} />

      {page.last_reviewed_at && (
        <p className="text-xs text-gray-400 mt-8">
          Last reviewed: {new Date(page.last_reviewed_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
