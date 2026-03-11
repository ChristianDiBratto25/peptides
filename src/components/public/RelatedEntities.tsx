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
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="block border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-300"
          >
            <h3 className="font-semibold text-blue-600">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
