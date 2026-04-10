# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SBTI (人格测试) — a personality assessment web app. Users answer 31 questions across 15 psychological dimensions, and the system matches them to one of 29 personality types (plus one hidden "DRUNK" type) via weighted vector similarity. Results can be shared as images with QR codes, and a global ranking is tracked via Upstash Redis.

**Language**: Chinese (UI text, questions, type descriptions are all in Chinese)

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), CSS3, no framework, no build tools
- **Backend**: Vercel Serverless Functions (Node.js)
- **Storage**: Upstash Redis (sorted sets for rankings, counters for totals)
- **Payments**: Stripe Checkout (overseas), 面包多/爱发电 QR (China, trust-based)
- **Ads**: Monetag (global traffic, interstitial + banners)
- **CDN libs**: html2canvas 1.4.1 (screenshot generation), qrcode-generator 1.4.4
- **Deployment**: Vercel (zero-config, no vercel.json)

## Development

There is no build step. The frontend is static files served directly.

```bash
npm install              # install @upstash/redis for API functions
# Open index.html directly or use any local server
# Debug mode: navigate to #test (auto-fills answers, shows dimension names)
```

No test framework, no linter, no TypeScript configured. The `npm test` script is a placeholder.

## Environment Variables (for Vercel serverless functions)

- `KV_REST_API_URL` — Upstash Redis REST endpoint
- `KV_REST_API_TOKEN` — Upstash Redis API token
- `STRIPE_SECRET_KEY` — Stripe API secret key
- `STRIPE_PRICE_ID` — Stripe Price object ID for the $0.99 unlock product

## Architecture

### File Layout

| File | Purpose |
|------|---------|
| `index.html` | SPA shell with all screens, nav, overlays |
| `main.js` (~1770 lines) | All frontend logic, data, and type definitions |
| `main.css` (~1505 lines) | All styling including animations |
| `api/record.js` | POST — validates type, increments Redis sorted set + total counter |
| `api/ranking.js` | GET — returns ranked type list with counts (cached 10s) |
| `api/create-checkout.js` | POST — creates Stripe Checkout session, returns redirect URL |
| `api/verify.js` | POST — verifies Stripe session payment status |

### main.js Structure (top to bottom)

1. **Data definitions** (lines 1–510): `dimensionMeta` (15 dimensions across 5 models: S/E/A/Ac/So), `questions` (31 items), `specialQuestions` (hidden DRUNK trigger), `TYPE_LIBRARY` (29 type definitions with descriptions/tags), `TYPE_IMAGES` (base64 PNGs), `NORMAL_TYPES` (pattern vectors for matching)
2. **App state & DOM refs** (lines ~690–710): `app` object holds `answers`, `shuffledQuestions`, `previewMode`; screen elements cached by ID
3. **Screen management** (~710): `showScreen(name)` toggles between `intro`/`test`/`result`/`compare` using a full-screen overlay
4. **Quiz logic** (~740–920): Question rendering, answer handling, progress tracking, DRUNK detection (specific answer combo triggers hidden type)
5. **Result calculation & display** (~925–1130): Vector similarity matching against `NORMAL_TYPES`, radar chart rendering via canvas, share image generation
6. **Rankings tab** (~1131): Fetches `/api/ranking`, renders leaderboard with rarity indicators
7. **Comparison feature** (~1410–1600): `CompareUtil` encodes/decodes personality data to base64 for URL sharing, radar overlay of two profiles
8. **Tab navigation & init** (~1650+): Tab switching, hash routing, event listeners

### Key Patterns

- **SPA routing**: Hash-based (`#test` for debug mode, `#compare=<base64>` for comparison links)
- **Hidden type trigger**: If user selects specific answers on `drink_gate_q1` + `drink_gate_q2`, result is forced to "DRUNK" type
- **Result matching**: Each NORMAL_TYPE has a 15-dimension pattern vector; user answers are normalized and matched via cosine-like similarity
- **Share images**: `html2canvas` captures a hidden DOM node, overlays QR code linking back to comparison URL
- **Rarity system**: Each type has theoretical rarity (hardcoded) and real rarity (from `/api/ranking` live data), togglable in UI

### Redis Keys

- `sbti:ranking` — sorted set, members are type codes, scores are test counts
- `sbti:total` — integer counter of all tests taken

### Valid Type Codes

`CTRL`, `OJBK`, `THAN-K`, `FAKE`, `SEXY`, `MALO`, `Dior-s`, `MUM`, `ZZZZ`, `LOVE-R`, `IMSB`, `SOLO`, `FUCK`, `GOGO`, `JOKE-R`, `OH-NO`, `MONK`, `SHIT`, `DEAD`, `ATM-er`, `THIN-K`, `WOC!`, `IMFW`, `POOR`, `BOSS`, `HHHH`, `DRUNK`
