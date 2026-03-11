import { createClient } from '@/lib/supabase/server'
import PageEditor from '@/components/admin/PageEditor'

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let page: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let faqs: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pageSources: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let disclaimers: any[] = []

  if (!isNew) {
    const { data } = await supabase.from('pages').select('*').eq('id', id).single()
    page = data

    const { data: faqData } = await supabase
      .from('faqs')
      .select('*')
      .eq('page_id', id)
      .order('sort_order')
    faqs = faqData || []

    const { data: sourceData } = await supabase
      .from('page_sources')
      .select('*, source:sources(*)')
      .eq('page_id', id)
      .order('citation_index')
    pageSources = sourceData || []

    const { data: disclaimerData } = await supabase
      .from('disclaimers')
      .select('*')
      .eq('page_id', id)
    disclaimers = disclaimerData || []
  }

  // Get all sources for the citation picker
  const { data: allSources } = await supabase.from('sources').select('id, title, url').order('title')

  return (
    <PageEditor
      page={page}
      faqs={faqs}
      pageSources={pageSources}
      disclaimers={disclaimers}
      allSources={allSources || []}
      isNew={isNew}
    />
  )
}
