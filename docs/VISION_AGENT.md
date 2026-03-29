# Vision Agent — Photo Analysis and Deployment

Read `CLAUDE.md` and `docs/SYSTEM.md` first for full context.

## Task

Analyze every listing photo in `src/data.js` using sub-agents with vision, then deploy.

## Step 1: Extract photos

```js
// extract_photos.mjs
import fs from 'fs';
const src = fs.readFileSync('src/data.js', 'utf8');
const titles = ['Gran Heights Ikejiri #0604','Residia Shinjuku East','Premier Stage Ichigaya','Park Axis Shibuya Jinnan'];
fs.mkdirSync('tmp_images', {recursive: true});
for (let li = 0; li < titles.length; li++) {
  const start = src.indexOf(titles[li]);
  const end = li < titles.length - 1 ? src.indexOf(titles[li+1]) : src.indexOf('];', start);
  const section = src.slice(start, end);
  const re = /src:"(data:image\/jpeg;base64,[^"]+)",origIdx:(\d+)/g;
  let m, count = 0;
  while ((m = re.exec(section)) !== null) {
    fs.writeFileSync(`tmp_images/img_L${li+1}_P${m[2]}.jpg`, Buffer.from(m[1].replace('data:image/jpeg;base64,',''), 'base64'));
    count++;
  }
  console.log(`Listing ${li+1}: ${count} images`);
}
```

## Step 2: Analyze each photo with sub-agents

Launch one sub-agent per listing (4 parallel). Each sub-agent reads every photo in its listing.

**Sub-agent prompt (send with each image):**

```
You are writing a photo description for a Tokyo apartment listing on apts.jp, targeting foreign tenants and expats. This is photo #{index} of {total} for "{listing_title}" ({beds}, {sqm}m², {area}).

Return ONLY valid JSON — no markdown, no backticks:

{
  "room_en": "<room name>",
  "room_jp": "<Japanese room name>",
  "description": "<2-3 sentence compelling description suitable for publishing on the listing page. Describe the space as an agent would to a prospective tenant — highlight features, materials, light, and livability. Be specific and appealing, not generic.>",
  "brightness": <1-5>,
  "composition": <1-5>,
  "spaciousness": <1-5>,
  "clutter": <1-5 where 1=cleanest>,
  "stars": <1-5 overall>,
  "remove": <true/false>,
  "remove_reason": "<reason if true, else empty>"
}

ROOM NAMES (use exactly):
Living/dining room (リビングダイニング), Kitchen (キッチン), Bedroom (寝室), Master bedroom (主寝室), Western-style room (洋室), Bathroom (浴室), Unit bath (ユニットバス), Washroom (洗面所), Toilet (トイレ), Entrance hall (玄関), Hallway (廊下), Balcony (バルコニー), Walk-in closet (ウォークインクローゼット), View from window (眺望), Building exterior (外観), Entrance lobby (エントランス), Floor plan (間取り図), Roof balcony (ルーフバルコニー), Storage/closet (収納), Laundry area (洗濯機置場)

DESCRIPTION STYLE — write as if for the listing page:
✓ "Spacious living and dining area with warm wood-tone flooring and recessed lighting. Floor-to-ceiling windows open onto a private balcony, filling the room with natural light throughout the day."
✗ "This is a photo of a living room. It has wood floors and windows." (too generic)
✗ "Bright open LDK with good natural light. Strong hero photo candidate." (too evaluative)

SCORING: brightness (light quality), composition (framing), spaciousness (sense of openness), clutter (1=spotless), stars (overall listing impact)

REMOVAL: only near-duplicates, extremely dark/blurry, or irrelevant. Never remove the only photo of any room type. Never remove floor plans.
```

## Step 3: Determine optimal aiOrder

After all photos analyzed, rank them for maximum customer impact:

1. **Hero** = most impressive interior. The photo that makes someone click "inquire." Usually the LDK. NEVER exterior or floor plan.
2. Living spaces → bedrooms → kitchen
3. Wet areas: washroom → bathroom → toilet
4. Balcony / view
5. Building: lobby → exterior
6. Floor plan ALWAYS last
7. Exclude removed photos

Output as array of origIdx values: `aiOrder: [2, 0, 3, 5, ...]`

## Step 4: Apply results to data.js

Write a Node.js script to replace each `ai:{...}` block and each `aiOrder:null` (or existing `aiOrder:[...]`) in `src/data.js`. Use targeted string replacement — do NOT rewrite the full file.

**Important**: The new schema uses `description` (single field) instead of `ai_sees` + `desc`. Replace the entire ai object for each photo.

## Step 5: Verify

```bash
npm run build
grep -c "(pending)" src/data.js        # must be 0
grep -c 'aiOrder:\[' src/data.js       # must be 4
grep -c 'stars:0' src/data.js          # must be 0
grep -c 'description:""' src/data.js   # must be 0
```

## Step 6: Deploy

```bash
git add src/data.js
git commit -m "feat: AI vision analysis — publishable descriptions and optimal ordering"
git push origin main
```

Then verify the GitHub Actions workflow succeeds:
```bash
gh run list --limit 1
```

## Quality checklist

- [ ] Every room_en is specific (no "(pending)")
- [ ] Every room_jp is accurate Japanese
- [ ] Every description is 2-3 sentences, compelling, publishable
- [ ] All scores 1-5 (no zeros)
- [ ] All 4 aiOrder arrays set
- [ ] Floor plan last in every aiOrder
- [ ] Hero is always best interior
- [ ] Build succeeds
- [ ] Pushed to main
- [ ] GitHub Actions deploy succeeded
