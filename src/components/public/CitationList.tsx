interface SourceData {
  id: string
  title: string
  url: string | null
  publication: string | null
  authors: string | null
  published_date: string | null
}

interface CitationListProps {
  sources: { citation_index: number; source: SourceData }[]
}

export default function CitationList({ sources }: CitationListProps) {
  if (sources.length === 0) return null

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-bold mb-4">Sources & References</h2>
      <ol className="space-y-2 text-sm text-gray-600">
        {sources.map((ps, i) => (
          <li key={ps.source.id} className="flex gap-2">
            <span className="font-medium text-gray-400 flex-shrink-0">[{i + 1}]</span>
            <div>
              <span className="font-medium text-gray-800">{ps.source.title}</span>
              {ps.source.publication && <span className="text-gray-500"> — {ps.source.publication}</span>}
              {ps.source.authors && <span className="text-gray-500"> ({ps.source.authors})</span>}
              {ps.source.published_date && <span className="text-gray-400"> · {ps.source.published_date}</span>}
              {ps.source.url && (
                <a href={ps.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                  View Source ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
