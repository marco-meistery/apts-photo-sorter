# Deploy Agent — Layout Updates

Read `CLAUDE.md` first for full context.

## Task

Deploy a layout update from the latest zip. This updates `src/App.jsx` only — NEVER `src/data.js`.

## Steps

1. Find the most recent `.zip` in the root directory or `/zips`.
2. Unzip to a temp location.
3. Copy these files from the zip into the project:
   - `src/App.jsx` (required)
   - `index.html` (if present)
   - `CLAUDE.md` (if present)
   - `docs/*` (if present — system spec and agent prompts)
4. **NEVER copy `src/data.js`** — the zip version is a placeholder. The real data lives in the repo.
5. Build: `npm install && npm run build`
6. If build fails, verify `src/App.jsx` has `import { LISTINGS } from "./data.js"` and `src/data.js` has `export const LISTINGS`.
7. Commit and push:
   ```bash
   git add -A
   git commit -m "feat: layout update — <brief description of changes>"
   git push origin main
   ```
8. Verify deploy: `gh run list --limit 1` — must show `success`.
9. Verify the workflow deploys to project `apts-agents` (NOT `apts-photo-sorter`). Check `.github/workflows/deploy.yml` has `--project-name=apts-agents`. Production URL: `clients.datameister.jp/aptsjp`
10. Move zip to `/zips` with timestamp: `apts-photo-sorter_YYYYMMDD-HHMM.zip`
11. Clean up temp files.

## Critical rules

- **NEVER overwrite `src/data.js`** — it has AI analysis + base64 photos.
- If the zip has a `src/data.js`, ignore it — it's a placeholder stub.
- The `docs/` folder and `CLAUDE.md` ARE safe to copy from the zip.
