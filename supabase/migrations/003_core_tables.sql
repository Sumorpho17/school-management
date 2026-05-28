-- =====================================================
-- School Management SaaS — Core Entity Tables
-- Phase 2: Students, Teachers, Classes, Subjects, Departments, Enrollments
-- Run this in: Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. Departments
CREATE TABLE departments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  description text,
  head_teacher_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TRIGGER on_departments_updated
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. Teachers
CREATE TABLE teachers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  date_of_birth date,
  gender text not null default 'other' check (gender in ('male', 'female', 'other')),
  address text,
  employee_id text not null,
  department_id uuid references departments(id) on delete set null,
  subject_specialization text,
  qualification text,
  hire_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'inactive', 'on_leave', 'terminated')),
  profile_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(school_id, employee_id)
);

CREATE TRIGGER on_teachers_updated
  BEFORE UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. Classes
CREATE TABLE classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  grade_level text not null,
  section text,
  academic_year text not null,
  class_teacher_id uuid references teachers(id) on delete set null,
  capacity integer,
  room_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

CREATE TRIGGER on_classes_updated
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Subjects
CREATE TABLE subjects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  code text not null,
  description text,
  credit_hours integer default 1,
  department_id uuid references departments(id) on delete set null,
  is_elective boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(school_id, code)
);

CREATE TRIGGER on_subjects_updated
  BEFORE UPDATE ON subjects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Students
CREATE TABLE students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  gender text not null default 'other' check (gender in ('male', 'female', 'other')),
  email text,
  phone text,
  address text,
  admission_number text not null,
  enrollment_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'inactive', 'graduated', 'transferred', 'suspended')),
  profile_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(school_id, admission_number)
);

CREATE TRIGGER on_students_updated
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Enrollments
CREATE TABLE enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  academic_year text not null,
  enrollment_date date not null default current_date,
  status text not null default 'active' check (status in ('active', 'dropped', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, class_id, academic_year)
);

CREATE TRIGGER on_enrollments_updated
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- School members can read their school's data
CREATE POLICY "Members can read own departments"
  ON departments FOR SELECT
  USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Members can read own teachers"
  ON teachers FOR SELECT
  USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Members can read own classes"
  ON classes FOR SELECT
  USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Members can read own subjects"
  ON subjects FOR SELECT
  USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Members can read own students"
  ON students FOR SELECT
  USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Members can read own enrollments"
  ON enrollments FOR SELECT
  USING (class_id IN (SELECT id FROM classes WHERE school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid())));

-- Admins can write
CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') AND school_id = departments.school_id));

CREATE POLICY "Admins can manage teachers"
  ON teachers FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') AND school_id = teachers.school_id));

CREATE POLICY "Admins can manage classes"
  ON classes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') AND school_id = classes.school_id));

CREATE POLICY "Admins can manage subjects"
  ON subjects FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') AND school_id = subjects.school_id));

CREATE POLICY "Admins can manage students"
  ON students FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') AND school_id = students.school_id));

CREATE POLICY "Admins can manage enrollments"
  ON enrollments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
