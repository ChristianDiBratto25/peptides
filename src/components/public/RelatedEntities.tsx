import Link from 'next/link'

interface RelatedItem {
  name: string
  slug: string
  href: string
  description?: string | null
}

export default function RelatedEntities({ title, items }: { title: string; items: RelatedItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl text-gray-900 mb-5">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="group block border border-gray-100 rounded-xl p-5 hover:border-[#7f21f6]/30 hover:shadow-[0_4px_20px_rgba(127,33,246,0.06)] transition-all duration-200"
          >
            <h3 className="font-medium text-gray-900 group-hover:text-[#7f21f6] transition-colors">{item.name}</h3>
            {item.description && (
              <p className="text-[13px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
