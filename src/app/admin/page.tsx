import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getCount(table: string) {
  const supabase = await createClient()
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
  return count || 0
}

export default async function AdminDashboard() {
  const [peptides, clinics, providers, suppliers, goals, sources, pages] = await Promise.all([
    getCount('peptides'),
    getCount('clinics'),
    getCount('providers'),
    getCount('suppliers'),
    getCount('goals'),
    getCount('sources'),
    getCount('pages'),
  ])

  const stats = [
    { label: 'Peptides', count: peptides, href: '/admin/peptides', color: 'bg-blue-500' },
    { label: 'Clinics', count: clinics, href: '/admin/clinics', color: 'bg-green-500' },
    { label: 'Providers', count: providers, href: '/admin/providers', color: 'bg-purple-500' },
    { label: 'Suppliers', count: suppliers, href: '/admin/suppliers', color: 'bg-orange-500' },
    { label: 'Goals', count: goals, href: '/admin/goals', color: 'bg-teal-500' },
    { label: 'Sources', count: sources, href: '/admin/sources', color: 'bg-pink-500' },
    { label: 'Pages', count: pages, href: '/admin/pages', color: 'bg-indigo-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold mb-3`}>
              {stat.count}
            </div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/peptides?new=1" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            Add Peptide
          </Link>
          <Link href="/admin/clinics?new=1" className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
            Add Clinic
          </Link>
          <Link href="/admin/pages?new=1" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
            Create Page
          </Link>
        </div>
      </div>
    </div>
  )
}
