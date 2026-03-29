# AI Vision Analysis — Analyze listing photos and deploy

Re-analyze all listing photos in `src/data.js` with publishable descriptions and optimal ordering, then deploy.

You own `src/data.js`. Never touch `src/App.jsx`.

## Data format

Each photo's `ai` object must use this format (no `ai_sees` or `desc` fields):

```js
ai:{
  room_en:"Living/dining room",
  room_jp:"リビングダイニング",
  description:"2-3 sentence compelling, publishable description.",
  brightness:4, composition:5, spaciousness:5, clutter:1,
  stars:5,
  remove:false, remove_reason:""
}
```

## Step 1: Extract photos to disk

```js
// Run: node -e "..." or save as extract_photos.mjs
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

Expected: L1: 10, L2: 10, L3: 10, L4: 7 = 37 total.

## Step 2: Analyze with parallel sub-agents

Launch **4 parallel sub-agents** (one per listing). Each reads every JPEG in its listing and returns structured JSON.

**Listing metadata:**
- L1: "Gran Heights Ikejiri #0604" — 2 Bed, 80.48m², Setagaya-ku, ¥415,000/mo
- L2: "Residia Shinjuku East Ⅱ #0801" — 2 Bed, 53.96m², Shinjuku-ku, ¥310,000/mo
- L3: "Premier Stage Ichigaya Kawadacho #702" — 1 Bed, 47.76m², Shinjuku-ku, ¥239,000/mo
- L4: "Park Axis Shibuya Jinnan #1001" — Studio, 38.23m², Shibuya-ku, ¥240,000/mo

**Sub-agent prompt (send with each image):**

```
You are writing a photo description for a Tokyo apartment listing on apts.jp, targeting foreign tenants. Photo #{origIdx} of {total} for "{title}" ({beds}, {sqm}m², {area}).

Return ONLY valid JSON:
{
  "room_en": "<room name>",
  "room_jp": "<Japanese name>",
  "description": "<2-3 sentences. Write as a real estate agent would for the listing page. Highlight features, materials, light, livability. Be specific and appealing.>",
  "brightness": <1-5>, "composition": <1-5>, "spaciousness": <1-5>,
  "clutter": <1-5 where 1=cleanest>, "stars": <1-5>,
  "remove": <true/false>, "remove_reason": "<if true>"
}

Room names: Living/dining room (リビングダイニング), Kitchen (キッチン), Bedroom (寝室), Master bedroom (主寝室), Bathroom (浴室), Washroom (洗面所), Toilet (トイレ), Entrance hall (玄関), Hallway (廊下), Balcony (バルコニー), View from window (眺望), Building exterior (外観), Entrance lobby (エントランス), Floor plan (間取り図), Storage/closet (収納), Roof balcony (ルーフバルコニー), Western-style room (洋室), Laundry area (洗濯機置場)

If multiple photos show the same room type, number them: "Bedroom 1", "Bedroom 2".

Description style:
✓ "Modern system kitchen with three-burner gas stove, ample counter space, and sleek white cabinetry. The peninsula layout keeps the chef connected to the dining area."
✓ "Expansive 14.2-jō living-dining area bathed in natural light from balcony-side windows. Pale wood flooring and a high white ceiling emphasize the open feel."
✗ "This is a kitchen. It has a stove." (generic)
✗ "Good kitchen photo, well-lit." (evaluative/internal)

Scoring: brightness 1=dark 5=excellent, composition 1=awkward 5=well-framed, spaciousness 1=cramped 5=open, clutter 1=spotless 5=messy, stars 1-5 overall.

Removal: Only near-duplicates, extremely dark/blurry, or irrelevant. NEVER remove the only photo of any room or floor plans. Be conservative.
```

## Step 3: Determine aiOrder

After all photos analyzed, rank for maximum customer impact:

1. **Hero** = most impressive interior (best LDK with light). NEVER exterior or floor plan.
2. Additional living room angles → bedrooms (larger first) → kitchen
3. Washroom → bathroom → toilet
4. Balcony / view from window
5. Building entrance/lobby → exterior
6. **Floor plan ALWAYS last**
7. Exclude removed photos

## Step 4: Apply to data.js

Write a Node.js script (`apply_analysis.mjs`) that replaces each photo's `ai:{...}` block and each listing's `aiOrder` value. **Critical: process each listing in its own section** to avoid origIdx collisions across listings.

```js
// Key pattern for section-based replacement:
for (let li = 0; li < results.length; li++) {
  const sectionStart = src.indexOf(listing.listing);
  const sectionEnd = li < results.length - 1
    ? src.indexOf(results[li + 1].listing)
    : src.lastIndexOf('];');
  let section = src.slice(sectionStart, sectionEnd);
  // Replace ai blocks and aiOrder within this section only
  // Then reassemble: src = src.slice(0, sectionStart) + section + src.slice(sectionEnd);
}
```

## Step 5: Verify and deploy

```bash
npm run build                              # must succeed
grep -c "(pending)" src/data.js            # must be 0
grep -c 'stars:0' src/data.js              # must be 0
grep -c 'aiOrder:\[' src/data.js           # must be 4
grep -c 'description:""' src/data.js       # must be 0
grep -c 'ai_sees:\|,desc:' src/data.js     # must be 0 (no old format)
git add src/data.js
git commit -m "feat: AI vision — publishable descriptions and re-ranked ordering"
git push origin main
gh run list --limit 1
rm -rf tmp_images apply_analysis.mjs
```

## Quality checklist

- [ ] Every `description` is 2-3 sentences, compelling, publishable
- [ ] No `ai_sees` or `desc` fields remain — only `description`
- [ ] Every `room_en` is specific (no "(pending)")
- [ ] Every `room_jp` is correct Japanese
- [ ] All scores 1-5 (no zeros)
- [ ] 4 `aiOrder` arrays set (no nulls)
- [ ] Floor plan is last in every `aiOrder`
- [ ] Hero is always the best interior LDK shot
- [ ] Build succeeds
- [ ] Pushed and deploy workflow triggered
