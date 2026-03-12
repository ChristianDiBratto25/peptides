import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata, buildMedicalWebPageJsonLd } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import FaqSection from '@/components/public/FaqSection'
import CitationList from '@/components/public/CitationList'
import { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import PageContent from '@/components/public/PageContent'
import type { FAQ } from '@/lib/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('title, meta_description, noindex, canonical_url').eq('slug', slug).eq('page_type', 'compare').eq('status', 'published').single()
  if (!page) return {}

  return buildMetadata({
    title: page.title,
    description: page.meta_description || `Compare peptides side by side.`,
    path: `/compare/${slug}`,
    noindex: page.noindex,
    canonical: page.canonical_url || undefined,
  })
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_type', 'compare')
    .eq('status', 'published')
    .single()

  if (!page) notFound()

  // Parse peptide slugs from the comparison slug (e.g., "bpc-157-vs-tb-500")
  const slugParts = slug.split('-vs-')
  let peptides: { id: string; name: string; slug: string; summary: string | null; molecular_weight: string | null; sequence: string | null; category: string | null }[] = []

  if (slugParts.length >= 2) {
    const { data } = await supabase
      .from('peptides')
      .select('id, name, slug, summary, molecular_weight, sequence, category')
      .in('slug', slugParts)
      .eq('status', 'published')
    peptides = data || []
  }

  const [faqRes, sourceRes] = await Promise.all([
    supabase.from('faqs').select('*').eq('page_id', page.id).order('sort_order'),
    supabase.from('page_sources').select('*, source:sources(*)').eq('page_id', page.id).order('citation_index'),
  ])

  const faqs = (faqRes.data || []) as FAQ[]
  const pageSources = sourceRes.data || []

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Compare', href: '/compare' },
        { label: page.title, href: `/compare/${slug}` },
      ]} />

      <JsonLd data={buildMedicalWebPageJsonLd({
        title: page.title,
        description: page.meta_description || '',
        url: `/compare/${slug}`,
        lastReviewed: page.last_reviewed_at || undefined,
      })} />

      <DefaultMedicalDisclaimer />

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-8">{page.title}</h1>

      {/* Quick comparison table if peptides found */}
      {peptides.length >= 2 && (
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-10">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left px-5 py-3 text-[11px] uppercase tracking-[0.1em] text-gray-400 font-medium">Property</th>
                {peptides.map((p) => (
                  <th key={p.id} className="text-left px-5 py-3 font-serif text-[15px] text-gray-900 font-normal">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="px-5 py-3 font-medium text-gray-700">Category</td>
                {peptides.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-gray-600">{p.category || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium text-gray-700">Molecular Weight</td>
                {peptides.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-gray-600">{p.molecular_weight || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium text-gray-700">Sequence</td>
                {peptides.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-mono text-[12px] text-gray-500">{p.sequence || '—'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

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
