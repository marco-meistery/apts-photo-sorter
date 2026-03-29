# apts.jp Photo Sorting Agent — Prototype

AI-powered photo ordering tool for apts.jp apartment listings.

## Quick Deploy (2 options)

### Option A: Cloudflare Pages Dashboard (easiest — no workflow needed)

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
3. Click **Create a project** → **Connect to Git**
4. Select your GitHub repo
5. Configure build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Framework preset:** Vite
6. Click **Save and Deploy**

That's it. Every push to `main` auto-deploys. You get a URL like `apts-photo-sorter.pages.dev`.

### Option B: GitHub Actions (included in `.github/workflows/deploy.yml`)

If you prefer the CI/CD workflow approach:

1. Push this repo to GitHub
2. In Cloudflare Dashboard, create an API token:
   - Go to **My Profile → API Tokens → Create Token**
   - Use **Edit Cloudflare Workers** template
   - Add **Cloudflare Pages: Edit** permission
3. In your GitHub repo → **Settings → Secrets and variables → Actions**, add:
   - `CLOUDFLARE_API_TOKEN` — the token from step 2
   - `CLOUDFLARE_ACCOUNT_ID` — found in Cloudflare Dashboard sidebar
4. Push to `main` — GitHub Actions will build and deploy automatically

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## What This Does

- Scrapes real listings from apts.jp
- AI reorders photos using a conversion-optimized sequence (living spaces first, utilities later, floor plan last)
- Shows before/after position changes with directional indicators
- Drag-and-drop manual reordering
- Approve workflow with progress tracking
- Links back to original apts.jp listings

## Tech Stack

- React + Vite
- Cloudflare Pages (hosting)
- GitHub Actions (CI/CD)
