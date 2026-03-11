const colors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  review: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
  legal: 'bg-green-100 text-green-800',
  restricted: 'bg-yellow-100 text-yellow-800',
  banned: 'bg-red-100 text-red-800',
  prescription_only: 'bg-purple-100 text-purple-800',
  unknown: 'bg-gray-100 text-gray-800',
}

export default function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
