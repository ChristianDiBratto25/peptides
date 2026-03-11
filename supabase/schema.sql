-- PeptideDirectory Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE entity_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE page_status AS ENUM ('draft', 'review', 'published', 'archived');
CREATE TYPE page_type AS ENUM ('peptide', 'clinic', 'goal', 'learn', 'compare', 'city');
CREATE TYPE legal_status AS ENUM ('legal', 'restricted', 'banned', 'prescription_only', 'unknown');
CREATE TYPE source_type AS ENUM ('study', 'fda', 'article', 'government', 'book', 'other');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE disclaimer_type AS ENUM ('medical', 'legal', 'general', 'affiliate');

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role user_role DEFAULT 'viewer' NOT NULL,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE peptides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  alternative_names TEXT[] DEFAULT '{}',
  summary TEXT,
  description TEXT,
  molecular_weight TEXT,
  sequence TEXT,
  category TEXT,
  status entity_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  email TEXT,
  description TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT FALSE NOT NULL,
  status entity_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  credentials TEXT,
  title TEXT,
  bio TEXT,
  photo_url TEXT,
  status entity_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  website TEXT,
  description TEXT,
  verified BOOLEAN DEFAULT FALSE NOT NULL,
  status entity_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US' NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status entity_status DEFAULT 'draft' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  peptide_id UUID REFERENCES peptides(id) ON DELETE CASCADE NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  legal_status legal_status DEFAULT 'unknown' NOT NULL,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT,
  title TEXT NOT NULL,
  publication TEXT,
  authors TEXT,
  published_date DATE,
  source_type source_type DEFAULT 'other' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- PAGES (CMS)
-- ============================================================

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  page_type page_type NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  content JSONB DEFAULT '{}' NOT NULL,
  canonical_url TEXT,
  status page_status DEFAULT 'draft' NOT NULL,
  noindex BOOLEAN DEFAULT FALSE NOT NULL,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  last_reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(slug, page_type)
);

CREATE TABLE page_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  to_page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  anchor_text TEXT,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE disclaimers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  disclaimer_type disclaimer_type DEFAULT 'general' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- JOIN TABLES
-- ============================================================

CREATE TABLE clinic_peptides (
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
  peptide_id UUID REFERENCES peptides(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (clinic_id, peptide_id)
);

CREATE TABLE clinic_providers (
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (clinic_id, provider_id)
);

CREATE TABLE provider_peptides (
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
  peptide_id UUID REFERENCES peptides(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (provider_id, peptide_id)
);

CREATE TABLE supplier_peptides (
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  peptide_id UUID REFERENCES peptides(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (supplier_id, peptide_id)
);

CREATE TABLE peptide_goals (
  peptide_id UUID REFERENCES peptides(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (peptide_id, goal_id)
);

CREATE TABLE page_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE NOT NULL,
  citation_index INTEGER NOT NULL,
  UNIQUE(page_id, source_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_peptides_slug ON peptides(slug);
CREATE INDEX idx_peptides_status ON peptides(status);
CREATE INDEX idx_clinics_slug ON clinics(slug);
CREATE INDEX idx_clinics_status ON clinics(status);
CREATE INDEX idx_providers_slug ON providers(slug);
CREATE INDEX idx_suppliers_slug ON suppliers(slug);
CREATE INDEX idx_goals_slug ON goals(slug);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_state ON locations(state);
CREATE INDEX idx_locations_clinic ON locations(clinic_id);
CREATE INDEX idx_jurisdictions_peptide ON jurisdictions(peptide_id);
CREATE INDEX idx_pages_slug_type ON pages(slug, page_type);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_entity ON pages(entity_id);
CREATE INDEX idx_faqs_page ON faqs(page_id);
CREATE INDEX idx_page_links_from ON page_links(from_page_id);
CREATE INDEX idx_page_links_to ON page_links(to_page_id);
CREATE INDEX idx_page_sources_page ON page_sources(page_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE peptides ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE disclaimers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_peptides ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_peptides ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_peptides ENABLE ROW LEVEL SECURITY;
ALTER TABLE peptide_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sources ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin/editor
CREATE OR REPLACE FUNCTION is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PUBLIC READ policies (published content only)
CREATE POLICY "Public read published peptides" ON peptides FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published clinics" ON clinics FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published providers" ON providers FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published suppliers" ON suppliers FOR SELECT USING (status = 'published');
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (TRUE);
CREATE POLICY "Public read published goals" ON goals FOR SELECT USING (status = 'published');
CREATE POLICY "Public read jurisdictions" ON jurisdictions FOR SELECT USING (TRUE);
CREATE POLICY "Public read sources" ON sources FOR SELECT USING (TRUE);
CREATE POLICY "Public read published pages" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public read page_links" ON page_links FOR SELECT USING (TRUE);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (TRUE);
CREATE POLICY "Public read disclaimers" ON disclaimers FOR SELECT USING (TRUE);
CREATE POLICY "Public read clinic_peptides" ON clinic_peptides FOR SELECT USING (TRUE);
CREATE POLICY "Public read clinic_providers" ON clinic_providers FOR SELECT USING (TRUE);
CREATE POLICY "Public read provider_peptides" ON provider_peptides FOR SELECT USING (TRUE);
CREATE POLICY "Public read supplier_peptides" ON supplier_peptides FOR SELECT USING (TRUE);
CREATE POLICY "Public read peptide_goals" ON peptide_goals FOR SELECT USING (TRUE);
CREATE POLICY "Public read page_sources" ON page_sources FOR SELECT USING (TRUE);

-- ADMIN/EDITOR read ALL (including drafts)
CREATE POLICY "Admin read all peptides" ON peptides FOR SELECT TO authenticated USING (is_admin_or_editor());
CREATE POLICY "Admin read all clinics" ON clinics FOR SELECT TO authenticated USING (is_admin_or_editor());
CREATE POLICY "Admin read all providers" ON providers FOR SELECT TO authenticated USING (is_admin_or_editor());
CREATE POLICY "Admin read all suppliers" ON suppliers FOR SELECT TO authenticated USING (is_admin_or_editor());
CREATE POLICY "Admin read all goals" ON goals FOR SELECT TO authenticated USING (is_admin_or_editor());
CREATE POLICY "Admin read all pages" ON pages FOR SELECT TO authenticated USING (is_admin_or_editor());
CREATE POLICY "Admin read profiles" ON profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin_or_editor());

-- ADMIN/EDITOR write policies
CREATE POLICY "Admin write peptides" ON peptides FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write clinics" ON clinics FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write providers" ON providers FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write suppliers" ON suppliers FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write locations" ON locations FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write goals" ON goals FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write jurisdictions" ON jurisdictions FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write sources" ON sources FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write pages" ON pages FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write page_links" ON page_links FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write faqs" ON faqs FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write disclaimers" ON disclaimers FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write clinic_peptides" ON clinic_peptides FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write clinic_providers" ON clinic_providers FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write provider_peptides" ON provider_peptides FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write supplier_peptides" ON supplier_peptides FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write peptide_goals" ON peptide_goals FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write page_sources" ON page_sources FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());
CREATE POLICY "Admin write profiles" ON profiles FOR ALL TO authenticated USING (is_admin_or_editor()) WITH CHECK (is_admin_or_editor());

-- Users can read own profile
CREATE POLICY "Users read own profile" ON profiles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER peptides_updated_at BEFORE UPDATE ON peptides FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
