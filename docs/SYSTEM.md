# System Specification — apts.jp Photo Sorting Agent

## Purpose

Demonstrate to Hendrik (CEO, apts.jp) that AI can automatically sort apartment listing photos in the order most likely to convert foreign tenants browsing in Tokyo. Currently Hendrik spends hours daily doing this manually.

## Architecture

### Frontend
- React + Vite single-page application
- No backend — all data embedded as base64 in `src/data.js`
- Deployed on Cloudflare Pages with GitHub auto-deploy

### Data flow
```
apts.jp listings → scrape photos → base64 embed in data.js
                                         ↓
                              Vision Agent analyzes each photo
                                         ↓
                              AI results + aiOrder written to data.js
                                         ↓
                              App.jsx reads data.js, renders UI
```

### File ownership

| File | Owner | Description |
|------|-------|-------------|
| `src/App.jsx` | Layout Agent | UI component, ~25KB |
| `src/data.js` | Vision Agent | Photos + AI data, ~2.4MB |
| `docs/*` | Layout Agent | Documentation and agent prompts |
| `vite.config.js` | Layout Agent | Build config (base: /aptsjp/) |

### Deployment

- **Repository**: `github.com/marco-meistery/apts-agents`
- **Production URL**: `clients.datameister.jp/aptsjp`
- **Fallback URL**: `apts-agents.pages.dev/aptsjp`
- **DNS**: `clients` CNAME → `apts-agents.pages.dev` (Cloudflare-proxied)
- **Auto-deploy**: Push to `main` → GitHub Actions → `wrangler pages deploy`

## Current listings (4 properties, 37 photos)

1. Gran Heights Ikejiri #0604 — 2 Bed, 80.48m², Setagaya-ku, ¥415,000/mo (10 photos)
2. Residia Shinjuku East Ⅱ #0801 — 2 Bed, 53.96m², Shinjuku-ku, ¥310,000/mo (10 photos)
3. Premier Stage Ichigaya Kawadacho #702 — 1 Bed, 47.76m², Shinjuku-ku, ¥239,000/mo (10 photos)
4. Park Axis Shibuya Jinnan #1001 — Studio, 38.23m², Shibuya-ku, ¥240,000/mo (7 photos)

## AI analysis schema

Each photo's `ai` object:

| Field | Type | Description |
|-------|------|-------------|
| `room_en` | string | English room name (e.g., "Living/dining room") |
| `room_jp` | string | Japanese name (e.g., "リビングダイニング") |
| `description` | string | Compelling, publishable description for the listing |
| `brightness` | 1-5 | Light quality |
| `composition` | 1-5 | Framing quality |
| `spaciousness` | 1-5 | Sense of space |
| `clutter` | 1-5 | 1=clean, 5=messy |
| `stars` | 1-5 | Overall quality |
| `remove` | boolean | AI recommends removal |
| `remove_reason` | string | Why (if remove=true) |

## Optimal photo ordering principles

1. **Hero** = most impressive interior (LDK/living room). Never exterior or floor plan.
2. Living spaces → bedrooms → kitchen
3. Wet areas: washroom → bathroom → toilet
4. Outdoor: balcony → view
5. Building: lobby → exterior
6. Floor plan always last
