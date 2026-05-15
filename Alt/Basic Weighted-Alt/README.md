# Mood Mode — Algorithm 

A browser-based sensory mood engine. Seven questions. A three-dimensional emotional space. One blended result with palette, motion, confidence, and language — no server, no dependencies, one function call.

**Documentation**
- [MOOD-MAP.md](MOOD-MAP.md) — all 17 moods in (energy, valence, clarity) space
- [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md) — file structure, API, verification
- [ONBOARDING.md](ONBOARDING.md) — all 7 questions, 8 options each, scoring and moodboard direction
- [CHANGES.md](CHANGES.md) — complete diff from original v1 reference files

---

## The idea in one sentence

Seven sensory questions nudge a point through a three-dimensional emotional space. The mood pins closest to where you land — weighted by how near they are — determine the result, blended proportionally into a single reading.

---

## The three dimensions

| Axis | Per-answer range | What it captures |
|------|-----------------|-----------------|
| **Energy** | −1, 0, +1 | Activation — drained and still vs. charged and wired |
| **Valence** | −1, 0, +1 | Tone — heavy and dark vs. open and warm |
| **Clarity** | −2 to +2 | Definition — murky/diffuse vs. sharp/certain |

Clarity is orthogonal to Energy and Valence. Two people can land at identical (E, V) coordinates but with very different clarity — one knowing exactly how they feel, one unable to name it. The axis separates moods that look identical in 2D.

---

## The seven questions

| # | Question | Sensory register | Weight |
|---|----------|-----------------|--------|
| Q1 | Pick a colour that feels like you right now | Visual / colour | ×1.0 |
| Q2 | Which sky are you under right now? | Spatial / atmospheric | ×1.5 |
| Q3 | What is your pulse today? | Somatic / rhythm | ×1.4 |
| Q4 | What would today feel like, under your hand? | Tactile / texture | ×1.0 |
| Q5 | Pick the closest sound | Auditory / ambient | ×1.0 |
| Q6 | How full are you? Battery. | Somatic / capacity | ×1.4 |
| Q7 | What time of day does it feel like inside? | Temporal / light | ×1.2 |

Q1 and Q2 are always asked first. Q3–Q7 are reordered by information gain after each answer — the question that most reduces coordinate uncertainty is asked next.

---

## How the algorithm runs

```
7 answers → recency-weighted 3D sum → threshold neighbours
          → signature tie-break → inverse-distance blend → result
```

**Step 1 — Translate.** Each answer has an `(energy, valence, clarity)` vote in the answer map.

**Step 2 — Weight + recency.** Multiply by question weight and answer-position recency (`[0.82 → 1.20]`). Your last answer carries 46% more weight than your first.

**Step 3 — Sum.** All weighted votes add up to one `(E, V, C)` user coordinate.

**Step 4 — Threshold neighbours.** 3D Euclidean distance to every mood pin. Collect all moods within a dynamic cutoff (not a hard top-3). Maximum 5 neighbours, minimum 7% contribution.

```
distance = √( ΔE² + ΔV² + (ΔC × clarityWeight)² )
clarityWeight = 0.80 normally, 1.05 when user clarity < −2
```

**Step 5 — Signature tie-break.** When top candidates are within 0.75 of each other, each mood's characteristic answer patterns are scored against the user's actual answers. The best match gets a 12% distance boost.

**Step 6 — Inverse-distance blend.** Closer moods dominate result and palette. A user equidistant from three moods gets a true three-way blend.

---

## Worked example

**Answers:** Storm Grey · Silver Fog · Flickering · Heavy Wool · Silence · Depleted · Deep Night

| Q | Answer | Weight | E | V | C |
|---|--------|--------|---|---|---|
| colour | Storm Grey | ×1.0 | +1 | −1 | −1 |
| sky | Silver Fog | ×1.5 | −1 | 0 | −1 |
| pulse | Flickering | ×1.4 | −1 | −1 | −2 |
| texture | Heavy Wool | ×1.0 | −1 | −1 | −1 |
| sound | Silence | ×1.0 | −1 | 0 | −2 |
| battery | Depleted | ×1.4 | −1 | −1 | −1 |
| timeofday | Deep Night | ×1.2 | −1 | −1 | −2 |

Weighted sum (with recency) ≈ **(−5.3, −4.8, −9.7)**

Nearest mood pins:

| Mood | Coordinate | Distance |
|------|------------|----------|
| **Hollow** | (−3, −5, −3) | 7.12 |
| **Muted** | (−4, −2, −2) | 8.70 |
| **Withdrawn** | (−2, −3, −2) | 9.18 |

All three in Blue Hour zone. Blend: **Hollow, with traces of Muted and Withdrawn.**

---

## What the result looks like

```js
{
  mood:          "Hollow",
  tagline:       "Going through the motions. Something missing.",
  zone:          "Blue Hour",
  blendLanguage: "Hollow, with traces of Muted and Withdrawn",
  confidence:    0.54,

  palette:        { primary: "#404858", secondary: "#303848", accent: "#202838" },
  blendedPalette: { primary: "#383050", secondary: "#282040", accent: "#181030" },

  neighbors: [
    { mood: "Hollow",    distance: 7.12, weight: 0.37, similarity: 0.64 },
    { mood: "Muted",     distance: 8.70, weight: 0.30, similarity: 0.55 },
    { mood: "Withdrawn", distance: 9.18, weight: 0.28, similarity: 0.52 }
  ],

  motion: {
    angle:       222,    // gradient rotation direction
    intensity:   0.61,   // animation speed (0 = still, 1 = fast)
    clarityNorm: 0.16    // saturation (0 = desaturated, 1 = vivid)
  }
}
```

---

## The atmosphere is already computing

Because the result is purely spatial, the UI layer can show the algorithm working in real time. Every answer triggers a `partialCompute()` — the canvas colour field shifts immediately toward the emerging mood zone. By the final answer, the atmosphere has already been converging for six questions. The result word arrives into the field it created.

**Motion parameters** fall out of the user coordinate for free:
- `angle` = `atan2(valence, energy)` — points toward the emotional zone
- `intensity` = `√(E²+V²+C²) / maxMagnitude` — drives animation speed
- `clarityNorm` = normalised clarity — drives colour saturation and result-word blur

**Even at (0,0,0)** produces zero intensity — utterly still, no motion, neutral saturation.

---

## File map

```
mood-algorithm.js   ← compute(), partialCompute(), getAdaptiveOrder() — import only this
data/
  questions.js      ← 7 × 8 options, UI text only
  answer-map.js     ← 3-axis votes per option
  mood-map.js       ← 17 moods, 3D coordinates, signatures, palettes
engine/
  distance.js       ← all maths
  output.js         ← result shape
index.html          ← full experience
test.html           ← bare harness
```

---

## Running locally

```bash
cd mood-experience
python3 -m http.server 8080
# open http://localhost:8080/index.html     ← full experience
# open http://localhost:8080/test.html      ← algorithm harness
```

---

## Architecture — the separation that makes it maintainable

| To change this | Touch only |
|---------------|-----------|
| Question wording | `data/questions.js` |
| Answer vote values | `data/answer-map.js` |
| Mood pin position | `data/mood-map.js` |
| Signature patterns | `data/mood-map.js` |
| Distance metric | `engine/distance.js` |
| Result shape | `engine/output.js` |
| Wiring | `mood-algorithm.js` |

Engine files never import from data files. Data files contain no logic. `mood-algorithm.js` is the only file that imports from both sides.

---

*Plan.Net Studios · May 2026 · v5*
