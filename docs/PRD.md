# EvenCounter — Product Requirements Document

**Version:** 1.0  
**Date:** 2026-04-23  
**Owner:** Mounaim / Monipathos  

---

## 1. Problem & Goals

### Problem
Jamaican event organizers (concerts, fetes, community events, church services) rely on paper tickets or informal WhatsApp lists to manage attendance. Staff at the gate have no quick way to verify authenticity, prevent re-entry, or see live headcounts. Overbooking and fraud are common; post-event reports are manual guesswork.

### Goals (measurable)
| Metric | MVP target |
|---|---|
| Time to scan & admit one attendee | < 3 seconds |
| False-positive admissions (duplicate scans) | 0% |
| Organizer setup time (create event + issue 10 cards) | < 5 minutes |
| Live count accuracy vs. actual entries | 100% |
| Lighthouse mobile score | ≥ 90 |

---

## 2. User Personas

### Persona 1 — "Bouncer Barry" (Gate Staff)
- Age 25–40, smartphone fluency: basic. Uses the phone camera every day.
- Goal: scan a card quickly and let the right people in without arguments.
- Pain: slow systems, fake tickets, no feedback if something goes wrong.

### Persona 2 — "Organizer Odette" (Event Organizer)
- Age 30–55, runs 2–8 events/year (concerts, galas, church fundraisers).
- Goal: know exactly how many people entered, stop double-entry, have a digital record.
- Pain: manual counting, lost paper tickets, arguments at the gate.

### Persona 3 — "Attendee Andre"
- Age 18–45, receives event invite via WhatsApp or Instagram.
- Goal: show up, get in fast, not deal with paperwork.
- Pain: lost tickets, queue delays, being told "your name isn't on the list."

---

## 3. User Stories (prioritized)

### P0 — MVP must-have
| # | Story | Acceptance criteria |
|---|---|---|
| US-01 | As Odette, I can create an event with a name, date, venue, and capacity | Event saved; appears in my dashboard |
| US-02 | As Odette, I can add attendees (name + contact) and each gets a unique digital card (QR) | Card generated; accessible via shareable link |
| US-03 | As Odette, I can share a card link via WhatsApp/copy | Link opens card on any smartphone |
| US-04 | As Andre, I can open my card link and see my name, event details, and QR code | No login required; works offline after first load |
| US-05 | As Barry, I can open a scan page on my phone and scan a QR code | Camera opens; no app install required |
| US-06 | As Barry, I see immediate green/red feedback: valid + name, or invalid/already-used | Feedback within 2s; sound optional |
| US-07 | As Odette, I can see a live count of how many people have entered | Count updates in real-time; shows entered / capacity |
| US-08 | As Odette, I can see which attendees have checked in and when | List sortable by name / check-in time |

### P1 — Next sprint
| # | Story |
|---|---|
| US-09 | As Odette, I can bulk-import attendees via CSV |
| US-10 | As Odette, I can have multiple gate staff scanning simultaneously |
| US-11 | As Odette, I can export the check-in report as CSV |
| US-12 | As Odette, I can create multiple events under one account |

### P2 — Future
| # | Story |
|---|---|
| US-13 | As Odette, I can brand the card with my event poster/logo |
| US-14 | As Odette, I can send reminder cards via WhatsApp Business API |
| US-15 | As Andre, I can add my card to Apple/Google Wallet |
| US-16 | Paid ticket integration (Stripe) |

---

## 4. Functional Requirements

### FR-01 — Event Management
- **FR-01.1** Organizer can create an event: `name` (required), `date` (required), `venue` (text), `capacity` (integer, optional).
- **FR-01.2** Event has statuses: `draft`, `active`, `closed`.
- **FR-01.3** Organizer can edit event details before it goes `active`.

### FR-02 — Attendee & Card Management
- **FR-02.1** Organizer adds an attendee: `name` (required), `phone` or `email` (one required).
- **FR-02.2** System generates a unique, unguessable card token (UUID v4 or CUID2).
- **FR-02.3** Card is accessible at `/card/[token]` — no auth required.
- **FR-02.4** Card displays: attendee name, event name, date, venue, QR code encoding the token.
- **FR-02.5** Card is mobile-optimized and can be saved as screenshot / added to homescreen (PWA).

### FR-03 — Scanning & Verification
- **FR-03.1** Scan page at `/scan/[eventId]` — protected by event-specific PIN (4–6 digits set by organizer).
- **FR-03.2** On valid first scan: mark card `checked_in`, record timestamp and scanner session ID; show green confirmation with attendee name.
- **FR-03.3** On duplicate scan: show amber warning "Already checked in at [time]" — do not increment count.
- **FR-03.4** On invalid token: show red error "Card not recognized."
- **FR-03.5** On capacity reached: show warning to organizer dashboard; scanning still works (organizer's call).

### FR-04 — Live Dashboard
- **FR-04.1** Real-time counter: checked in / total invited / capacity (if set).
- **FR-04.2** Attendee list with columns: name, status (pending/checked-in), check-in time.
- **FR-04.3** Dashboard polls or uses Supabase Realtime; latency < 5s.

### FR-05 — Auth
- **FR-05.1** Organizers sign in via email magic link (no password).
- **FR-05.2** No auth required for attendees (card is public link).
- **FR-05.3** Scan page protected by PIN only (no account needed for staff).

---

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | FCP < 2s on 4G mobile; card page < 100KB JS |
| Availability | Supabase free tier SLA; no SLA promise in v1 |
| Security | All org data isolated by `org_id` RLS; card tokens are unguessable (128-bit entropy) |
| Privacy | No PII stored beyond name + contact; GDPR-lite: delete endpoint for orgs |
| Accessibility | WCAG 2.1 AA for organizer dashboard; card page AAA contrast |
| Browser support | Last 2 Chrome/Safari/Firefox; camera API required for scan |
| Offline | Card page functional offline after first load (service worker) |
| Locale | English (en-JA tone); date format DD/MM/YYYY; phone prefix +1-876 suggested |

---

## 6. Out of Scope (v1)

- Payment / ticketing (Stripe)
- SMS / WhatsApp delivery of cards
- Apple/Google Wallet passes
- Multi-org / team accounts
- Analytics / revenue reporting
- Seating maps
- QR code printing / PDF batch export
- Mobile native app (iOS/Android)

---

## 7. Risks & Open Questions

| Risk | Likelihood | Mitigation |
|---|---|---|
| No internet at venue | Medium | Card works offline; scan page needs connectivity (Supabase write) |
| Organizer shares scan PIN publicly | Low | PIN is per-event; organizer can regenerate |
| QR screenshot spoofing | Low | Token is single-use; duplicate scan triggers warning |
| Supabase free tier cold starts | Medium | Edge functions on Vercel; Supabase connection pooling |

**Open questions:**
1. Should cards have an expiry (e.g. 24h after event)? → Default: no expiry in v1.
2. Should organizer see scanner identity? → Default: scanner "session name" set at PIN entry.

---

## 8. MVP Cut Line

**Ships in MVP (P0):** US-01 through US-08 — create event, issue cards, scan at gate, live count.  
**Does not ship in MVP:** All P1/P2 stories, payment, bulk import, wallet passes.

**Stack (inferred defaults — flag if you disagree):**
- **Framework:** Next.js 15 App Router (TypeScript)
- **Database:** Supabase (Postgres + Realtime + Auth)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **QR:** `qrcode.react` (client-side generation)
- **QR Scan:** `html5-qrcode` or `@zxing/browser`
- **Deploy:** Vercel (free tier)
- **Auth:** Supabase Magic Link
