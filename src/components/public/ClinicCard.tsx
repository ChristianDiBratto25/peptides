import Link from 'next/link'
import type { Clinic, Location } from '@/lib/types'

interface ClinicCardProps {
  clinic: Clinic & { locations?: Location[] }
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  const location = clinic.locations?.[0]

  return (
    <Link
      href={`/clinics/${clinic.slug}`}
      className="block border rounded-lg p-5 hover:shadow-md transition-shadow hover:border-green-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg text-green-700">{clinic.name}</h3>
          {location && (
            <p className="text-sm text-gray-500 mt-1">
              {[location.city, location.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        {clinic.verified && (
          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex-shrink-0">
            Verified
          </span>
        )}
      </div>
      {clinic.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{clinic.description}</p>
      )}
    </Link>
  )
}
