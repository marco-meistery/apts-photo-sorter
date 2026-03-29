# apts-agents — AI Photo Sorting Agent for apts.jp

## Project overview

A prototype showing how AI can reorder apartment listing photos for optimal conversion on apts.jp (Tokyo real estate for expats). Built for DataMeister (datameister.co.jp) to pitch to Hendrik, CEO of apts.jp.

**Production:** https://clients.datameister.jp/aptsjp
**Fallback:** https://apts-agents.pages.dev/aptsjp

## Repository structure

```
src/
  App.jsx    — React component (layout, UI, interactions) — DO NOT EDIT
  data.js    — LISTINGS array with base64 photos + AI analysis results
  main.jsx   — Entry point
docs/
  SYSTEM.md           — Full system specification
  VISION_AGENT.md     — Prompt for the AI vision analysis agent
  DEPLOY_AGENT.md     — Prompt for the deployment agent
.claude/
  commands/vision-analyze.md  — Slash command: /vision-analyze
  skills/deploy/SKILL.md      — Deploy skill
```

## Three-agent architecture

| Agent | Owns | Never touches |
|-------|------|--------------|
| **Layout Agent** (Claude chat) | `src/App.jsx` | `src/data.js` |
| **Vision Agent** (Claude Code) | `src/data.js` | `src/App.jsx` |
| **Deploy Agent** (Claude Code) | builds + pushes | data content |

## Critical rules

1. **`src/data.js` is sacred.** It contains base64 photos + AI analysis (~11MB with 10 listings). Layout updates NEVER overwrite this file. Zips contain a placeholder stub — never copy it.
2. **`src/App.jsx` imports from `data.js`.** The import `import { LISTINGS } from "./data.js"` must always be present.
3. **Deploys auto-trigger** on push to `main` via GitHub Actions → Cloudflare Pages.
4. **Base path is `/aptsjp/`** — set in `vite.config.js`. Never remove this.

## Deployment infrastructure

- **GitHub repo:** `marco-meistery/apts-photo-sorter`
- **Branch:** `main`
- **CI:** GitHub Actions (`.github/workflows/deploy.yml`)
- **Hosting:** Cloudflare Pages project **`apts-agents`** (NOT `apts-photo-sorter`)
- **Custom domain:** `clients.datameister.jp` → `apts-agents` CF Pages project
- **Deploy command:** `wrangler pages deploy dist --project-name=apts-agents`

The `apts-photo-sorter` CF Pages project also exists but has NO custom domain. The production domain routes to `apts-agents`. Always verify the workflow targets `apts-agents`.

## Vision agent: data format

Each photo's `ai` object uses a single `description` field (not the old `ai_sees` + `desc`):

```js
ai: {
  room_en: "Living/dining room",
  room_jp: "リビングダイニング",
  description: "2-3 sentence compelling, publishable description.",
  brightness: 4, composition: 5, spaciousness: 5, clutter: 1,
  stars: 5,
  remove: false, remove_reason: ""
}
```

When replacing ai blocks in data.js, **process each listing in its own section** to avoid origIdx collisions (origIdx 0-11 repeats across listings). Use listing title to find section boundaries.

## Vision agent: known pitfalls

- **origIdx collision:** Each listing has photos numbered 0-N. A naive regex like `/origIdx:0,ai:\{/` matches the FIRST listing's P0, not the target listing. Always slice data.js by listing section first.
- **New listings have pending placeholders:** Check `grep -c "(pending)" src/data.js` — if non-zero, new photos need analysis.
- **Zip data.js is always a stub:** `export const LISTINGS = [];` — never use it.

## Branding

- DataMeister colors: `#0097cc` (teal), `#0d7a50` (green)
- Logo: embedded as base64 SVG in `App.jsx` (from datameister.co.jp)

## How to develop locally

```bash
npm install
npm run dev    # http://localhost:5173/aptsjp/
npm run build  # Production build to dist/
```

## Useful commands

```bash
# Check deployment status
wrangler pages deployment list --project-name=apts-agents
gh run list --limit 3

# Verify production
curl -sI https://clients.datameister.jp/aptsjp/ | head -5

# Check data.js health
grep -c "(pending)" src/data.js    # 0 = all analyzed
grep -c 'aiOrder:\[' src/data.js   # should equal number of listings
grep -c 'stars:0' src/data.js      # 0 = all scored
```
