# EvenCounter

> Every entry, counted.

Digital event attendance cards and live gate counts for Jamaican event organizers.

## Features
- Create events, issue QR digital cards to guests
- Gate staff scan with any smartphone browser (no app install)
- Live headcount dashboard with Supabase Realtime
- Single-use cards prevent double-entry

## Stack
- **Next.js 16** (App Router, TypeScript)
- **Supabase** (Postgres, Realtime, Auth magic link)
- **Tailwind CSS v4**
- **Vercel** (deploy)

## Local setup

```bash
# 1. Clone and install
npm install

# 2. Copy env
cp .env.example .env.local
# Fill in your Supabase URL + keys

# 3. Run migrations on your Supabase project
# (paste contents of supabase/migrations/*.sql into Supabase SQL Editor)

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Vitest unit tests |
| `npm run format` | Prettier format |

## Docs
- [PRD](docs/PRD.md) — product requirements
- [Brand](docs/BRAND.md) — design system
- [Plan](docs/PLAN.md) — project phases

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add env vars from `.env.example`
4. Deploy
