'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
interface FaqInput {
  id: string
  page_id: string
  question: string
  answer: string
  sort_order: number
  created_at: string
}

interface DisclaimerInput {
  id: string
  page_id: string
  text: string
  disclaimer_type: string
  created_at: string
}

interface PageEditorProps {
  page: Record<string, unknown> | null
  faqs: FaqInput[]
  pageSources: { id: string; source_id: string; citation_index: number; source?: { id: string; title: string; url: string | null } }[]
  disclaimers: DisclaimerInput[]
  allSources: { id: string; title: string; url: string | null }[]
  isNew: boolean
}

export default function PageEditor({ page, faqs: initialFaqs, pageSources, disclaimers: initialDisclaimers, allSources: _allSources, isNew }: PageEditorProps) {
  const [formData, setFormData] = useState({
    slug: String(page?.slug || ''),
    page_type: String(page?.page_type || 'peptide'),
    title: String(page?.title || ''),
    meta_description: String(page?.meta_description || ''),
    content: JSON.stringify(page?.content || {}, null, 2),
    canonical_url: String(page?.canonical_url || ''),
    status: String(page?.status || 'draft'),
    noindex: Boolean(page?.noindex),
    quality_score: page?.quality_score != null ? String(page.quality_score) : '',
    entity_id: String(page?.entity_id || ''),
  })

  const [faqs, setFaqs] = useState(initialFaqs)
  const [disclaimers, setDisclaimers] = useState(initialDisclaimers)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function handleChange(name: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // FAQ management
  function addFaq() {
    setFaqs((prev) => [...prev, { id: '', page_id: String(page?.id || ''), question: '', answer: '', sort_order: prev.length, created_at: '' }])
  }

  function updateFaq(index: number, field: string, value: string) {
    setFaqs((prev) => prev.map((f, i) => i === index ? { ...f, [field]: value } : f))
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index))
  }

  // Disclaimer management
  function addDisclaimer() {
    setDisclaimers((prev) => [...prev, { id: '', page_id: String(page?.id || ''), text: '', disclaimer_type: 'general', created_at: '' }])
  }

  function updateDisclaimer(index: number, field: string, value: string) {
    setDisclaimers((prev) => prev.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  function removeDisclaimer(index: number) {
    setDisclaimers((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    let contentJson
    try {
      contentJson = JSON.parse(formData.content)
    } catch {
      setError('Invalid JSON in content field')
      setSaving(false)
      return
    }

    const pageData = {
      slug: formData.slug,
      page_type: formData.page_type,
      title: formData.title,
      meta_description: formData.meta_description || null,
      content: contentJson,
      canonical_url: formData.canonical_url || null,
      status: formData.status,
      noindex: formData.noindex,
      quality_score: formData.quality_score ? Number(formData.quality_score) : null,
      entity_id: formData.entity_id || null,
      ...(formData.status === 'published' && { last_reviewed_at: new Date().toISOString() }),
    }

    let pageId = page?.id

    if (isNew) {
      const { data, error: insertError } = await supabase.from('pages').insert(pageData).select('id').single()
      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }
      pageId = data.id
    } else {
      const { error: updateError } = await supabase.from('pages').update(pageData).eq('id', pageId)
      if (updateError) {
        setError(updateError.message)
        setSaving(false)
        return
      }
    }

    // Save FAQs — delete existing then re-insert
    if (pageId) {
      await supabase.from('faqs').delete().eq('page_id', pageId)
      const faqsToInsert = faqs
        .filter((f) => f.question && f.answer)
        .map((f, i) => ({ page_id: pageId, question: f.question, answer: f.answer, sort_order: i }))
      if (faqsToInsert.length > 0) {
        await supabase.from('faqs').insert(faqsToInsert)
      }

      // Save disclaimers
      await supabase.from('disclaimers').delete().eq('page_id', pageId)
      const disclaimersToInsert = disclaimers
        .filter((d) => d.text)
        .map((d) => ({ page_id: pageId, text: d.text, disclaimer_type: d.disclaimer_type }))
      if (disclaimersToInsert.length > 0) {
        await supabase.from('disclaimers').insert(disclaimersToInsert)
      }
    }

    router.push('/admin/pages')
    router.refresh()
  }

  async function handleStatusChange(newStatus: string) {
    handleChange('status', newStatus)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{isNew ? 'Create Page' : 'Edit Page'}</h1>
        {!isNew && <Badge status={formData.status} />}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

        {/* Core Fields */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Page Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                required
                placeholder="url-friendly-slug"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
              <select
                value={formData.page_type}
                onChange={(e) => handleChange('page_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="peptide">Peptide</option>
                <option value="clinic">Clinic</option>
                <option value="goal">Goal</option>
                <option value="learn">Learn / Education</option>
                <option value="compare">Comparison</option>
                <option value="city">City</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity ID (optional)</label>
              <input
                type="text"
                value={formData.entity_id}
                onChange={(e) => handleChange('entity_id', e.target.value)}
                placeholder="Link to a peptide, clinic, or goal ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              rows={2}
              placeholder="SEO meta description (150-160 characters)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">{(formData.meta_description || '').length}/160 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (JSON)</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='{"intro": "...", "sections": [{"heading": "...", "body": "..."}]}'
            />
            <p className="text-xs text-gray-400 mt-1">
              Use JSON format: {`{"intro": "...", "sections": [{"heading": "...", "body": "..."}]}`}
            </p>
          </div>
        </div>

        {/* SEO & Status */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">SEO & Publishing</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2">
                {['draft', 'review', 'published'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s)}
                    className={`px-3 py-1.5 text-sm rounded-md border ${
                      formData.status === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Score</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.quality_score}
                onChange={(e) => handleChange('quality_score', e.target.value)}
                placeholder="0-100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
              <input
                type="url"
                value={formData.canonical_url}
                onChange={(e) => handleChange('canonical_url', e.target.value)}
                placeholder="Leave empty for auto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="noindex"
              checked={formData.noindex}
              onChange={(e) => handleChange('noindex', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="noindex" className="text-sm text-gray-700">
              Set as noindex (hide from search engines)
            </label>
          </div>

          {page?.last_reviewed_at ? (
            <p className="text-sm text-gray-500">
              Last reviewed: {new Date(String(page.last_reviewed_at)).toLocaleDateString()}
            </p>
          ) : null}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">FAQs</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addFaq}>Add FAQ</Button>
          </div>

          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-md p-4 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500">FAQ #{i + 1}</span>
                <Button type="button" variant="danger" size="sm" onClick={() => removeFaq(i)}>Remove</Button>
              </div>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(i, 'question', e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                placeholder="Answer"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Disclaimers */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Disclaimers</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addDisclaimer}>Add Disclaimer</Button>
          </div>

          {disclaimers.map((d, i) => (
            <div key={i} className="border rounded-md p-4 space-y-2">
              <div className="flex justify-between items-start">
                <select
                  value={d.disclaimer_type}
                  onChange={(e) => updateDisclaimer(i, 'disclaimer_type', e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md"
                >
                  <option value="medical">Medical</option>
                  <option value="legal">Legal</option>
                  <option value="general">General</option>
                  <option value="affiliate">Affiliate</option>
                </select>
                <Button type="button" variant="danger" size="sm" onClick={() => removeDisclaimer(i)}>Remove</Button>
              </div>
              <textarea
                value={d.text}
                onChange={(e) => updateDisclaimer(i, 'text', e.target.value)}
                placeholder="Disclaimer text"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Citations */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Citations</h2>
          <p className="text-sm text-gray-500">
            Citations are managed via the Sources section. Link sources to this page after saving.
          </p>
          {pageSources.length > 0 && (
            <ul className="space-y-1">
              {pageSources.map((ps, i) => (
                <li key={ps.id} className="text-sm">
                  <span className="font-medium">[{i + 1}]</span>{' '}
                  {ps.source?.title}
                  {ps.source?.url && (
                    <a href={ps.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-1">↗</a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Save */}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isNew ? 'Create Page' : 'Save Changes'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/pages')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
