import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default async function AdminPagesListPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link href="/admin/pages/new">
          <Button>Create Page</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Quality</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Index</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Updated</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!pages || pages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No pages yet. Click &quot;Create Page&quot; to get started.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge status={page.page_type} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge status={page.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {page.quality_score != null ? (
                      <span className={`font-medium ${page.quality_score >= 70 ? 'text-green-600' : page.quality_score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {page.quality_score}/100
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {page.noindex ? (
                      <span className="text-red-500 text-xs">noindex</span>
                    ) : (
                      <span className="text-green-500 text-xs">index</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/pages/${page.id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
