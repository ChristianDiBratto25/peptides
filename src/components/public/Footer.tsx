import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">PeptideDirectory</h3>
            <p className="text-sm text-gray-500">
              Your comprehensive guide to peptide therapy. Educational content only — not medical advice.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Directory</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/peptides" className="hover:text-blue-600">All Peptides</Link></li>
              <li><Link href="/goals" className="hover:text-blue-600">Browse by Goal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/learn" className="hover:text-blue-600">Learn</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/learn/disclaimer" className="hover:text-blue-600">Disclaimer</Link></li>
              <li><Link href="/learn/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-xs text-gray-400">
          <p>
            This website is for educational and informational purposes only. It is not intended as medical advice.
            Always consult a qualified healthcare provider.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} PeptideDirectory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
