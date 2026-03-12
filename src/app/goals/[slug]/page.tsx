import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata, buildMedicalWebPageJsonLd } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import FaqSection from '@/components/public/FaqSection'
import CitationList from '@/components/public/CitationList'
import { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import RelatedEntities from '@/components/public/RelatedEntities'
import PeptideCard from '@/components/public/PeptideCard'
import PageContent from '@/components/public/PageContent'
import type { Peptide, FAQ } from '@/lib/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: goal } = await supabase.from('goals').select('name, description').eq('slug', slug).eq('status', 'published').single()
  if (!goal) return {}

  const { data: page } = await supabase.from('pages').select('title, meta_description, noindex, canonical_url').eq('slug', slug).eq('page_type', 'goal').eq('status', 'published').single()

  return buildMetadata({
    title: page?.title || `Peptides for ${goal.name}`,
    description: page?.meta_description || goal.description || `Explore peptides commonly studied for ${goal.name.toLowerCase()}.`,
    path: `/goals/${slug}`,
    noindex: page?.noindex || false,
  })
}

export default async function GoalPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!goal) notFound()

  const [peptidesRes, pageRes] = await Promise.all([
    supabase.from('peptide_goals').select('peptide:peptides(*)').eq('goal_id', goal.id),
    supabase.from('pages').select('*').eq('slug', slug).eq('page_type', 'goal').eq('status', 'published').single(),
  ])

  const peptides = (peptidesRes.data || []).map((r: Record<string, unknown>) => r.peptide).filter(Boolean) as Peptide[]
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[
        { label: 'Goals', href: '/goals' },
        { label: goal.name, href: `/goals/${slug}` },
      ]} />

      <JsonLd data={buildMedicalWebPageJsonLd({
        title: `Peptides for ${goal.name}`,
        description: goal.description || '',
        url: `/goals/${slug}`,
        lastReviewed: page?.last_reviewed_at || undefined,
      })} />

      <DefaultMedicalDisclaimer />

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">Peptides for {goal.name}</h1>

      {goal.description && (
        <p className="text-[17px] text-gray-500 leading-relaxed mb-10">{goal.description}</p>
      )}

      {page?.content && Object.keys(page.content).length > 0 && (
        <PageContent content={page.content} />
      )}

      {/* Related Peptides */}
      {peptides.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl text-gray-900 mb-5">Peptides Studied for {goal.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {peptides.map((p) => (
              <PeptideCard key={p.id} peptide={p} />
            ))}
          </div>
        </section>
      )}

      <FaqSection faqs={faqs} />
      <CitationList sources={pageSources} />
    </div>
  )
}
