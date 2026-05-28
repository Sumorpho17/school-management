# SchoolHub — AGENTS.md

## Commands
- `npm run dev` — Vite dev server at localhost:5173
- `npm run build` — `tsc -b && vite build` (project references build, not `tsc --noEmit`)
- `npm run lint` — ESLint with `@eslint/js`, `typescript-eslint`, `react-hooks`, `react-refresh` (flat config)

## Tech stack
- **React 19** + **TypeScript 6** + **Vite 8** + **React Router 7**
- **Supabase** (Auth, Postgres, Storage, RLS) — no backend server to run
- **Vanilla CSS** (no Tailwind, no CSS-in-JS, no modules) — design system in `src/App.css`

## TypeScript quirks
- `verbatimModuleSyntax: true` — must use `import type` for type-only imports
- `erasableSyntaxOnly: true` — no runtime enums, no `namespace`, no parameter properties
- `noUnusedLocals` + `noUnusedParameters` — lint-level strictness
- Module resolution is `bundler` mode

## Project structure
- `src/main.tsx` — entry point (`StrictMode > AuthProvider > App`)
- `src/App.tsx` — all routes via `createBrowserRouter`
- `src/store/authStore.tsx` — React Context auth (login, logout, profile, role, schoolId)
- `src/lib/supabase.ts` — typed Supabase client singleton
- `src/types/database.ts` — **hand-written** Supabase types (not generated)
- `src/components/auth/RequireAuth.tsx` — role-based route guard + onboarding redirect
- `src/components/layout/DashboardLayout.tsx` — shared layout with `Sidebar` wrapping `<Outlet />`
- `src/components/layout/Sidebar.tsx` — per-role nav links (admin/teacher/parent/super_admin)
- `src/pages/students/StudentList.tsx` — full CRUD with table, modal, search
- `src/pages/teachers/TeacherList.tsx` — full CRUD with table, modal, search
- `src/pages/classes/ClassList.tsx` — full CRUD with teacher dropdown, search
- `src/pages/subjects/SubjectList.tsx` — full CRUD with elective toggle, search
- `supabase/migrations/` — SQL files applied manually via Supabase SQL Editor

## Roles & routing
- Roles: `super_admin`, `admin`, `teacher`, `parent`
- All authenticated routes use `DashboardLayout` (sidebar + content area)
- Module routes under `/admin`: `dashboard`, `students`, `teachers`, `classes`, `subjects`
- `RequireAuth` handles: unauthenticated → `/login`, wrong role → correct dashboard, admin w/o school → `/onboarding/school-setup`
- `getRoleDashboardPath()` in authStore maps role → dashboard URL

## Database
- 14 tables defined in types; 3 migration files (`001_profiles`, `002_schools`, `003_core_tables`)
- `003_core_tables` adds: `students`, `teachers`, `classes`, `subjects`, `departments`, `enrollments` (each with `school_id`, RLS, `updated_at` trigger)
- RLS: school members can SELECT; admins can ALL (checked via `profiles.school_id` + `role`)
- Auto-profile creation trigger on `auth.users` INSERT
- `updated_at` trigger on all tables via `handle_updated_at()`

## CRUD patterns
- Each module page: single-file component with embedded modal
- Form state managed with `useState` + explicit type annotation (avoids literal narrowing)
- `school_id` from `useAuth()` is `string | null` — guard with `if (schoolId)` then use `schoolId!` in queries
- All queries filter by `school_id` for tenant isolation
- Delete uses `confirm()` dialog before calling `.delete()`
- Database types are hand-written — when adding columns, update `Row`, `Insert`, and `Update` types

## Testing
- No test framework configured (no test script in `package.json`, no test deps)

## Environment
- `.env` must have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Both are checked at import time in `src/lib/supabase.ts` (throws if missing)

## Commit convention
- Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`)
