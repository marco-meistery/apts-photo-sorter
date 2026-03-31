# Deploy Layout Update to Production

Deploy the latest layout zip to apts.jp via GitHub Pages.

⚠️ **NEVER overwrite `src/data.js`** — it contains AI vision analysis results and base64-encoded listing photos. Overwriting it will destroy all photo data and AI descriptions. Always skip this file.

## Steps

### 1. Find the latest zip

Look for the most recent `.zip` file in the workspace root or `zips/` directory:

```bash
ls -t *.zip zips/*.zip 2>/dev/null | head -5
```

Pick the newest one. If no zip is found, ask the user to provide one.

### 2. Unzip to a temp location

```bash
mkdir -p /tmp/apts-deploy
unzip -o "<path-to-zip>" -d /tmp/apts-deploy
```

Explore the extracted contents to understand the directory structure — the files may be at the root or nested inside a subdirectory.

### 3. Copy layout files into `apts-photo-sorter/`

Copy **only** these files from the zip into `apts-photo-sorter/`:

| File | Required? |
|------|-----------|
| `src/App.jsx` | **Required** — abort if missing |
| `index.html` | If present |
| `public/favicon.svg` | If present |
| `CLAUDE.md` | If present |
| `docs/*` | If present (entire docs directory) |

**🚫 NEVER copy `src/data.js`** — even if it exists in the zip, skip it completely.

```bash
# Example (adjust paths based on zip structure):
EXTRACTED="/tmp/apts-deploy"  # or a subdirectory within it
TARGET="apts-photo-sorter"

# Required
cp "$EXTRACTED/src/App.jsx" "$TARGET/src/App.jsx"

# Optional — copy only if they exist
[ -f "$EXTRACTED/index.html" ] && cp "$EXTRACTED/index.html" "$TARGET/index.html"
[ -f "$EXTRACTED/public/favicon.svg" ] && cp "$EXTRACTED/public/favicon.svg" "$TARGET/public/favicon.svg"
[ -f "$EXTRACTED/CLAUDE.md" ] && cp "$EXTRACTED/CLAUDE.md" "$TARGET/CLAUDE.md"
[ -d "$EXTRACTED/docs" ] && cp -r "$EXTRACTED/docs/." "$TARGET/docs/"
```

### 4. Install dependencies and build

```bash
cd apts-photo-sorter && npm install && npm run build
```

If the build fails, inspect the error output. Common issues:
- Missing imports in the new `App.jsx`
- New dependencies not in `package.json` — check the zip for a `package.json` and merge any new dependencies
- Syntax errors in JSX

Fix any issues before proceeding. The build **must** succeed.

### 5. Commit and push

```bash
cd apts-photo-sorter
git add -A
git commit -m "feat: layout update — <brief description of what changed>"
git push origin main
```

Write a descriptive commit message based on what changed in the zip (e.g., "feat: layout update — redesigned listing cards with photo carousel" or "feat: layout update — new filter sidebar and dark mode").

### 6. Check deploy status

```bash
gh run list --limit 1
```

Confirm the GitHub Actions workflow was triggered. If it shows "in_progress" or "queued", that's fine — report the status to the user.

### 7. Archive the zip

Move the zip to `zips/` with a timestamped name:

```bash
TIMESTAMP=$(date +%Y%m%d-%H%M)
mv "<path-to-zip>" "zips/apts-photo-sorter_${TIMESTAMP}.zip"
```

If the zip was already in `zips/`, skip this step.

### 8. Clean up

```bash
rm -rf /tmp/apts-deploy
```

### 9. Report to user

Summarize:
- Which files were copied
- Build result (success)
- Commit hash and push status
- Deploy workflow status
- Where the zip was archived

## Troubleshooting

- **Build fails with missing module**: Check if the zip contains a `package.json` with new dependencies. Run `npm install <package>` for any missing ones.
- **Zip has no `src/App.jsx`**: Abort and ask the user — this is the required layout file.
- **Git push fails**: Check if there are upstream changes with `git pull --rebase origin main` first, then push again.
