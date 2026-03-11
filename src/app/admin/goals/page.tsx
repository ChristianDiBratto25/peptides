import { createClient } from '@/lib/supabase/server'
import EntityTable from '@/components/admin/EntityTable'

export default async function AdminGoalsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('goals').select('*').order('created_at', { ascending: false })

  return (
    <EntityTable
      title="Goals"
      table="goals"
      basePath="/admin/goals"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
        { key: 'status', label: 'Status' },
      ]}
      data={(data as Record<string, unknown>[]) || []}
    />
  )
}
