'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'url' | 'email' | 'number' | 'array'
  options?: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
}

interface EntityFormProps {
  title: string
  table: string
  basePath: string
  fields: FieldConfig[]
  initialData?: Record<string, unknown>
  isNew?: boolean
}

export default function EntityForm({ title, table, basePath, fields, initialData, isNew = false }: EntityFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function handleChange(name: string, value: unknown) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const data = { ...formData }
    // Convert array fields from comma-separated strings
    fields.forEach((f) => {
      if (f.type === 'array' && typeof data[f.name] === 'string') {
        data[f.name] = (data[f.name] as string).split(',').map((s) => s.trim()).filter(Boolean)
      }
    })

    let result
    if (isNew) {
      result = await supabase.from(table).insert(data)
    } else {
      result = await supabase.from(table).update(data).eq('id', formData.id)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
    } else {
      router.push(basePath)
      router.refresh()
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? `Add ${title}` : `Edit ${title}`}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>

            {field.type === 'textarea' ? (
              <textarea
                value={(formData[field.name] as string) || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : field.type === 'select' ? (
              <select
                value={(formData[field.name] as string) || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={!!formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                className="w-4 h-4"
              />
            ) : field.type === 'array' ? (
              <input
                type="text"
                value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : (formData[field.name] as string) || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder || 'Comma-separated values'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type={field.type}
                value={(formData[field.name] as string) || ''}
                onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isNew ? 'Create' : 'Save Changes'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push(basePath)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
