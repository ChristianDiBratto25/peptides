interface Section {
  heading?: string
  body?: string
}

interface PageContentData {
  intro?: string
  sections?: Section[]
}

export default function PageContent({ content }: { content: Record<string, unknown> }) {
  const data = content as PageContentData

  return (
    <div className="prose max-w-none">
      {data.intro && (
        <p className="text-lg text-gray-700 leading-relaxed mb-8">{data.intro}</p>
      )}

      {data.sections?.map((section, i) => (
        <div key={i} className="mb-8">
          {section.heading && <h2 className="text-xl font-bold mb-3">{section.heading}</h2>}
          {section.body && <p className="text-gray-700 leading-relaxed">{section.body}</p>}
        </div>
      ))}
    </div>
  )
}
