import { createClient } from '@/lib/supabase/server'
import EntityForm, { FieldConfig } from '@/components/admin/EntityForm'

const fields: FieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Study or article title' },
  { name: 'url', label: 'URL', type: 'url', placeholder: 'https://...' },
  { name: 'publication', label: 'Publication', type: 'text', placeholder: 'e.g. PubMed, FDA.gov' },
  { name: 'authors', label: 'Authors', type: 'text', placeholder: 'e.g. Smith J, Jones M' },
  { name: 'published_date', label: 'Published Date', type: 'text', placeholder: 'YYYY-MM-DD' },
  {
    name: 'source_type', label: 'Source Type', type: 'select',
    options: [
      { value: 'study', label: 'Study' },
      { value: 'fda', label: 'FDA' },
      { value: 'article', label: 'Article' },
      { value: 'government', label: 'Government' },
      { value: 'book', label: 'Book' },
      { value: 'other', label: 'Other' },
    ],
  },
]

export default async function EditSourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let initialData = {}

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('sources').select('*').eq('id', id).single()
    if (data) initialData = data
  }

  return (
    <EntityForm
      title="Source"
      table="sources"
      basePath="/admin/sources"
      fields={fields}
      initialData={initialData}
      isNew={isNew}
    />
  )
}
