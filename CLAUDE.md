# apts-agents — AI Photo Sorting Agent for apts.jp

## Project overview

A prototype showing how AI can reorder apartment listing photos for optimal conversion on apts.jp (Tokyo real estate for expats). Built for DataMeister (datameister.co.jp) to pitch to Hendrik, CEO of apts.jp.

Live at: `clients.datameister.jp/aptsjp`

## Repository structure

```
src/
  App.jsx    — React component (layout, UI, interactions)
  data.js    — LISTINGS array with base64 photos + AI analysis results
  main.jsx   — Entry point
docs/
  SYSTEM.md           — Full system specification
  VISION_AGENT.md     — Prompt for the AI vision analysis agent
  DEPLOY_AGENT.md     — Prompt for the deployment agent
```

## Three-agent architecture

| Agent | Owns | Never touches |
|-------|------|--------------|
| **Layout Agent** (Claude chat) | `src/App.jsx` | `src/data.js` |
| **Vision Agent** (Claude Code) | `src/data.js` | `src/App.jsx` |
| **Deploy Agent** (Claude Code) | builds + pushes | data content |

## Critical rules

1. **`src/data.js` is sacred.** It contains ~2.4MB of base64 photos and AI analysis. Layout updates NEVER overwrite this file.
2. **`src/App.jsx` imports from `data.js`.** The import line `import { LISTINGS } from "./data.js"` must always be present.
3. **Deploys auto-trigger** on push to `main` via GitHub Actions → Cloudflare Pages.
4. **Base path is `/aptsjp/`** — set in `vite.config.js`.

## Data structure

Each listing in `src/data.js`:
```js
export const LISTINGS = [
  {
    title: "...", rent: "¥...", area: "...", address: "...",
    beds: "...", sqm: "...", walk: "...", station: "...",
    built: "...", url: "https://apts.jp/properties/...",
    images: [
      {
        src: "data:image/jpeg;base64,...",
        origIdx: 0,
        ai: {
          room_en: "Living/dining room",
          room_jp: "リビングダイニング",
          description: "Compelling description suitable for publishing on the listing page.",
          brightness: 4, composition: 5, spaciousness: 5, clutter: 1,
          stars: 5,
          remove: false, remove_reason: ""
        }
      },
      // ... more images
    ],
    aiOrder: [0, 2, 3, ...]  // Recommended photo order (array of origIdx)
  },
  // ... more listings
];
```

## Branding

- DataMeister colors: `#0097cc` (teal), `#0d7a50` (green)
- Logo: embedded as base64 SVG in `App.jsx` (from datameister.co.jp)

## How to develop locally

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # Production build to dist/
```
