-- =====================================================
-- School Management SaaS — Schools & Academic Terms
-- Run this in: Supabase Dashboard → SQL Editor
-- =====================================================

CREATE TABLE schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text unique,
  logo_url text,
  subscription_plan text not null default 'free',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

CREATE TABLE academic_terms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id)
    on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS school_id uuid
  references schools(id) on delete cascade;

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_terms ENABLE ROW LEVEL SECURITY;

-- Admins can manage their own school
CREATE POLICY "Admins can manage own school"
  ON schools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.school_id = schools.id
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- School members can read their school
CREATE POLICY "Members can read own school"
  ON schools FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.school_id = schools.id
    )
  );

CREATE POLICY "School members can read terms"
  ON academic_terms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.school_id = academic_terms.school_id
    )
  );

CREATE POLICY "Admins can manage terms"
  ON academic_terms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.school_id = academic_terms.school_id
      AND p.role IN ('admin', 'super_admin')
    )
  );
