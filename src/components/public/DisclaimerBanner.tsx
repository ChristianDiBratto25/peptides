import type { Disclaimer } from '@/lib/types'

const icons: Record<string, string> = {
  medical: '⚕',
  legal: '§',
  general: 'ℹ',
  affiliate: '$',
}

const colors: Record<string, string> = {
  medical: 'bg-amber-50 border-amber-200 text-amber-800',
  legal: 'bg-blue-50 border-blue-200 text-blue-800',
  general: 'bg-gray-50 border-gray-200 text-gray-700',
  affiliate: 'bg-purple-50 border-purple-200 text-purple-800',
}

export default function DisclaimerBanner({ disclaimers }: { disclaimers: Disclaimer[] }) {
  if (disclaimers.length === 0) return null

  return (
    <div className="space-y-3 mb-8">
      {disclaimers.map((d) => (
        <div key={d.id} className={`border rounded-lg p-4 text-sm ${colors[d.disclaimer_type] || colors.general}`}>
          <span className="mr-2">{icons[d.disclaimer_type] || icons.general}</span>
          {d.text}
        </div>
      ))}
    </div>
  )
}

export function DefaultMedicalDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-8">
      <span className="mr-2">⚕</span>
      <strong>Disclaimer:</strong> This content is for educational and informational purposes only.
      It is not intended as medical advice or a substitute for professional medical consultation.
      Always consult a qualified healthcare provider before starting any new treatment.
    </div>
  )
}
