# EvenCounter — Project Plan

**Version:** 1.0 | **Date:** 2026-04-23

---

## Stage 0 — Repo Hygiene ✅ IN PROGRESS
**Goal:** Clean, runnable scaffold with CI, linting, formatting, env config, and README.  
**Exit criteria:** `npm run dev` starts; `npm run lint` passes; `npm run build` passes; CI green.

### Scope
- [x] Next.js 15 App Router (TypeScript strict)
- [x] Tailwind CSS v4 + shadcn/ui init
- [x] ESLint + Prettier config
- [x] `.env.example` documented
- [x] `README.md` with local run instructions
- [x] Husky pre-commit hook (lint-staged)
- [x] GitHub Actions CI (lint + typecheck + build)
- [x] `docs/PRD.md`, `docs/BRAND.md`, `docs/PLAN.md`

**Risks:** None — greenfield.  
**Manual test:** `npm run dev` → localhost:3000 shows placeholder home.  
**Automated:** CI lint + build.

---

## Stage 1 — Data Model + Migrations
**Goal:** Full schema in Supabase with RLS, seeded locally.  
**Exit criteria:** `supabase db reset` seeds all tables; RLS policies verified via test queries.

### Scope
Tables:
- `organizations` (id, name, owner_id, created_at)
- `events` (id, org_id, name, date, venue, capacity, status, scan_pin, created_at)
- `attendees` (id, event_id, name, phone, email, card_token, created_at)
- `check_ins` (id, attendee_id, event_id, checked_in_at, scanner_session)

Files touched: `supabase/migrations/`, `src/lib/db/types.ts` (generated), `src/lib/db/schema.ts`

**Risks:** Supabase free tier limits (2 projects, 500MB). Use single project.  
**Mitigation:** Namespace events by `org_id`; archive old events.  
**Manual test:** Supabase Studio shows tables + policies.  
**Automated:** Supabase migration history CI check.

---

## Stage 2 — Auth + Org Model
**Goal:** Organizer can sign in with magic link, see their dashboard.  
**Exit criteria:** Sign-in flow works E2E; org is auto-created on first login; protected routes redirect unauthenticated users.

### Scope
- Supabase Auth (magic link)
- `(auth)` route group: `/login`, `/auth/callback`
- `(dashboard)` route group with layout middleware
- Org auto-creation trigger (Postgres function on user insert)
- `src/lib/auth/` helpers

**Risks:** Magic link email delivery on free tier (Supabase SMTP limits 3/hr dev).  
**Mitigation:** Use Resend SMTP in staging/prod; document in `.env.example`.  
**Manual test:** Sign in → redirected to dashboard → org row exists.  
**Automated:** Playwright auth flow (Stage 5).

---

## Stage 3 — Core Product Flows
**Goal:** Full P0 user journey: create event → issue cards → scan → live count.  
**Exit criteria:** US-01 through US-08 all pass acceptance criteria.

### Scope
**3a — Event CRUD**
- `/dashboard` — event list
- `/dashboard/events/new` — create form
- `/dashboard/events/[id]` — event detail + attendee list + live counter

**3b — Attendee & Card**
- Add attendee form (name + phone/email)
- Card token generation (CUID2)
- `/card/[token]` — public attendee card with QR code
- Share link copy/WhatsApp

**3c — Scan Gate**
- `/scan/[eventId]` — PIN entry → camera scan
- QR decode → API call → green/red overlay feedback
- Scanner session name set at PIN entry

**3d — Live Dashboard**
- Supabase Realtime subscription on `check_ins`
- Live counter component + attendee list status

Files: `src/app/(dashboard)/`, `src/app/card/`, `src/app/scan/`, `src/app/api/`, `src/components/`

**Risks:** Camera API blocked on non-HTTPS localhost.  
**Mitigation:** Use `localhost` (browser allows camera); production HTTPS on Vercel.  
**Manual test:** Full happy path on mobile Chrome + Safari.  
**Automated:** Unit tests for card token validation logic; API route tests.

---

## Stage 4 — Polish
**Goal:** Production-quality UX — a11y, error/empty states, performance.  
**Exit criteria:** Lighthouse mobile ≥ 90; no a11y errors in axe; all empty/error states designed.

### Scope
- Empty states: no events, no attendees, no check-ins
- Error states: invalid card, expired event, scan error
- Loading skeletons for dashboard lists
- Offline card page (service worker via next-pwa or custom)
- WCAG 2.1 AA audit (axe-core)
- Performance: image optimization, font preload, bundle analysis

**Risks:** Service worker conflicts with Next.js App Router.  
**Mitigation:** Use `next-pwa` v5 or manual `public/sw.js` with cache-first for card routes only.

---

## Stage 5 — Hardening
**Goal:** Test coverage, security pass, production deploy checklist.  
**Exit criteria:** Key flows covered by tests; security review passed; Vercel preview + prod deploy green.

### Scope
- Vitest unit tests: token generation, scan validation logic, date formatting
- Playwright E2E: sign-in → create event → add attendee → scan card
- Security: RLS double-check, API rate limiting (Vercel Edge), token entropy audit
- `.env.example` complete; production env vars documented
- Vercel project linked; preview deploy on PR; prod deploy on `main`
- `README.md` finalized

**Risks:** Playwright flakiness on camera permissions.  
**Mitigation:** Mock camera in E2E; test scan API directly.

---

## Current Status

| Stage | Status |
|---|---|
| Stage 0 — Repo hygiene | ✅ Done |
| Stage 1 — Data model | ✅ Done (migration SQL + types) |
| Stage 2 — Auth | ✅ Done (magic link + middleware) |
| Stage 3 — Core flows | ✅ Done (create event, cards, scan, live counter) |
| Stage 4 — Polish | 🟡 Partial (empty states done; a11y + Lighthouse audit pending) |
| Stage 5 — Hardening | 🟡 Partial (unit tests + CI; E2E + security audit pending) |
