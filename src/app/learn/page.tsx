import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'Learn About Peptides',
  description: 'Educational resources about peptide therapy — safety, legality, research, and more.',
  path: '/learn',
})

export default async function LearnIndexPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('id, slug, title, meta_description')
    .eq('page_type', 'learn')
    .eq('status', 'published')
    .order('title')

  const pages = data || []

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Learn', href: '/learn' }]} />

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">Learn About Peptides</h1>
      <p className="text-[15px] text-gray-400 mb-10">
        Educational resources covering peptide safety, legality, research, and more.
      </p>

      {pages.length === 0 ? (
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-10 text-center text-gray-400">
          Educational content coming soon.
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/learn/${page.slug}`}
              className="group block border border-gray-100 rounded-xl p-6 hover:border-[#7f21f6]/30 hover:shadow-[0_4px_20px_rgba(127,33,246,0.06)] transition-all duration-200"
            >
              <h3 className="font-serif text-lg text-gray-900 group-hover:text-[#7f21f6] transition-colors">{page.title}</h3>
              {page.meta_description && (
                <p className="text-[13px] text-gray-400 mt-1.5 leading-relaxed">{page.meta_description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
