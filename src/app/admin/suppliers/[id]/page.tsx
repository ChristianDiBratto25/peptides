import { createClient } from '@/lib/supabase/server'
import EntityForm, { FieldConfig } from '@/components/admin/EntityForm'

const fields: FieldConfig[] = [
  { name: 'name', label: 'Supplier Name', type: 'text', required: true },
  { name: 'slug', label: 'Slug (URL)', type: 'text', required: true },
  { name: 'website', label: 'Website', type: 'url' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'verified', label: 'Verified', type: 'checkbox' },
  {
    name: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

export default async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let initialData = {}

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('suppliers').select('*').eq('id', id).single()
    if (data) initialData = data
  }

  return (
    <EntityForm
      title="Supplier"
      table="suppliers"
      basePath="/admin/suppliers"
      fields={fields}
      initialData={initialData}
      isNew={isNew}
    />
  )
}
