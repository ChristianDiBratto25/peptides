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
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f3ecfe] via-white to-white" />
        <div className="relative max-w-4xl mx-auto px-4 py-24 md:py-32 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7f21f6] mb-4">Research-Backed Peptide Intelligence</p>
          <h1 className="font-serif text-4xl md:text-6xl text-gray-900 mb-5 leading-[1.1]">
            Your Guide to<br />Peptide Therapy
          </h1>
          <p className="text-[17px] text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Verified clinics, educational resources, and research-backed compound profiles — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/peptides" className="px-7 py-3 bg-[#7f21f6] text-white rounded-lg font-medium text-[15px] hover:bg-[#5a0fc0] shadow-[0_2px_12px_rgba(127,33,246,0.3)] hover:shadow-[0_4px_20px_rgba(127,33,246,0.4)] transition-all duration-200">
              Browse Peptides
            </Link>
            <Link href="/goals" className="px-7 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium text-[15px] hover:border-[#7f21f6]/40 hover:text-[#7f21f6] transition-all duration-200">
              Explore by Goal
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Peptides */}
      {peptides.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl text-gray-900">Featured Peptides</h2>
            <Link href="/peptides" className="text-[13px] text-[#7f21f6] font-medium hover:text-[#5a0fc0] transition-colors">
              View All
              <span className="ml-1">&rarr;</span>
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
        <section className="bg-gray-50/60 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-gray-900">Browse by Goal</h2>
              <Link href="/goals" className="text-[13px] text-[#7f21f6] font-medium hover:text-[#5a0fc0] transition-colors">
                View All
                <span className="ml-1">&rarr;</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goals.map((g) => (
                <Link
                  key={g.id}
                  href={`/goals/${g.slug}`}
                  className="group bg-white border border-gray-100 rounded-xl p-5 text-center hover:border-[#7f21f6]/30 hover:shadow-[0_4px_20px_rgba(127,33,246,0.06)] transition-all duration-200"
                >
                  <span className="font-medium text-gray-800 group-hover:text-[#7f21f6] transition-colors">{g.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cities */}
      {cities.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="font-serif text-2xl text-gray-900 mb-6">Find Clinics by City</h2>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                href={`/clinics/city/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 border border-gray-100 rounded-full text-[13px] text-gray-500 hover:bg-[#f3ecfe] hover:border-[#7f21f6]/30 hover:text-[#7f21f6] transition-all duration-200"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">Educational Content Only</p>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            PeptideDirectory provides educational and informational content only.
            Nothing on this site constitutes medical advice. Always consult a qualified healthcare provider before starting any treatment.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}
