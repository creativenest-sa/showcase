# mood-experience — peer review build

Algorithm test harness for the Mood Mode 3D nearest-neighbour classifier.  
**Run locally. No install. No build step.**

---

## Quickstart

```bash
cd mood-experience
python3 -m http.server 8080
# open http://localhost:8080/test.html
```

Any static file server works — the only requirement is that `type="module"` script imports resolve correctly (they won't work on `file://`).

---

## File map

```
mood-experience/
│
├── mood-algorithm.js          Entry point — import { compute } from here
│
├── data/
│   ├── questions.js           UI text only — question labels + option labels
│   ├── answer-map.js          Numerical votes — { energy, valence, clarity } per option
│   ├── mood-map.js            17 mood pins — 3D coordinates, taglines, zones, palettes
│   ├── answer-map.json        JSON copy of answer-map (reference/non-module consumers)
│   └── mood-map.json          JSON copy of mood-map (reference/non-module consumers)
│
├── engine/
│   ├── distance.js            weightedSum · dist3 · findNearestThree
│   └── output.js              buildResult — the only file that knows result shape
│
└── test.html                  Peer review harness
```

---

## How the algorithm works

**Three axes:**  
- `energy` — drained vs. activated (−1/0/+1 per answer)  
- `valence` — dark/heavy vs. open/warm (−1/0/+1 per answer)  
- `clarity` — murky/diffuse vs. sharp/defined (−2/−1/0/+1/+2 per answer)

**Four steps:**

1. **Translate** each answer to its `(energy, valence, clarity)` vote via `ANSWER_MAP`
2. **Weight and sum** six votes using `QUESTION_WEIGHTS` → one `(E, V, C)` user coordinate
3. **Find nearest three** mood pins by 3D Euclidean distance
4. **Inverse-distance blend** — closer pins dominate; exact hits return weight 1.0

**Question weights:**  
Sky ×1.5 · Pulse ×1.4 · Battery ×1.4 · Colour/Texture/Sound ×1.0

---

## The result object

```js
{
  mood:    "Muted",
  tagline: "The volume is turned down on everything.",
  zone:    "Blue Hour",

  palette:        { primary, secondary, accent },     // primary mood palette
  blendedPalette: { primary, secondary, accent },     // weighted mix of top-3

  neighbors: [
    { mood, zone, distance, weight },  // nearest (highest weight)
    { mood, zone, distance, weight },
    { mood, zone, distance, weight }
  ],

  motion: {
    angle:       Number,  // degrees — atan2(valence, energy) — gradient direction
    intensity:   Number,  // 0→1 — animation speed / gradient boldness
    clarityNorm: Number   // 0→1 — saturation (low = desaturated, high = vivid)
  },

  debug: {
    userCoordinate:  { energy, valence, clarity },
    moodCoordinate:  { energy, valence, clarity },
    primaryDistance: Number
  }
}
```

---

## Verification

Open `test.html` and check:

| # | Action | Expected |
|---|--------|----------|
| 1 | Load page | Six question blocks, 8 options each, all populated |
| 2 | Click "Load worked example" | Storm Grey · Silver Fog · Flickering · Heavy Wool · Silence · Depleted pre-selected; result appears |
| 3 | Worked example result | Zone = Blue Hour; all 3 neighbours in Blue Hour |
| 4 | Select all warm/positive options | Zone = Golden Hour; primary in Alive/Bright/Energised/Radiant |
| 5 | Click Run with < 6 answers | Error banner appears; no crash |
| 6 | Check motion.intensity | ~0 for all-neutral answers; ~1 for all-extreme answers |
| 7 | Check blendedPalette | Valid hex; visually between the 3 neighbour palettes |
| 8 | Exact pin hit possible? | Select answers matching Muted (−4,−2,−2); distance should be near 0 |

---

## Extending

**Add an option to a question:**  
Edit `data/questions.js` (label) and `data/answer-map.js` (votes). Optionally update JSON copies.

**Move a mood pin:**  
Edit `coordinate` in `data/mood-map.js`. Every nearby result shifts with it.

**Recalibrate a vote:**  
Edit the `{ energy, valence, clarity }` values in `data/answer-map.js`.

**Add a fourth axis (e.g. Presence):**
1. Add `presence` field to every option in `answer-map.js`
2. Add `presence` coordinate to every mood in `mood-map.js`
3. Extend `dist3` → `dist4` in `engine/distance.js` (one extra squared term)
4. Extend `weightedSum` to accumulate presence
5. Add `presenceNorm` to `computeMotion` in `engine/output.js` if needed

No other files change.

---

*Plan.Net Studios · Mood Mode v2 · May 2026*
