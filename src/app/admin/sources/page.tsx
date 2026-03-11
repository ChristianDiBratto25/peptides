import { createClient } from '@/lib/supabase/server'
import EntityTable from '@/components/admin/EntityTable'

export default async function AdminSourcesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('sources').select('*').order('created_at', { ascending: false })

  return (
    <EntityTable
      title="Sources"
      table="sources"
      basePath="/admin/sources"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'source_type', label: 'Type' },
        { key: 'publication', label: 'Publication' },
        {
          key: 'url',
          label: 'URL',
          render: (v) => v ? (
            <a href={v as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs truncate block max-w-xs">
              {(v as string).slice(0, 40)}...
            </a>
          ) : '—',
        },
      ]}
      data={(data as Record<string, unknown>[]) || []}
    />
  )
}
