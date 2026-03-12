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
import Link from 'next/link'
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

  const [peptidesRes, pageRes, learnPagesRes] = await Promise.all([
    supabase.from('peptide_goals').select('peptide:peptides(*)').eq('goal_id', goal.id),
    supabase.from('pages').select('*').eq('slug', slug).eq('page_type', 'goal').eq('status', 'published').single(),
    supabase
      .from('pages')
      .select('slug, title, meta_description')
      .eq('page_type', 'learn')
      .eq('status', 'published')
      .order('title')
      .limit(5),
  ])

  const peptides = (peptidesRes.data || []).map((r: Record<string, unknown>) => r.peptide).filter(Boolean) as Peptide[]
  const page = pageRes.data
  const learnPages = learnPagesRes.data || []

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

  // City links for internal linking
  const cityLinks = [
    { name: 'Miami', slug: 'miami', href: '/clinics/city/miami' },
    { name: 'New York', slug: 'new-york', href: '/clinics/city/new-york' },
    { name: 'Los Angeles', slug: 'los-angeles', href: '/clinics/city/los-angeles' },
    { name: 'Austin', slug: 'austin', href: '/clinics/city/austin' },
    { name: 'Scottsdale', slug: 'scottsdale', href: '/clinics/city/scottsdale' },
  ]

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

      {/* Find Clinics */}
      <section className="mt-12">
        <h2 className="font-serif text-xl text-gray-900 mb-5">Find Peptide Clinics</h2>
        <div className="flex flex-wrap gap-2">
          {cityLinks.map((city) => (
            <Link
              key={city.slug}
              href={city.href}
              className="px-4 py-2 border border-gray-100 rounded-full text-[13px] text-gray-500 hover:bg-[#f3ecfe] hover:border-[#7f21f6]/30 hover:text-[#7f21f6] transition-all duration-200"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Further Reading */}
      <RelatedEntities
        title="Further Reading"
        items={learnPages.map((p) => ({ name: p.title, slug: p.slug, href: `/learn/${p.slug}`, description: p.meta_description }))}
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
