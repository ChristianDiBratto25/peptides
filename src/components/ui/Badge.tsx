const colors: Record<string, string> = {
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  review: 'bg-[#f3ecfe] text-[#7f21f6] border-[#e4d4fc]',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-gray-50 text-gray-500 border-gray-200',
  legal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  restricted: 'bg-amber-50 text-amber-700 border-amber-200',
  banned: 'bg-red-50 text-red-600 border-red-200',
  prescription_only: 'bg-[#f3ecfe] text-[#7f21f6] border-[#e4d4fc]',
  unknown: 'bg-gray-50 text-gray-500 border-gray-200',
  peptide: 'bg-[#f3ecfe] text-[#7f21f6] border-[#e4d4fc]',
  clinic: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  goal: 'bg-blue-50 text-blue-700 border-blue-200',
  learn: 'bg-amber-50 text-amber-700 border-amber-200',
  compare: 'bg-gray-50 text-gray-600 border-gray-200',
  city: 'bg-sky-50 text-sky-700 border-sky-200',
}

export default function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${colors[status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
