import JsonLd from '@/components/seo/JsonLd'
import { buildFaqJsonLd } from '@/lib/seo'

interface FaqItem {
  id: string
  question: string
  answer: string
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null

  return (
    <section className="mt-12">
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.id} className="group border rounded-lg">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium">
              {faq.question}
              <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-6 pb-4 text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
