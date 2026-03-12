import type { Disclaimer } from '@/lib/types'

const icons: Record<string, string> = {
  medical: '⚕',
  legal: '§',
  general: 'ℹ',
  affiliate: '$',
}

const colors: Record<string, string> = {
  medical: 'bg-amber-50/80 border-amber-200/60 text-amber-800',
  legal: 'bg-sky-50/80 border-sky-200/60 text-sky-800',
  general: 'bg-gray-50/80 border-gray-200/60 text-gray-600',
  affiliate: 'bg-[#f3ecfe] border-[#7f21f6]/15 text-[#5a0fc0]',
}

export default function DisclaimerBanner({ disclaimers }: { disclaimers: Disclaimer[] }) {
  if (disclaimers.length === 0) return null

  return (
    <div className="space-y-3 mb-8">
      {disclaimers.map((d) => (
        <div key={d.id} className={`border rounded-xl px-5 py-4 text-[13px] leading-relaxed ${colors[d.disclaimer_type] || colors.general}`}>
          <span className="mr-2 opacity-70">{icons[d.disclaimer_type] || icons.general}</span>
          {d.text}
        </div>
      ))}
    </div>
  )
}

export function DefaultMedicalDisclaimer() {
  return (
    <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl px-5 py-4 text-[13px] text-amber-800 leading-relaxed mb-8">
      <span className="mr-2 opacity-70">⚕</span>
      <strong className="font-semibold">Disclaimer:</strong> This content is for educational and informational purposes only.
      It is not intended as medical advice or a substitute for professional medical consultation.
      Always consult a qualified healthcare provider before starting any new treatment.
    </div>
  )
}
