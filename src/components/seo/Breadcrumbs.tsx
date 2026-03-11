import Link from 'next/link'
import JsonLd from './JsonLd'
import { buildBreadcrumbJsonLd } from '@/lib/seo'

interface BreadcrumbItem {
  label: string
  href: string
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: 'Home', href: '/' }, ...items]

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(allItems.map((item) => ({ name: item.label, url: item.href })))} />
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center gap-1.5">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {i === allItems.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
