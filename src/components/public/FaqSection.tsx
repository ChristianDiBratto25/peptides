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
    <section className="mt-14">
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <h2 className="font-serif text-2xl text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details key={faq.id} className="group border border-gray-100 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/80 text-[15px] font-medium text-gray-800 transition-colors">
              {faq.question}
              <svg className="ml-3 text-gray-300 group-open:rotate-180 transition-transform duration-200 flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="px-6 pb-5 text-[15px] text-gray-600 leading-relaxed border-t border-gray-50">
              <div className="pt-4">{faq.answer}</div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
