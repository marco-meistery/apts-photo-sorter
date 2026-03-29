---
name: deploy
description: Deploy a layout update for the apts-photo-sorter project to Cloudflare Pages. Use this skill when deploying code changes, pushing updates to production, applying layout zips, or when someone says "deploy", "push to prod", "ship it", or "update production". Also use after completing any dev plan that ends with a deploy step.
---

# Deploy — Layout Updates to Production

This skill guides deployment of layout updates for the apts-photo-sorter project. Production is served at `clients.datameister.jp/aptsjp` via Cloudflare Pages (project: **apts-agents**).

## Pre-flight: Verify deploy target

Before anything else, confirm the GitHub Actions workflow points at the correct Cloudflare Pages project. This has been wrong before and caused deploys to silently go to the wrong place.

```bash
grep "project-name" .github/workflows/deploy.yml
```

Expected output: `--project-name=apts-agents`

If it says `apts-photo-sorter` or anything else, fix it before proceeding. The production domain `clients.datameister.jp` is routed to the `apts-agents` CF Pages project.

## Deploy from a zip (layout update)

When deploying a layout update packaged as a zip:

1. Find the most recent `.zip` in the project root or `/zips`.
2. Unzip to a temp location.
3. Copy these files from the zip into the project:
   - `src/App.jsx` (required)
   - `index.html` (if present)
   - `CLAUDE.md` (if present)
   - `docs/*` (if present)
4. **NEVER copy `src/data.js`** from the zip — it's a placeholder stub. The real file in the repo contains ~2.4MB of base64 photos and AI analysis data. Overwriting it would destroy all vision agent work.
5. Build and verify:
   ```bash
   npm install && npm run build
   ```
6. If the build fails, check that `src/App.jsx` still has `import { LISTINGS } from "./data.js"` and that `src/data.js` exports `LISTINGS`.
7. Commit and push:
   ```bash
   git add -A
   git commit -m "feat: layout update — <brief description>"
   git push origin main
   ```
8. Move the zip to `/zips` with a timestamp: `apts-photo-sorter_YYYYMMDD-HHMM.zip`
9. Clean up any temp files.

## Deploy from code changes (no zip)

When deploying after direct code edits (e.g., after a dev plan):

1. Build: `npm run build` — must succeed with no errors.
2. Commit the changed files (typically just `src/App.jsx`):
   ```bash
   git add src/App.jsx
   git commit -m "feat: <description of changes>"
   git push origin main
   ```

## Post-deploy verification

Always run these checks after pushing:

```bash
# Check GitHub Actions
gh run list --limit 1

# Check Cloudflare Pages directly (more reliable)
wrangler pages deployment list --project-name=apts-agents | head -10

# Verify production is serving the new version
curl -sI https://clients.datameister.jp/aptsjp/ | head -5
```

The GH Actions status must show `completed` and `success`. If it failed:

```bash
gh run view <run-id> --log-failed | tail -30
```

**Production URL:** `https://clients.datameister.jp/aptsjp`
**Fallback URL:** `https://apts-agents.pages.dev/aptsjp`

## What can go wrong

| Symptom | Cause | Fix |
|---------|-------|-----|
| Deploy succeeds but changes not visible at production URL | Workflow targets wrong CF Pages project (`apts-photo-sorter` instead of `apts-agents`) | Fix `--project-name=apts-agents` in `.github/workflows/deploy.yml` |
| Build fails with import error | `src/data.js` was overwritten with zip stub | Restore with `git checkout HEAD -- src/data.js` |
| Site loads but photos are broken | `data.js` was replaced with zip stub (`export const LISTINGS = []`) | Same as above |
| CDN serves stale version | Cloudflare cache | Hard refresh (Ctrl+Shift+R) or wait ~2 min |
| Build fails with JSX syntax error in App.jsx | Broken App.jsx from a newer zip | Try the previous zip's App.jsx instead; the Layout Agent may have shipped a syntax bug |
| Assets 404 at production URL | `base` missing from `vite.config.js` | Ensure `base: '/aptsjp/'` is set in `vite.config.js` |
| GH push rejected for workflow file | OAuth token lacks `workflow` scope | Push without `.github/workflows/` first, then add it in a second push |
| Deploy succeeds at `apts-photo-sorter.pages.dev` but not at `clients.datameister.jp` | Custom domain is on `apts-agents`, not `apts-photo-sorter` | Check `wrangler pages project list` — domain must be on `apts-agents` |