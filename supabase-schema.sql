-- Supabase Database Schema voor Shopify Dashboard
-- Voer dit script uit in de Supabase SQL Editor

-- =============================================
-- USER PROFILES TABLE
-- =============================================
-- Supabase Auth heeft een ingebouwde auth.users tabel
-- We maken een publieke profiles tabel die linked is aan auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'admin', 'user', 'viewer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
-- SECURE: Alleen authenticated users krijgen toegang

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update only their own
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Apps: Authenticated users can do everything
CREATE POLICY "Authenticated users can view apps" ON apps
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert apps" ON apps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update apps" ON apps
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete apps" ON apps
  FOR DELETE USING (auth.role() = 'authenticated');

-- Themes: Authenticated users can do everything
CREATE POLICY "Authenticated users can view themes" ON themes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert themes" ON themes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update themes" ON themes
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete themes" ON themes
  FOR DELETE USING (auth.role() = 'authenticated');

-- Projects: Authenticated users can do everything
CREATE POLICY "Authenticated users can view projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Branding Resources: Authenticated users can do everything
CREATE POLICY "Authenticated users can view branding_resources" ON branding_resources
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert branding_resources" ON branding_resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update branding_resources" ON branding_resources
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete branding_resources" ON branding_resources
  FOR DELETE USING (auth.role() = 'authenticated');

-- Sales: Authenticated users can do everything
CREATE POLICY "Authenticated users can view sales" ON sales
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert sales" ON sales
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sales" ON sales
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete sales" ON sales
  FOR DELETE USING (auth.role() = 'authenticated');

-- FAQs: Authenticated users can do everything
CREATE POLICY "Authenticated users can view faqs" ON faqs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert faqs" ON faqs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update faqs" ON faqs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete faqs" ON faqs
  FOR DELETE USING (auth.role() = 'authenticated');

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
-- UPSELLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS upsells (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  bullets TEXT[],
  category TEXT, -- 'development' | 'post-launch'
  duration TEXT,
  impact TEXT,
  price TEXT,
  emoji TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE upsells ENABLE ROW LEVEL SECURITY;

-- Upsells: Authenticated users can do everything
CREATE POLICY "Authenticated users can view upsells" ON upsells
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert upsells" ON upsells
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update upsells" ON upsells
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete upsells" ON upsells
  FOR DELETE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS upsells_category_idx ON upsells(category);
CREATE INDEX IF NOT EXISTS upsells_created_at_idx ON upsells(created_at DESC);

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

CREATE TRIGGER update_upsells_updated_at BEFORE UPDATE ON upsells
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
