import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/seo'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import ClinicCard from '@/components/public/ClinicCard'
import { DefaultMedicalDisclaimer } from '@/components/public/DisclaimerBanner'
import type { Clinic, Location } from '@/lib/types'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return buildMetadata({
    title: `Peptide Clinics in ${cityName}`,
    description: `Find verified peptide therapy clinics in ${cityName}. Compare providers, services, and locations.`,
    path: `/clinics/city/${city}`,
  })
}

export default async function CityClinicPage({ params }: Props) {
  const { city } = await params
  const cityName = city.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const supabase = await createClient()

  // Find clinics that have locations in this city
  const { data: locationData } = await supabase
    .from('locations')
    .select('clinic_id, city, state')
    .ilike('city', cityName)

  const clinicIds = [...new Set((locationData || []).map((l) => l.clinic_id))]

  let clinics: (Clinic & { locations: Location[] })[] = []
  if (clinicIds.length > 0) {
    const { data } = await supabase
      .from('clinics')
      .select('*, locations(*)')
      .in('id', clinicIds)
      .eq('status', 'published')
    clinics = (data || []) as (Clinic & { locations: Location[] })[]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: 'Clinics', href: '/clinics' },
        { label: cityName, href: `/clinics/city/${city}` },
      ]} />

      <DefaultMedicalDisclaimer />

      <h1 className="text-3xl font-bold mb-2">Peptide Clinics in {cityName}</h1>
      <p className="text-gray-600 mb-8">
        Browse {clinics.length} peptide therapy {clinics.length === 1 ? 'clinic' : 'clinics'} in {cityName}.
      </p>

      {clinics.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          <p>No clinics found in {cityName} yet.</p>
          <p className="text-sm mt-2">Check back soon as we continue adding verified clinics.</p>
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
