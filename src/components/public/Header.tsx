import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-[#7f21f6] flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </span>
          <span className="text-lg font-semibold tracking-[-0.02em] text-gray-900">
            Peptide<span className="text-[#7f21f6]">Directory</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/peptides" className="px-4 py-2 text-[14px] font-medium text-gray-500 hover:text-[#7f21f6] hover:bg-[#f3ecfe] rounded-lg transition-all">
            Peptides
          </Link>
          <Link href="/clinics" className="px-4 py-2 text-[14px] font-medium text-gray-500 hover:text-[#7f21f6] hover:bg-[#f3ecfe] rounded-lg transition-all">
            Clinics
          </Link>
          <Link href="/goals" className="px-4 py-2 text-[14px] font-medium text-gray-500 hover:text-[#7f21f6] hover:bg-[#f3ecfe] rounded-lg transition-all">
            Goals
          </Link>
          <Link href="/learn" className="px-4 py-2 text-[14px] font-medium text-gray-500 hover:text-[#7f21f6] hover:bg-[#f3ecfe] rounded-lg transition-all">
            Learn
          </Link>
        </nav>
      </div>
    </header>
  )
}
