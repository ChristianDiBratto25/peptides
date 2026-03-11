import { createClient } from '@/lib/supabase/server'
import PublicLayout from '@/components/public/PublicLayout'
import PeptideCard from '@/components/public/PeptideCard'
import Link from 'next/link'
import type { Peptide, Goal } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  const [peptidesRes, goalsRes, citiesRes] = await Promise.all([
    supabase.from('peptides').select('*').eq('status', 'published').order('name').limit(6),
    supabase.from('goals').select('*').eq('status', 'published').order('name').limit(8),
    supabase.from('locations').select('city').neq('city', null),
  ])

  const peptides = (peptidesRes.data || []) as Peptide[]
  const goals = (goalsRes.data || []) as Goal[]
  const cities = [...new Set((citiesRes.data || []).map((l) => l.city))].slice(0, 12)

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Guide to Peptide Therapy
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Research-backed information on peptide compounds, verified clinics, and educational resources — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/peptides" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Browse Peptides
            </Link>
            <Link href="/goals" className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Explore by Goal
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Peptides */}
      {peptides.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Peptides</h2>
            <Link href="/peptides" className="text-blue-600 text-sm hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peptides.map((p) => (
              <PeptideCard key={p.id} peptide={p} />
            ))}
          </div>
        </section>
      )}

      {/* Goals */}
      {goals.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Browse by Goal</h2>
              <Link href="/goals" className="text-blue-600 text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goals.map((g) => (
                <Link
                  key={g.id}
                  href={`/goals/${g.slug}`}
                  className="bg-white border rounded-lg p-4 text-center hover:shadow-md transition-shadow hover:border-blue-300"
                >
                  <span className="font-medium text-gray-800">{g.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cities */}
      {cities.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-6">Find Clinics by City</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/clinics/city/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 border rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-sm text-amber-800 text-center">
          <p className="font-medium mb-1">Educational Content Only</p>
          <p>
            PeptideDirectory provides educational and informational content only.
            Nothing on this site constitutes medical advice. Always consult a qualified healthcare provider before starting any treatment.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
