import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import type { Goal } from '@/lib/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = buildMetadata({
  title: 'Peptide Goals',
  description: 'Explore peptides by health and wellness goals. Find research-backed compounds for weight loss, anti-aging, recovery, and more.',
  path: '/goals',
})

export default async function GoalsListPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('status', 'published')
    .order('name')

  const goals = (data || []) as Goal[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Goals', href: '/goals' }]} />

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">Browse by Goal</h1>
      <p className="text-[15px] text-gray-400 mb-10">
        Find peptides studied for specific health and wellness goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {goals.map((goal) => (
          <Link
            key={goal.id}
            href={`/goals/${goal.slug}`}
            className="group block border border-gray-100 rounded-xl p-6 hover:border-[#7f21f6]/30 hover:shadow-[0_4px_20px_rgba(127,33,246,0.06)] transition-all duration-200"
          >
            <h3 className="font-serif text-lg text-gray-900 group-hover:text-[#7f21f6] transition-colors">{goal.name}</h3>
            {goal.description && (
              <p className="text-[13px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">{goal.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
