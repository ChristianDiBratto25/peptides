'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '□' },
  { href: '/admin/peptides', label: 'Peptides', icon: '◊' },
  { href: '/admin/clinics', label: 'Clinics', icon: '+' },
  { href: '/admin/providers', label: 'Providers', icon: '○' },
  { href: '/admin/suppliers', label: 'Suppliers', icon: '▸' },
  { href: '/admin/goals', label: 'Goals', icon: '★' },
  { href: '/admin/sources', label: 'Sources', icon: '≡' },
  { href: '/admin/pages', label: 'Pages', icon: '▦' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <Link href="/admin" className="text-xl font-bold">
          PeptideDirectory
        </Link>
        <p className="text-gray-400 text-xs mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Link
          href="/"
          target="_blank"
          className="block text-sm text-gray-400 hover:text-white mb-3"
        >
          View Site →
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-400 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
