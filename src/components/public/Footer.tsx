import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-md bg-[#7f21f6] flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-gray-900">
                Peptide<span className="text-[#7f21f6]">Directory</span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-gray-400">
              Your comprehensive guide to peptide therapy. Educational content only — not medical advice.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-4">Directory</h4>
            <ul className="space-y-3">
              <li><Link href="/peptides" className="text-[14px] text-gray-500 hover:text-[#7f21f6] transition-colors">All Peptides</Link></li>
              <li><Link href="/clinics" className="text-[14px] text-gray-500 hover:text-[#7f21f6] transition-colors">Clinics</Link></li>
              <li><Link href="/goals" className="text-[14px] text-gray-500 hover:text-[#7f21f6] transition-colors">Browse by Goal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/learn" className="text-[14px] text-gray-500 hover:text-[#7f21f6] transition-colors">Learn</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/learn/disclaimer" className="text-[14px] text-gray-500 hover:text-[#7f21f6] transition-colors">Disclaimer</Link></li>
              <li><Link href="/learn/privacy" className="text-[14px] text-gray-500 hover:text-[#7f21f6] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-400 max-w-lg text-center md:text-left">
            This website is for educational and informational purposes only. It is not intended as medical advice.
            Always consult a qualified healthcare provider.
          </p>
          <p className="text-[12px] text-gray-300">&copy; {new Date().getFullYear()} PeptideDirectory</p>
        </div>
      </div>
    </footer>
  )
}
