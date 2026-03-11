import { createClient } from '@/lib/supabase/server'
import EntityTable from '@/components/admin/EntityTable'

export default async function AdminSuppliersPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false })

  return (
    <EntityTable
      title="Suppliers"
      table="suppliers"
      basePath="/admin/suppliers"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'website', label: 'Website' },
        { key: 'status', label: 'Status' },
      ]}
      data={(data as Record<string, unknown>[]) || []}
    />
  )
}
