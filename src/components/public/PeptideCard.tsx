import Link from 'next/link'
import type { Peptide } from '@/lib/types'

export default function PeptideCard({ peptide }: { peptide: Peptide }) {
  return (
    <Link
      href={`/peptides/${peptide.slug}`}
      className="group block bg-white border border-gray-100 rounded-xl p-6 hover:border-[#7f21f6]/30 hover:shadow-[0_4px_20px_rgba(127,33,246,0.06)] transition-all duration-200"
    >
      <h3 className="font-serif text-xl text-gray-900 group-hover:text-[#7f21f6] transition-colors">{peptide.name}</h3>
      {peptide.category && (
        <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#f3ecfe] text-[#7f21f6] text-[11px] font-medium uppercase tracking-wide rounded-full">
          {peptide.category}
        </span>
      )}
      {peptide.summary && (
        <p className="text-[14px] text-gray-400 mt-3 leading-relaxed line-clamp-2">{peptide.summary}</p>
      )}
    </Link>
  )
}
