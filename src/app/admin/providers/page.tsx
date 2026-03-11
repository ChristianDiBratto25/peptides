import { createClient } from '@/lib/supabase/server'
import EntityTable from '@/components/admin/EntityTable'

export default async function AdminProvidersPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('providers').select('*').order('created_at', { ascending: false })

  return (
    <EntityTable
      title="Providers"
      table="providers"
      basePath="/admin/providers"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'credentials', label: 'Credentials' },
        { key: 'title', label: 'Title' },
        { key: 'status', label: 'Status' },
      ]}
      data={(data as Record<string, unknown>[]) || []}
    />
  )
}
