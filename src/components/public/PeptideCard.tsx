import Link from 'next/link'
import type { Peptide } from '@/lib/types'

export default function PeptideCard({ peptide }: { peptide: Peptide }) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="block border rounded-lg p-5 hover:shadow-md transition-shadow hover:border-blue-300"
    >
      <h3 className="font-semibold text-lg text-blue-600">{peptide.name}</h3>
      {peptide.category && (
        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
          {peptide.category}
        </span>
      )}
      {peptide.summary && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{peptide.summary}</p>
      )}
    </Link>
  )
}
