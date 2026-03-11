import { createClient } from '@/lib/supabase/server'
import EntityForm, { FieldConfig } from '@/components/admin/EntityForm'

const fields: FieldConfig[] = [
  { name: 'name', label: 'Goal Name', type: 'text', required: true, placeholder: 'e.g. Weight Loss' },
  { name: 'slug', label: 'Slug (URL)', type: 'text', required: true, placeholder: 'e.g. weight-loss' },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

export default async function EditGoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let initialData = {}

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('goals').select('*').eq('id', id).single()
    if (data) initialData = data
  }

  return (
    <EntityForm
      title="Goal"
      table="goals"
      basePath="/admin/goals"
      fields={fields}
      initialData={initialData}
      isNew={isNew}
    />
  )
}
