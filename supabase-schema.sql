-- Supabase Database Schema voor Shopify Dashboard
-- Voer dit script uit in de Supabase SQL Editor

-- =============================================
-- APPS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS apps (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  contact TEXT,
  used_on TEXT[], -- Array of store names
  app_link TEXT,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  price TEXT,
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- THEMES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS themes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  downloads INTEGER DEFAULT 0,
  image TEXT,
  price TEXT,
  dev_link TEXT,
  preview_link TEXT,
  documentation_link TEXT,
  app_builder TEXT,
  verified BOOLEAN DEFAULT false,
  used_on TEXT[], -- Array of store names
  documentation TEXT,
  validation_documentation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT,
  status TEXT DEFAULT 'active',
  budget TEXT,
  deadline DATE,
  seo_score INTEGER DEFAULT 0,
  description TEXT,
  url TEXT,
  logo TEXT,
  icon TEXT, -- Emoji or icon identifier
  color TEXT, -- Theme color for project
  team_size INTEGER DEFAULT 1,
  progress INTEGER DEFAULT 0, -- 0-100
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill migrations for existing databases
ALTER TABLE themes ADD COLUMN IF NOT EXISTS validation_documentation TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logo TEXT;

-- =============================================
-- BRANDING RESOURCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS branding_resources (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'file', 'link', 'text'
  url TEXT, -- For files stored in Supabase Storage or external links
  file_name TEXT,
  category TEXT, -- 'logos', 'fonts', 'colors', 'guidelines', etc.
  description TEXT,
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SALES / QUOTES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'accepted', 'rejected'
  notes TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FAQS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT,
  category TEXT,
  message_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
-- Voor dit dashboard willen we dat iedereen alles kan lezen en schrijven
-- zonder authenticatie (publiek toegankelijk voor team)

-- Enable RLS
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public access policies (iedereen kan alles)
CREATE POLICY "Enable all access for everyone on apps" ON apps
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for everyone on themes" ON themes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for everyone on projects" ON projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for everyone on branding_resources" ON branding_resources
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for everyone on sales" ON sales
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for everyone on faqs" ON faqs
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- INDEXES voor betere performance
-- =============================================
CREATE INDEX IF NOT EXISTS apps_category_idx ON apps(category);
CREATE INDEX IF NOT EXISTS apps_created_at_idx ON apps(created_at DESC);

CREATE INDEX IF NOT EXISTS themes_category_idx ON themes(category);
CREATE INDEX IF NOT EXISTS themes_created_at_idx ON themes(created_at DESC);

CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);

CREATE INDEX IF NOT EXISTS branding_resources_category_idx ON branding_resources(category);
CREATE INDEX IF NOT EXISTS branding_resources_created_at_idx ON branding_resources(created_at DESC);

CREATE INDEX IF NOT EXISTS sales_status_idx ON sales(status);
CREATE INDEX IF NOT EXISTS sales_created_at_idx ON sales(created_at DESC);

CREATE INDEX IF NOT EXISTS faqs_category_idx ON faqs(category);
CREATE INDEX IF NOT EXISTS faqs_created_at_idx ON faqs(created_at DESC);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
-- Automatically update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_apps_updated_at BEFORE UPDATE ON apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branding_resources_updated_at BEFORE UPDATE ON branding_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STORAGE BUCKET voor branding assets
-- =============================================
-- Voer dit uit in de Supabase Dashboard -> Storage
-- 
-- 1. Maak een nieuwe bucket aan genaamd: 'branding-assets'
-- 2. Maak de bucket PUBLIC
-- 3. Policies:
--    - INSERT: Allow all
--    - SELECT: Allow all
--    - UPDATE: Allow all
--    - DELETE: Allow all
