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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Learn', href: '/learn' }]} />

      <h1 className="text-3xl font-bold mb-2">Learn About Peptides</h1>
      <p className="text-gray-600 mb-8">
        Educational resources covering peptide safety, legality, research, and more.
      </p>

      {pages.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          Educational content coming soon.
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/learn/${page.slug}`}
              className="block border rounded-lg p-5 hover:shadow-md transition-shadow hover:border-blue-300"
            >
              <h3 className="font-semibold text-lg text-blue-600">{page.title}</h3>
              {page.meta_description && (
                <p className="text-sm text-gray-600 mt-1">{page.meta_description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
