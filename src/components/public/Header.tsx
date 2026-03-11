import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          PeptideDirectory
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/peptides" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Peptides
          </Link>
          <Link href="/goals" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Goals
          </Link>
          <Link href="/learn" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
            Learn
          </Link>
        </nav>
      </div>
    </header>
  )
}
