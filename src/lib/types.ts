export type EntityStatus = 'draft' | 'published' | 'archived'
export type PageStatus = 'draft' | 'review' | 'published' | 'archived'
export type PageType = 'peptide' | 'clinic' | 'goal' | 'learn' | 'compare' | 'city'
export type LegalStatus = 'legal' | 'restricted' | 'banned' | 'prescription_only' | 'unknown'
export type SourceType = 'study' | 'fda' | 'article' | 'government' | 'book' | 'other'
export type UserRole = 'admin' | 'editor' | 'viewer'
export type DisclaimerType = 'medical' | 'legal' | 'general' | 'affiliate'

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  full_name: string | null
  email: string | null
  created_at: string
  updated_at: string
}

export interface Peptide {
  id: string
  slug: string
  name: string
  alternative_names: string[]
  summary: string | null
  description: string | null
  molecular_weight: string | null
  sequence: string | null
  category: string | null
  status: EntityStatus
  created_at: string
  updated_at: string
}

export interface Clinic {
  id: string
  slug: string
  name: string
  phone: string | null
  website: string | null
  email: string | null
  description: string | null
  logo_url: string | null
  verified: boolean
  status: EntityStatus
  created_at: string
  updated_at: string
  locations?: Location[]
}

export interface Provider {
  id: string
  slug: string
  name: string
  credentials: string | null
  title: string | null
  bio: string | null
  photo_url: string | null
  status: EntityStatus
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  slug: string
  name: string
  website: string | null
  description: string | null
  verified: boolean
  status: EntityStatus
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  clinic_id: string
  address: string | null
  city: string
  state: string | null
  zip: string | null
  country: string
  lat: number | null
  lng: number | null
  created_at: string
}

export interface Goal {
  id: string
  slug: string
  name: string
  description: string | null
  status: EntityStatus
  created_at: string
  updated_at: string
}

export interface Jurisdiction {
  id: string
  peptide_id: string
  country: string
  state: string | null
  legal_status: LegalStatus
  notes: string | null
  updated_at: string
}

export interface Source {
  id: string
  url: string | null
  title: string
  publication: string | null
  authors: string | null
  published_date: string | null
  source_type: SourceType
  created_at: string
}

export interface Page {
  id: string
  slug: string
  page_type: PageType
  title: string
  meta_description: string | null
  content: Record<string, unknown>
  canonical_url: string | null
  status: PageStatus
  noindex: boolean
  quality_score: number | null
  last_reviewed_at: string | null
  reviewed_by: string | null
  entity_id: string | null
  created_at: string
  updated_at: string
}

export interface PageLink {
  id: string
  from_page_id: string
  to_page_id: string
  anchor_text: string | null
  context: string | null
  created_at: string
}

export interface FAQ {
  id: string
  page_id: string
  question: string
  answer: string
  sort_order: number
  created_at: string
}

export interface Disclaimer {
  id: string
  page_id: string
  text: string
  disclaimer_type: DisclaimerType
  created_at: string
}

export interface PageSource {
  id: string
  page_id: string
  source_id: string
  citation_index: number
  source?: Source
}
