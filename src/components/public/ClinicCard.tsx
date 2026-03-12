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
      className="group block bg-white border border-gray-100 rounded-xl p-6 hover:border-[#7f21f6]/30 hover:shadow-[0_4px_20px_rgba(127,33,246,0.06)] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-xl text-gray-900 group-hover:text-[#7f21f6] transition-colors">{clinic.name}</h3>
          {location && (
            <p className="text-[13px] text-gray-400 mt-1">
              {[location.city, location.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        {clinic.verified && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-semibold uppercase tracking-wide rounded-full border border-emerald-100">
            Verified
          </span>
        )}
      </div>
      {clinic.description && (
        <p className="text-[14px] text-gray-400 mt-3 leading-relaxed line-clamp-2">{clinic.description}</p>
      )}
    </Link>
  )
}
