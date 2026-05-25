<p align="center">
  <img src="public/favicon.svg" width="80" alt="SchoolHub Logo" />
</p>

<h1 align="center">SchoolHub — Modern School Management SaaS</h1>

<p align="center">
  <strong>A multi-tenant, role-based school management platform built for African schools.</strong><br/>
  Manage students, teachers, fees, grades, timetables, and more — all from one dashboard.
</p>

<p align="center">
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Supabase-BaaS-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" /></a>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Unique Selling Points (USP)](#-unique-selling-points-usp)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Features Built So Far](#-features-built-so-far)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About the Project

**SchoolHub** is a cloud-native, multi-tenant School Management System (SMS) designed specifically for the Nigerian and broader African education market. It provides a unified platform where school administrators, teachers, and parents collaborate seamlessly to manage every aspect of school operations — from student enrollment and fee tracking to academic grading and timetable scheduling.

### The Problem

Most schools in Nigeria still rely on:
- **Paper registers** for attendance and grades
- **Spreadsheets** for fee tracking with no audit trail
- **WhatsApp groups** for parent communication
- **Disconnected tools** that don't talk to each other

This leads to lost records, delayed fee collection, poor parent visibility, and administrative overload.

### The Solution

SchoolHub provides a **single, modern platform** that digitizes every school process. Each school gets its own isolated tenant with its own data, calendar, and configuration — while the platform operator manages everything from a super admin panel.

---

## 🏆 Unique Selling Points (USP)

| # | USP | Description |
|---|-----|-------------|
| 1 | **Multi-Tenant Architecture** | Each school operates in complete data isolation. One deployment serves hundreds of schools, each with its own branding, calendar, and configuration. Schools never see each other's data — enforced at the database level with Row Level Security (RLS). |
| 2 | **Built for African Schools** | Designed with the Nigerian academic system in mind — 3-term calendar, Naira-based fee tracking, Nigerian phone formats, local address conventions, and support for school structures common across West Africa. |
| 3 | **Role-Based Access Control (RBAC)** | Four distinct roles — **Super Admin**, **School Admin**, **Teacher**, and **Parent** — each with tailored dashboards, permissions, and workflows. Teachers see only their classes; parents see only their children's data. |
| 4 | **Zero-Config Onboarding** | New school admins go through a guided 3-step wizard: register school details → configure academic calendar → launch. The school is production-ready in under 5 minutes. |
| 5 | **Supabase-Powered Backend** | Leverages Supabase for authentication, real-time Postgres database, storage, and Row Level Security — delivering a production-grade backend without managing servers. |
| 6 | **Modern Developer Experience** | React 19 + TypeScript + Vite means blazing-fast HMR, full type safety across the stack (including database types), and a component architecture ready for scale. |
| 7 | **SaaS-Ready from Day One** | Built-in subscription plan field, tenant isolation, and super admin oversight — ready to monetize as a hosted service or deploy on-premise for larger institutions. |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI rendering with latest concurrent features |
| **Language** | TypeScript 6.0 | End-to-end type safety |
| **Bundler** | Vite 8.0 | Lightning-fast dev server & builds |
| **Routing** | React Router 7 | Declarative routing with nested layouts |
| **Backend** | Supabase | Auth, Postgres DB, Storage, RLS |
| **Styling** | Vanilla CSS | Custom design system, no framework lock-in |
| **State** | React Context | Lightweight auth state management |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Landing  │  │  Login   │  │Onboarding│  │Dashboard│ │
│  │  Page    │  │  Page    │  │ Wizard   │  │ Shells  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                       │                         │       │
│              ┌────────┴────────┐                │       │
│              │   Auth Store    │────────────────┘       │
│              │ (React Context) │                        │
│              └────────┬────────┘                        │
│                       │                                 │
│              ┌────────┴────────┐                        │
│              │ Supabase Client │                        │
│              └────────┬────────┘                        │
└───────────────────────┼─────────────────────────────────┘
                        │ HTTPS
┌───────────────────────┼─────────────────────────────────┐
│                  SUPABASE (Backend)                      │
│                       │                                 │
│  ┌────────────────────┼────────────────────────────┐    │
│  │              PostgreSQL Database                │    │
│  │                                                 │    │
│  │  profiles ◄──► schools ◄──► academic_terms      │    │
│  │  students ◄──► classes ◄──► enrollments         │    │
│  │  teachers ◄──► subjects ◄──► timetable          │    │
│  │  attendance    grades      fees                  │    │
│  │  parents  ◄──► student_parents                   │    │
│  │                                                 │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │        Row Level Security (RLS)          │   │    │
│  │  │  • Tenant isolation per school           │   │    │
│  │  │  • Role-based data access                │   │    │
│  │  │  • Self-service profile management       │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │     Auth     │  │   Storage    │  │  Realtime     │   │
│  │  (Email/PW)  │  │ (Logo files) │  │  (Future)     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Features Built So Far

### 🔐 Authentication System
- [x] Email/password login with Supabase Auth
- [x] Password reset flow (email-based)
- [x] Auto-profile creation on signup (via Postgres trigger)
- [x] Session persistence & auto-restore on page reload
- [x] Auth state listener for real-time session changes

### 🛡 Authorization & Routing
- [x] Role-based route protection (`RequireAuth` guard)
- [x] Four roles: `super_admin`, `admin`, `teacher`, `parent`
- [x] Automatic redirect to role-specific dashboard after login
- [x] Admin without school → auto-redirect to onboarding
- [x] Wrong-role access → redirect to correct dashboard

### 🧙 School Onboarding Wizard (3 Steps)
- [x] **Step 1 — School Details**: Name, address, phone, email, logo upload with preview
- [x] **Step 2 — Academic Calendar**: Academic year, 3 term configuration with dates, current term selection
- [x] **Step 3 — Review & Launch**: Full summary before submission
- [x] Progress bar with step indicators and completion checkmarks
- [x] Logo upload to Supabase Storage with public URL generation
- [x] Creates school → inserts terms → links admin profile → redirects to dashboard

### 📄 Pages
- [x] **Landing Page** — Public marketing page with feature cards and CTA
- [x] **Login Page** — Polished auth UI with error handling and forgot-password flow
- [x] **Admin Dashboard** — Shell with stat cards (Students, Teachers, Classes, Fees)
- [x] **Teacher Dashboard** — Shell with role-specific placeholder
- [x] **Parent Dashboard** — Shell with role-specific placeholder
- [x] **Super Admin Dashboard** — Shell with role-specific placeholder

### 🗄 Database
- [x] 2 Supabase migrations applied (`profiles`, `schools + academic_terms`)
- [x] Full TypeScript types for 14 database tables
- [x] Row Level Security policies for tenant isolation
- [x] Auto `updated_at` trigger on profile changes
- [x] Auto profile creation trigger on user signup

### 🎨 Design System
- [x] Custom CSS design system (~19KB) with:
  - Indigo/violet gradient theme
  - Form components, buttons, cards
  - Dashboard layouts and stat cards
  - Onboarding wizard styles
  - Loading spinners and alerts
  - Responsive design foundations

---

## 🗄 Database Schema

The platform defines **14 tables** with full TypeScript type coverage:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles (extends Supabase Auth) | role, school_id, full_name |
| `schools` | School tenants | name, address, subscription_plan |
| `academic_terms` | Term dates per school | school_id, start/end dates, is_current |
| `students` | Student records | admission_number, enrollment_date, status |
| `teachers` | Teacher records | employee_id, department, specialization |
| `classes` | Class/section definitions | grade_level, section, class_teacher_id |
| `subjects` | Subject catalog | code, credit_hours, is_elective |
| `departments` | Academic departments | head_teacher_id |
| `enrollments` | Student-class assignments | student_id, class_id, academic_year |
| `attendance` | Daily attendance logs | student_id, date, status, recorded_by |
| `grades` | Assessment scores | score, grade, term, exam_type |
| `fees` | Fee records & payments | amount, fee_type, status, payment_method |
| `parents` | Parent/guardian profiles | phone, occupation |
| `student_parents` | Student ↔ Parent junction | relationship, is_primary_contact |
| `timetable` | Weekly class schedule | day_of_week, start/end time, room |

### Entity Relationships

```
profiles ──── auth.users (1:1)
profiles ───► schools (N:1)
schools ───► academic_terms (1:N)

students ───► enrollments ◄─── classes
students ───► attendance
students ───► grades ◄─── subjects
students ───► fees
students ───► student_parents ◄─── parents

teachers ───► departments
classes ───► teachers (class_teacher)
timetable ──► classes, subjects, teachers
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- A **Supabase** project ([create one free](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/Sumorpho17/school-management.git
cd school-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> Get these from: [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

### 4. Run Database Migrations

Open the **Supabase SQL Editor** and run, in order:

1. `supabase/migrations/001_profiles.sql` — Creates profiles table, triggers, and RLS policies
2. `supabase/migrations/002_schools.sql` — Creates schools, academic_terms, and tenant RLS

### 5. Create a Test Admin User

In the Supabase Dashboard → Authentication → Users → **Add User**:
- Email: `admin@test.com`
- Password: your choice

Then in the SQL Editor, promote them to admin:

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

### 6. Start the Dev Server

```bash
npm run dev
```

Visit `http://localhost:5173` — log in with your admin credentials and you'll be guided through the school onboarding wizard.

---

## 📁 Project Structure

```
school-management/
├── public/
│   ├── favicon.svg              # App favicon
│   └── icons.svg                # SVG icon sprite
├── src/
│   ├── assets/                  # Static assets (images, SVGs)
│   ├── components/
│   │   └── auth/
│   │       ├── LoginPage.tsx    # Login UI with forgot-password
│   │       └── RequireAuth.tsx  # Route guard (role-based + onboarding)
│   ├── lib/
│   │   └── supabase.ts         # Supabase client initialization
│   ├── pages/
│   │   ├── LandingPage.tsx     # Public marketing landing page
│   │   ├── dashboards/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   ├── ParentDashboard.tsx
│   │   │   └── SuperAdminDashboard.tsx
│   │   └── onboarding/
│   │       └── SchoolSetup.tsx  # 3-step school onboarding wizard
│   ├── store/
│   │   └── authStore.tsx       # Auth context (login, logout, profile)
│   ├── types/
│   │   └── database.ts         # Full Supabase DB types (14 tables)
│   ├── App.tsx                 # Router configuration
│   ├── App.css                 # Complete design system
│   ├── index.css               # CSS reset & base styles
│   └── main.tsx                # App entry point
├── supabase/
│   └── migrations/
│       ├── 001_profiles.sql    # Profiles, triggers, RLS
│       └── 002_schools.sql     # Schools, terms, tenant RLS
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🗺 Roadmap

### Phase 1 — Foundation ✅ (Current)
- [x] Project scaffolding (React + Vite + TypeScript)
- [x] Supabase integration (Auth + Database + Storage)
- [x] Authentication flow (login, logout, password reset)
- [x] Role-based routing and route guards
- [x] School onboarding wizard
- [x] Dashboard shells for all 4 roles
- [x] Database schema design (14 tables)

### Phase 2 — Core Modules 🚧 (Next)
- [ ] **Admin Dashboard** — Live stats, charts, quick actions
- [ ] **Student Management** — Full CRUD, search, filters, bulk import
- [ ] **Teacher Management** — CRUD, department assignment
- [ ] **Class & Subject Management** — Create classes, assign teachers
- [ ] **Sidebar Navigation** — Collapsible sidebar with module links

### Phase 3 — Academic Operations
- [ ] **Attendance Tracking** — Daily marking, reports, trends
- [ ] **Grading System** — Score entry, auto-grade calculation, report cards
- [ ] **Timetable Builder** — Visual drag-and-drop schedule creator
- [ ] **Exam Management** — Exam scheduling, score sheets

### Phase 4 — Finance & Communication
- [ ] **Fee Management** — Fee structures, invoicing, payment tracking
- [ ] **Receipt Generation** — PDF receipts with school branding
- [ ] **Parent Portal** — View child's grades, attendance, fees
- [ ] **Notifications** — In-app + email notifications for parents

### Phase 5 — Advanced Features
- [ ] **Analytics Dashboard** — Enrollment trends, performance insights
- [ ] **Super Admin Panel** — Manage all schools, subscriptions, billing
- [ ] **Bulk Import/Export** — CSV/Excel import for students, teachers
- [ ] **Mobile Responsive** — Full mobile optimization
- [ ] **Dark Mode** — System-aware theme switching
- [ ] **Localization** — Multi-language support (Yoruba, Hausa, Igbo)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/student-management`
3. Commit your changes: `git commit -m "feat: add student CRUD module"`
4. Push to the branch: `git push origin feature/student-management`
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `style:` — Styling (no logic changes)
- `refactor:` — Code restructuring
- `chore:` — Tooling, config, dependencies

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for African schools<br/>
  <strong>SchoolHub</strong> — Modern School Management, Simplified.
</p>
