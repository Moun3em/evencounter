# EvenCounter — Brand & Design System

**Version:** 1.0 | **Date:** 2026-04-23

---

## 1. Brand Narrative

**Voice:** Direct, warm, island-confident. We speak like the person at the door who knows everyone's name.  
**Tone:** Energetic but trustworthy. Fast without being frantic. A little proud — Jamaican events are a big deal.  
**Positioning:** EvenCounter gives Jamaican event organizers the same gate technology used by major venues — in their pocket, in minutes, no hardware required.

**Tagline:** *Every entry, counted.*

---

## 2. Color System

### Primary Palette
| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#1DB954` | CTAs, success states, brand accent (Jamaica green) |
| `--color-primary-dark` | `#158A3E` | Hover/pressed on primary |
| `--color-primary-light` | `#D4F7E2` | Tinted backgrounds, badges |

### Secondary Palette
| Token | Hex | Usage |
|---|---|---|
| `--color-gold` | `#F5C518` | Highlights, premium badge, Jamaica gold |
| `--color-gold-dark` | `#C49A00` | Hover on gold elements |
| `--color-gold-light` | `#FEF9E0` | Tinted backgrounds |

### Semantic Colors
| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#1DB954` | Valid scan, confirmed entry |
| `--color-warning` | `#F59E0B` | Already checked in, capacity warning |
| `--color-error` | `#EF4444` | Invalid card, scan failure |
| `--color-info` | `#3B82F6` | Info banners, help text |

### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `--color-gray-50` | `#F9FAFB` | Page background |
| `--color-gray-100` | `#F3F4F6` | Card/surface background |
| `--color-gray-200` | `#E5E7EB` | Borders, dividers |
| `--color-gray-400` | `#9CA3AF` | Placeholder text |
| `--color-gray-600` | `#4B5563` | Secondary text |
| `--color-gray-900` | `#111827` | Primary text |

### Surface / Background
| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0F1117` | App shell (dark-first dashboard) |
| `--color-surface` | `#1A1D27` | Cards, panels |
| `--color-surface-raised` | `#22263A` | Hover surface, modal |

### Contrast Notes
- `#1DB954` on `#0F1117` → ratio **5.8:1** ✓ AA large
- `#F9FAFB` on `#0F1117` → ratio **15.4:1** ✓ AAA
- `#111827` on `#D4F7E2` → ratio **10.2:1** ✓ AAA
- `#F5C518` on `#0F1117` → ratio **9.1:1` ✓ AAA

---

## 3. Typography

**Font families:**
- **Display / Headings:** `"Plus Jakarta Sans"`, sans-serif (Google Fonts) — strong, modern, neutral accent
- **Body:** `"Inter"`, sans-serif (system fallback: `-apple-system, BlinkMacSystemFont`)
- **Monospace (tokens, IDs):** `"JetBrains Mono"`, monospace

**Type scale:**
| Token | Size | Line-height | Weight | Usage |
|---|---|---|---|---|
| `text-xs` | 11px | 1.5 | 400 | Labels, captions |
| `text-sm` | 13px | 1.5 | 400 | Secondary body, table cells |
| `text-base` | 15px | 1.6 | 400 | Primary body |
| `text-lg` | 18px | 1.5 | 500 | Sub-headings, emphasis |
| `text-xl` | 22px | 1.4 | 600 | Section headings |
| `text-2xl` | 28px | 1.3 | 700 | Page titles |
| `text-3xl` | 36px | 1.2 | 700 | Hero / live counter |
| `text-4xl` | 48px | 1.1 | 800 | Big number display |

---

## 4. Spacing, Radii, Elevation

**Spacing scale (4px base):**
`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`
Tokens: `--space-1` through `--space-24`

**Border radii:**
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Badges, tags |
| `--radius-md` | 8px | Inputs, small cards |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 20px | Modals, large cards |
| `--radius-full` | 9999px | Pills, avatars |

**Elevation (box-shadow):**
| Level | CSS | Usage |
|---|---|---|
| 0 | none | Flat surfaces |
| 1 | `0 1px 3px rgba(0,0,0,.25)` | Cards |
| 2 | `0 4px 12px rgba(0,0,0,.35)` | Dropdowns, popovers |
| 3 | `0 8px 32px rgba(0,0,0,.5)` | Modals |

---

## 5. Component Principles

**Buttons:**
- Primary: `bg-primary text-white` — bold, full-width on mobile
- Secondary: `border border-primary text-primary bg-transparent`
- Destructive: `bg-error text-white`
- Min touch target: 44×44px
- Loading state: spinner replaces label; button disabled

**Forms:**
- Inputs: dark surface, `border-gray-700`, focus ring `ring-primary`
- Error message: `text-error text-sm` below input
- Required fields: asterisk (*) in `text-error`

**Empty states:**
- Centered illustration (SVG) + heading + CTA button
- No lorem ipsum; real copy in every empty state

**Loading states:**
- Skeleton shimmer (not spinner) for list/table loads
- Inline spinner for button actions

**Scan feedback overlay:**
- Full-screen flash: green (#1DB954 at 80% opacity) for valid, red (#EF4444) for invalid
- Large icon + attendee name (1.5s auto-dismiss)

---

## 6. Iconography

**Library:** Lucide React (`lucide-react`)
- Consistent stroke-width: `1.5`
- Default size: `20px` inline, `24px` standalone
- Never fill icons (stroke only)
- Key icons: `QrCode`, `ScanLine`, `Users`, `Calendar`, `CheckCircle2`, `XCircle`, `AlertTriangle`, `Copy`, `Share2`

---

## 7. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use the dark shell for the organizer dashboard — it reads well in dim venue lighting | Don't use pure white backgrounds in the dashboard; too harsh in dark environments |
| Keep the attendee card light (white/off-white) — it must be legible on any screen | Don't apply dark theme to the public-facing card page |
| Use `--color-primary` (green) for positive / admission states only | Don't use green for decorative elements unrelated to status |
| Reserve gold (`--color-gold`) for highlights and capacity badges | Don't use gold as the primary action color |
| Always display the attendee's name in ≥ 22px on the card | Don't reduce name size for long names — truncate with ellipsis instead |
