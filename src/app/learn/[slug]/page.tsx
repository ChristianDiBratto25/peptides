import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata, buildMedicalWebPageJsonLd } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import FaqSection from '@/components/public/FaqSection'
import CitationList from '@/components/public/CitationList'
import DisclaimerBanner, { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import PageContent from '@/components/public/PageContent'
import type { FAQ, Disclaimer } from '@/lib/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('title, meta_description, noindex, canonical_url').eq('slug', slug).eq('page_type', 'learn').eq('status', 'published').single()
  if (!page) return {}

  return buildMetadata({
    title: page.title,
    description: page.meta_description || `Educational resource about peptides.`,
    path: `/learn/${slug}`,
    noindex: page.noindex,
    canonical: page.canonical_url || undefined,
  })
}

export default async function LearnPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_type', 'learn')
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Learn', href: '/learn' },
        { label: page.title, href: `/learn/${slug}` },
      ]} />

      <JsonLd data={buildMedicalWebPageJsonLd({
        title: page.title,
        description: page.meta_description || '',
        url: `/learn/${slug}`,
        lastReviewed: page.last_reviewed_at || undefined,
      })} />

      {disclaimers.length > 0 ? (
        <DisclaimerBanner disclaimers={disclaimers} />
      ) : (
        <DefaultMedicalDisclaimer />
      )}

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-8">{page.title}</h1>

      <PageContent content={page.content} />

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
