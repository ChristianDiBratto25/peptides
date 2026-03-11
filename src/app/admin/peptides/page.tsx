import { createClient } from '@/lib/supabase/server'
import EntityTable from '@/components/admin/EntityTable'

export default async function AdminPeptidesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('peptides').select('*').order('created_at', { ascending: false })

  return (
    <EntityTable
      title="Peptides"
      table="peptides"
      basePath="/admin/peptides"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status' },
      ]}
      data={(data as Record<string, unknown>[]) || []}
    />
  )
}
