# What Changed — v1 Reference vs v5 Build

A complete pointform diff between the original uploaded `.md` files and the current working implementation.

---

## Dimensions — 2D → 3D

- **Original:** 2 axes — Energy (−1/0/+1) and Valence (−1/0/+1)
- **v5:** 3 axes — Energy, Valence, and **Clarity** (−2/−1/0/+1/+2)
- Clarity measures whether a feeling is sharp and defined vs murky and dissolved
- Clarity uses a wider vote range (±2) because some answers are very strong definition signals
- Clarity axis weight is **adaptive**: 0.80 normally, amplified to 1.05 when strongly negative (murky states are most diagnostic there)
- Every answer option now has three votes instead of two
- Every mood pin now has three coordinates instead of two
- Distance formula is now 3D Euclidean: `√( ΔE² + ΔV² + (ΔC × w)² )`

---

## Questions — 6 → 7

- **Original:** 6 questions (colour, sky, pulse, texture, sound, battery)
- **v5:** 7 questions — same 6 plus **Q7: Time of day** (`timeofday`)
- Q7 asks: *"What time of day does it feel like inside? Not the clock. The light you feel."*
- 8 options: Early morning, Mid-morning, Afternoon, Late afternoon, Dusk, Night, Deep night, Predawn
- Deep night and Predawn are the strongest negative-clarity votes in the system (−2)
- Mid-morning is the strongest positive-clarity vote (+2)
- Q7 weight: ×1.2

---

## Question options — incomplete → complete 8 per question

- **Original:** Q3 Pulse had 5 options, Q4 Texture had 6, Q5 Sound had 6, Q6 Battery had 5
- **v5:** All 7 questions have exactly 8 options each
- Q2 Sky options renamed from weather-app language (Golden Hour, Storm Cloud) to atmospheric language (Golden Morning, Distant Storm, Windswept) per Figma board direction
- Q3 Pulse expanded: Still, Hushed, Steady, Drifting, Flickering, Restless, Surging, Racing
- Q4 Texture expanded: adds Soft Velvet and Cracked Earth
- Q5 Sound expanded and renamed: Late-night piano, Forest birds, Ocean tide, Midnight crickets, Distant thunder, Silence, Crackling fire, Wind through trees
- Q6 Battery fully replaced: Depleted, Dim, Fragile, Floating, Balanced, Bright, Electric, Saturated

---

## Algorithm — nearest-1 → threshold neighbour blend

- **Original:** Hard top-3 nearest neighbours, equal weight to each axis, winner-takes-all naming
- **v5 changes:**
  - **Threshold neighbours (#6):** returns all moods within a dynamic distance cutoff (not a hard 3), maximum 5, minimum contribution 7% — result can have 1–5 neighbours depending on how spread the landing is
  - **Signature tie-break (#2):** each mood has a `signature` map of characteristic answer patterns; when top candidates are within 0.75 distance, signature scores are compared and the clearest match gets a 12% distance boost
  - **Recency weights (#4):** answer position multiplied by `[0.82, 0.88, 0.94, 1.00, 1.06, 1.14, 1.20]` — last answer carries 46% more weight than first
  - **Zero-padding (#5):** unanswered questions during partial compute contribute `{0,0,0}` not a midpoint guess — partial coordinates are pure signal
  - **Adaptive question ordering (#1):** after Q1 and Q2 (always fixed), remaining questions are ranked by information gain variance and asked in the order that most reduces coordinate uncertainty for that specific user
  - **Clarity axis weight (#3):** 0.80 normally, 1.05 when user's clarity coordinate is below −2

---

## Result object — minimal → rich

**Original result:**
```js
{
  mood, tagline, palette: { primary, secondary, accent },
  debug: { moodId, userCoordinate, moodCoordinate, distance }
}
```

**v5 result:**
```js
{
  mood, tagline, zone,
  palette,              // primary mood palette
  blendedPalette,       // weighted mix of all neighbours
  blendLanguage,        // e.g. "Hollow, with traces of Muted and Withdrawn"
  confidence,           // 0–1, how dominant the primary mood is
  neighbors: [          // variable length, each with:
    { mood, zone, distance, weight, similarity }
  ],
  motion: {
    angle,              // atan2(valence, energy) — gradient direction
    intensity,          // 0–1 — animation speed
    clarityNorm         // 0–1 — colour saturation driver
  },
  debug: { userCoordinate, moodCoordinate, primaryDistance, neighbourCount }
}
```

---

## Mood map — coordinates only → coordinates + signatures

- **Original:** each mood had `{ id, name, coordinate: { energy, valence }, tagline, palette }`
- **v5:** each mood has `{ id, name, coordinate: { energy, valence, clarity }, zone, tagline, palette: [p, s, a], signature: { questionId: [optionIds] } }`
- Palettes changed from object `{ primary, secondary, accent }` to flat array `[primary, secondary, accent]` to support index-based proportional blending
- Zone name added as a field (was previously inferred from quadrant)
- Clarity coordinates added — range −3 (Hollow, most dissolved) to +3 (Bright, sharpest)
- Signature patterns added to all 17 moods for tie-breaking

---

## Mood map — clarity coordinates

| Mood | Original coord | v5 coord |
|------|---------------|----------|
| Radiant | (+5, +5) | (+5, +5, +2) |
| Bright | (+3, +4) | (+3, +4, +3) |
| Energised | (+4, +3) | (+4, +3, +3) |
| Alive | (+2, +2) | (+2, +2, +1) |
| Peaceful | (−5, +5) | (−5, +5, +2) |
| Tender | (−3, +4) | (−3, +4, −1) |
| Calm | (−4, +3) | (−4, +3, +2) |
| Soft | (−2, +2) | (−2, +2, −1) |
| Even | (0, 0) | (0, 0, 0) |
| Edged | (+5, −4) | (+5, −4, +2) |
| Wired | (+4, −3) | (+4, −3, +1) |
| Restless | (+3, −2) | (+3, −2, −1) |
| Frayed | (+2, −2) | (+2, −2, −2) |
| Muted | (−4, −2) | (−4, −2, −2) |
| Heavy | (−5, −4) | (−5, −4, −1) |
| Hollow | (−3, −5) | (−3, −5, −3) |
| Withdrawn | (−2, −3) | (−2, −3, −2) |

---

## File structure — 5 files → 9 files

**Original:**
```
mood-algorithm.js
data/questions.js, answer-map.js, mood-map.js
engine/distance.js, output.js
```

**v5:**
```
mood-algorithm.js         (exports compute, partialCompute, getAdaptiveOrder)
data/questions.js         (7 questions × 8 options)
data/answer-map.js        (3-axis votes including timeofday)
data/mood-map.js          (3D coords + signatures)
data/answer-map.json      (machine-readable copy)
data/mood-map.json        (machine-readable copy)
engine/distance.js        (weightedSum, dist3, zeroPadAnswers, findNearestNeighbors, rankQuestionsByInfoGain)
engine/output.js          (buildResult, confidence, blendLanguage)
index.html                (full immersive experience)
test.html                 (bare harness, still works)
```

---

## API — one function → three functions

- **Original:** `compute(answers)` — single function, 6 required answers
- **v5:**
  - `compute(answers, answerOrder)` — full compute, 7 required answers, recency applied
  - `partialCompute(answers, answerOrder)` — live compute after any number of answers, zero-padded
  - `getAdaptiveOrder(answers, currentCoord)` — returns remaining questions ranked by info gain

---

## Engine — distance.js

- **Original:** `sumCoordinates(coords)` + `findNearestMood(userCoord, moodMap)` — 2 functions
- **v5:** `weightedSum`, `dist3`, `zeroPadAnswers`, `findNearestNeighbors`, `rankQuestionsByInfoGain`, `QUESTION_WEIGHTS`, `RECENCY_WEIGHTS` — 7 exports

---

## Engine — output.js

- **Original:** `buildResult(mood, userCoordinate, distance)` — took a single winning mood
- **v5:** `buildResult(neighbors, userCoord)` — takes full neighbour array, computes blend, confidence, motion, blend language

---

## UI — test harness → full immersive experience

- **Original:** bare HTML with 6 dropdowns and a Run button
- **v5:** full atmospheric onboarding with:
  - Full-screen canvas with animated orb gradient field (mouse-reactive)
  - Per-question foreground FX: ink blobs (colour), parallax bands (sky), particle field with click ripples (pulse), sine-wave texture (texture), sound-specific visuals per option (sound), energy fill column (battery), shifting sky gradient (timeofday)
  - Breath animation rate driven by pulse + battery answers directly
  - Colour Q1 rendered as circular swatches, Sky Q2 as procedurally painted image cards
  - Live atmosphere updates after every answer (partial compute)
  - Convergence transition screen (2.4s) before result reveal
  - Result word blur driven by clarity (sharp = crisp, murky = softly dissolved)
  - Mouse parallax on result word
  - Blend language: *"Hollow, with traces of Muted and Withdrawn"*
  - Confidence bar filling across the bottom as you answer
  - Share: 640×800 PNG card generator (canvas-rendered, downloadable)
  - History: localStorage, last 14 results, shown on intro screen

---

*Plan.Net Studios · May 2026 · v5*
