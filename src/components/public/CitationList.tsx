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
    <section className="mt-14 border-t border-gray-100 pt-8">
      <h2 className="font-serif text-2xl text-gray-900 mb-6">Sources &amp; References</h2>
      <ol className="space-y-3">
        {sources.map((ps, i) => (
          <li key={ps.source.id} className="flex gap-3 text-[13px]">
            <span className="font-medium text-gray-300 flex-shrink-0 tabular-nums">[{i + 1}]</span>
            <div className="leading-relaxed">
              <span className="font-medium text-gray-700">{ps.source.title}</span>
              {ps.source.publication && <span className="text-gray-400"> — {ps.source.publication}</span>}
              {ps.source.authors && <span className="text-gray-400"> ({ps.source.authors})</span>}
              {ps.source.published_date && <span className="text-gray-300"> · {ps.source.published_date}</span>}
              {ps.source.url && (
                <a href={ps.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#7f21f6] hover:text-[#5a0fc0] ml-2 transition-colors">
                  View Source
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2h6v6M10 2L4 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
