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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Goals', href: '/goals' }]} />

      <h1 className="text-3xl font-bold mb-2">Browse by Goal</h1>
      <p className="text-gray-600 mb-8">
        Find peptides studied for specific health and wellness goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <Link
            key={goal.id}
            href={`/goals/${goal.slug}`}
            className="block border rounded-lg p-5 hover:shadow-md transition-shadow hover:border-blue-300"
          >
            <h3 className="font-semibold text-lg text-blue-600">{goal.name}</h3>
            {goal.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{goal.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
