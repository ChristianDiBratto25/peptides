import { createClient } from '@/lib/supabase/server'
import EntityForm, { FieldConfig } from '@/components/admin/EntityForm'

const fields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g. BPC-157' },
  { name: 'slug', label: 'Slug (URL)', type: 'text', required: true, placeholder: 'e.g. bpc-157' },
  { name: 'alternative_names', label: 'Alternative Names', type: 'array', placeholder: 'Name 1, Name 2' },
  { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Brief one-paragraph summary' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Detailed description' },
  { name: 'molecular_weight', label: 'Molecular Weight', type: 'text', placeholder: 'e.g. 1419.53 Da' },
  { name: 'sequence', label: 'Amino Acid Sequence', type: 'text', placeholder: 'e.g. GEPPPGKPADDAGLV' },
  { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Growth Hormone Releasing' },
  {
    name: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

export default async function EditPeptidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let initialData = {}

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('peptides').select('*').eq('id', id).single()
    if (data) initialData = data
  }

  return (
    <EntityForm
      title="Peptide"
      table="peptides"
      basePath="/admin/peptides"
      fields={fields}
      initialData={initialData}
      isNew={isNew}
    />
  )
}
