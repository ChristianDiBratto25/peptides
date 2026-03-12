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
      <nav aria-label="Breadcrumb" className="text-[13px] text-gray-400 mb-6">
        <ol className="flex items-center gap-1.5">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-200">/</span>}
              {i === allItems.length - 1 ? (
                <span className="text-gray-600 font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-[#7f21f6] transition-colors">
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
