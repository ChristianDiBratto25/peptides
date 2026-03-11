import { createClient } from '@/lib/supabase/server'
import EntityTable from '@/components/admin/EntityTable'
import Badge from '@/components/ui/Badge'

export default async function AdminClinicsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('clinics').select('*').order('created_at', { ascending: false })

  return (
    <EntityTable
      title="Clinics"
      table="clinics"
      basePath="/admin/clinics"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        {
          key: 'verified',
          label: 'Verified',
          render: (v) => v ? <Badge status="published" /> : <Badge status="draft" />,
        },
        { key: 'status', label: 'Status' },
      ]}
      data={(data as Record<string, unknown>[]) || []}
    />
  )
}
