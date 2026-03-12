import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import ClinicCard from '@/components/public/ClinicCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = buildMetadata({
  title: 'Peptide Clinics Directory',
  description: 'Find verified peptide therapy clinics near you. Browse by city and compare providers.',
  path: '/clinics',
})

export default async function ClinicsListPage() {
  const supabase = await createClient()

  const { data: clinics } = await supabase
    .from('clinics')
    .select('*, locations(*)')
    .eq('status', 'published')
    .order('name')

  const { data: locationData } = await supabase
    .from('locations')
    .select('city, state')

  // Unique cities
  const cityMap = new Map<string, string>()
  for (const loc of locationData || []) {
    const key = loc.city.toLowerCase().replace(/\s+/g, '-')
    if (!cityMap.has(key)) {
      cityMap.set(key, loc.state ? `${loc.city}, ${loc.state}` : loc.city)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Clinics', href: '/clinics' }]} />

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">Peptide Clinics</h1>
      <p className="text-[15px] text-gray-400 mb-10">
        Browse verified peptide therapy clinics.
      </p>

      {/* City filter */}
      {cityMap.size > 0 && (
        <div className="mb-10">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-3">Browse by City</h2>
          <div className="flex flex-wrap gap-2">
            {[...cityMap.entries()].map(([slug, label]) => (
              <Link
                key={slug}
                href={`/clinics/city/${slug}`}
                className="px-3 py-1.5 border border-gray-100 rounded-full text-[13px] text-gray-500 hover:bg-[#f3ecfe] hover:border-[#7f21f6]/30 hover:text-[#7f21f6] transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Clinic list */}
      {!clinics || clinics.length === 0 ? (
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-10 text-center text-gray-400">
          No clinics listed yet. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      )}
    </div>
  )
}
