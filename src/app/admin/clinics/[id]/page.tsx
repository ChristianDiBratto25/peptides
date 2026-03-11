import { createClient } from '@/lib/supabase/server'
import EntityForm, { FieldConfig } from '@/components/admin/EntityForm'

const fields: FieldConfig[] = [
  { name: 'name', label: 'Clinic Name', type: 'text', required: true },
  { name: 'slug', label: 'Slug (URL)', type: 'text', required: true, placeholder: 'e.g. vitality-health-clinic' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'website', label: 'Website', type: 'url' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'logo_url', label: 'Logo URL', type: 'url' },
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

export default async function EditClinicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let initialData = {}

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('clinics').select('*').eq('id', id).single()
    if (data) initialData = data
  }

  return (
    <EntityForm
      title="Clinic"
      table="clinics"
      basePath="/admin/clinics"
      fields={fields}
      initialData={initialData}
      isNew={isNew}
    />
  )
}
