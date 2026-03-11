'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

interface EntityTableProps {
  title: string
  table: string
  basePath: string
  columns: Column[]
  data: Record<string, unknown>[]
}

export default function EntityTable({ title, table, basePath, columns, data }: EntityTableProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete(id: string) {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase().slice(0, -1)}?`)) return
    await supabase.from(table).delete().eq('id', id)
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link href={`${basePath}/new`}>
          <Button>Add New</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                  {col.label}
                </th>
              ))}
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  No {title.toLowerCase()} yet. Click &quot;Add New&quot; to create one.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id as string} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm">
                      {col.render
                        ? col.render(row[col.key], row)
                        : col.key === 'status'
                        ? <Badge status={row[col.key] as string} />
                        : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href={`${basePath}/${row.id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(row.id as string)}>
                      Delete
                    </Button>
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
