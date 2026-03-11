import { createClient } from '@/lib/supabase/server'
import EntityForm, { FieldConfig } from '@/components/admin/EntityForm'

const fields: FieldConfig[] = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'slug', label: 'Slug (URL)', type: 'text', required: true },
  { name: 'credentials', label: 'Credentials', type: 'text', placeholder: 'e.g. MD, DO, NP' },
  { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Medical Director' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  { name: 'photo_url', label: 'Photo URL', type: 'url' },
  {
    name: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

export default async function EditProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let initialData = {}

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('providers').select('*').eq('id', id).single()
    if (data) initialData = data
  }

  return (
    <EntityForm
      title="Provider"
      table="providers"
      basePath="/admin/providers"
      fields={fields}
      initialData={initialData}
      isNew={isNew}
    />
  )
}
