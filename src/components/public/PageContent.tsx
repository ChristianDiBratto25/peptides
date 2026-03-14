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
    <div className="max-w-none">
      {data.intro && (
        <p className="text-[17px] text-gray-600 leading-relaxed mb-10">{data.intro}</p>
      )}

      {data.sections?.map((section, i) => (
        <div key={i} className="mb-10">
          {section.heading && <h2 className="font-serif text-2xl text-gray-900 mb-4">{section.heading}</h2>}
          {section.body && <p className="text-base text-gray-700 leading-relaxed">{section.body}</p>}
        </div>
      ))}
    </div>
  )
}
