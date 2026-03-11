import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import PeptideCard from '@/components/public/PeptideCard'
import type { Peptide } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'Peptide Directory',
  description: 'Browse our comprehensive directory of peptides. Find research, clinics, and educational resources for each compound.',
  path: '/peptides',
})

export default async function PeptidesListPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('peptides')
    .select('*')
    .eq('status', 'published')
    .order('name')

  const peptides = (data || []) as Peptide[]

  // Group by category
  const categories = new Map<string, Peptide[]>()
  for (const p of peptides) {
    const cat = p.category || 'Other'
    if (!categories.has(cat)) categories.set(cat, [])
    categories.get(cat)!.push(p)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Peptides', href: '/peptides' }]} />

      <h1 className="text-3xl font-bold mb-2">Peptide Directory</h1>
      <p className="text-gray-600 mb-8">
        Browse {peptides.length} peptides in our directory. Each compound page includes research references, legal status, and related clinics.
      </p>

      {peptides.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          Peptides coming soon.
        </div>
      ) : (
        <div className="space-y-10">
          {[...categories.entries()].map(([category, items]) => (
            <section key={category}>
              <h2 className="text-xl font-bold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((p) => (
                  <PeptideCard key={p.id} peptide={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
