# Implementation Plan — Mood Algorithm v5

**Approach:** 3D Nearest Centroid Classifier with adaptive question ordering, recency weighting, signature tie-breaking, and threshold-based neighbour blending. Self-contained ES module bundle. No npm, no build step, no server.

---

## Quickstart

```bash
cd mood-experience
python3 -m http.server 8080
# open http://localhost:8080/index.html
```

Any static file server works. ES modules require a server — `file://` will not work.

---

## File structure

```
mood-experience/
│
├── mood-algorithm.js          Entry point — exports compute(), partialCompute(), getAdaptiveOrder()
│
├── data/
│   ├── questions.js           7 questions × 8 options — UI text only, no numbers
│   ├── answer-map.js          (energy, valence, clarity) votes per option
│   ├── mood-map.js            17 moods — 3D coordinates, signatures, palettes, zones
│   ├── answer-map.json        JSON copy (reference / non-module consumers)
│   └── mood-map.json          JSON copy (reference / non-module consumers)
│
├── engine/
│   ├── distance.js            All maths — weighted sum, dist3, neighbours, info gain
│   └── output.js              Result shape — blend, confidence, motion, language
│
├── index.html                 Full immersive experience
└── test.html                  Bare test harness (still functional)
```

All files use ES modules (`export` / `import`). Engine files must not import from data files.

---

## How the algorithm works — seven steps

```
7 answers → weighted 3D sum (recency applied) → threshold neighbours
         → signature tie-break → inverse-distance blend → result
```

1. **Translate** — look up each answer's `(energy, valence, clarity)` vote in `ANSWER_MAP`
2. **Apply recency weights** — multiply each vote by its position weight (`[0.82 → 1.20]`)
3. **Apply question weights** — multiply by question-specific weight (sky ×1.5, pulse ×1.4 etc.)
4. **Sum** — all weighted votes into one `(E, V, C)` user coordinate
5. **Find neighbours** — 3D Euclidean distance to every mood pin; collect all within dynamic cutoff (max 5, min contribution 7%)
6. **Signature tie-break** — if top candidates within 0.75 distance, score by characteristic answer patterns; winner gets 12% distance boost
7. **Inverse-distance blend** — closer moods dominate result and palette

---

## The three axes

| Axis | Vote range | Weighted sum range | What it captures |
|------|-----------|-------------------|-----------------|
| **Energy** | −1, 0, +1 | −12.6 → +12.6 | Activation — drained vs. wired |
| **Valence** | −1, 0, +1 | −12.6 → +12.6 | Tone — dark/heavy vs. open/warm |
| **Clarity** | −2, −1, 0, +1, +2 | −25.2 → +25.2 | Definition — murky/diffuse vs. sharp/certain |

Clarity axis weight is adaptive: **0.80** normally, **1.05** when user clarity < −2 (murky states are most diagnostic at that end).

---

## Question weights

| Question | Weight | Primary axis | Why |
|----------|--------|-------------|-----|
| colour | ×1.0 | Valence | Emotional tone anchor |
| sky | ×1.5 | All three | Atmospheric anchor, tie-breaker |
| pulse | ×1.4 | Energy | Most direct body-energy signal |
| texture | ×1.0 | Valence + Clarity | Tactile emotional register |
| sound | ×1.0 | Clarity + Valence | Ambient emotional register |
| battery | ×1.4 | Energy + Clarity | Most direct capacity signal |
| timeofday | ×1.2 | Clarity | Temporal clarity signal |

---

## Recency weights

```js
[0.82, 0.88, 0.94, 1.00, 1.06, 1.14, 1.20]
// index 0 = first answer given, index 6 = last answer given
// last answer carries 46% more weight than first
```

---

## Adaptive question ordering

- Q1 (colour) and Q2 (sky) are always asked first — they anchor the visual/emotional vocabulary
- After Q2, remaining questions are ranked by **information gain** before each question is shown
- Information gain = variance of nearest-mood distances across all options for a given question
- Higher variance = this question can move the coordinate more from here = ask it sooner
- Two users answering differently will see questions in a different order — this is intentional

---

## Public API

```js
import { compute, partialCompute, getAdaptiveOrder,
         QUESTIONS, MOOD_MAP } from './mood-algorithm.js';

// Full compute — all 7 answers required
const result = compute(answers, answerOrder);

// Partial compute — any number of answers, zero-padded
const partial = partialCompute(answers, answerOrder);

// Next questions ranked by information gain
const queue = getAdaptiveOrder(answers, currentCoord);
```

### `compute(answers, answerOrder)` result shape

```js
{
  mood:           "Hollow",
  tagline:        "Going through the motions. Something missing.",
  zone:           "Blue Hour",

  palette: {
    primary:   "#404858",
    secondary: "#303848",
    accent:    "#202838"
  },

  blendedPalette: {          // weighted mix of all active neighbours
    primary:   "#383050",
    secondary: "#282040",
    accent:    "#181030"
  },

  blendLanguage:  "Hollow, with traces of Muted and Withdrawn",
  confidence:     0.54,      // 0 (equidistant) → 1 (exact pin hit)

  neighbors: [               // variable length 1–5
    { mood: "Hollow",    zone: "Blue Hour", distance: 7.12, weight: 0.37, similarity: 0.64 },
    { mood: "Muted",     zone: "Blue Hour", distance: 8.70, weight: 0.30, similarity: 0.55 },
    { mood: "Withdrawn", zone: "Blue Hour", distance: 9.18, weight: 0.28, similarity: 0.52 }
  ],

  motion: {
    angle:       222,        // degrees — gradient rotation
    intensity:   0.61,       // 0 → 1 — animation speed
    clarityNorm: 0.16        // 0 → 1 — colour saturation
  },

  debug: {
    userCoordinate:  { energy: -5.3, valence: -4.8, clarity: -9.7 },
    moodCoordinate:  { energy: -3,   valence: -5,   clarity: -3   },
    primaryDistance: 7.12,
    neighbourCount:  3
  }
}
```

---

## Data file specs

### `data/questions.js`

Exports `QUESTIONS` — 7 question objects. No numeric data.

```js
{
  id:       'colour',
  label:    'Pick a colour that feels like you right now.',
  sublabel: 'Which colour comes closest to your mood right now?',
  options:  [{ id: 'honey-gold', label: 'Honey Gold' }, ...]
}
```

Question order: `colour → sky → pulse → texture → sound → battery → timeofday`
Each has exactly 8 options. See `ONBOARDING.md` for full option lists.

---

### `data/answer-map.js`

Exports `ANSWER_MAP` — three-axis votes per option.

```js
ANSWER_MAP['sky']['golden-morning'] = { energy: +1, valence: +1, clarity: +1 }
ANSWER_MAP['battery']['flickering'] = { energy: -1, valence: -1, clarity: -2 }
ANSWER_MAP['timeofday']['deep-night']= { energy: -1, valence: -1, clarity: -2 }
```

Clarity vote range: −2 to +2. Energy/Valence: −1 to +1.

---

### `data/mood-map.js`

Exports `MOOD_MAP` — 17 mood objects.

```js
{
  id:         'hollow',
  name:       'Hollow',
  coordinate: { energy: -3, valence: -5, clarity: -3 },
  zone:       'Blue Hour',
  tagline:    'Going through the motions. Something missing.',
  palette:    ['#404858', '#303848', '#202838'],
  signature: {
    colour:    ['midnight-plum', 'arctic-dusk'],
    sky:       ['midnight-air', 'silver-fog'],
    pulse:     ['flickering', 'still'],
    sound:     ['silence'],
    battery:   ['depleted', 'dim'],
    timeofday: ['deep-night', 'predawn']
  }
}
```

Full table and signatures in `MOOD-MAP.md`.

---

### `engine/distance.js` — exports

| Export | Type | Description |
|--------|------|-------------|
| `QUESTION_WEIGHTS` | const | Per-question multipliers |
| `RECENCY_WEIGHTS` | const | `[0.82…1.20]` — 7 position weights |
| `dist3(a, b, userClarity)` | function | Weighted 3D Euclidean distance |
| `zeroPadAnswers(answers, questions)` | function | Pads unanswered with `__zero__` |
| `weightedSum(answers, map, weights, order)` | function | Recency-weighted coordinate sum |
| `findNearestNeighbors(coord, moodMap, answers)` | function | Threshold neighbours with tie-break |
| `rankQuestionsByInfoGain(coord, answeredIds, questions, map, moodMap)` | function | Adaptive ordering |

---

### `engine/output.js` — exports

| Export | Description |
|--------|-------------|
| `buildResult(neighbors, userCoord)` | Assembles full result object |

Internal functions: `blendPalettes`, `computeMotion`, `computeConfidence`, `buildBlendLanguage`.

---

## Architecture invariants

| Rule | Why |
|------|-----|
| Engine files never import from data files | Distance/output work on any mood map |
| Data files contain no logic | Pure lookup tables |
| `mood-algorithm.js` is the only cross-side importer | One wiring point |
| `questions.js` contains no numbers | UI and algorithm fully decoupled |
| `output.js` is the only file that knows the result shape | Change contract → change one file |

---

## Verification checklist

| # | Test | Expected |
|---|------|---------|
| 1 | Load `index.html` | Intro screen visible, canvas animating |
| 2 | Click Begin | Q1 colour swatches appear (8 circles) |
| 3 | Pick a colour | Canvas atmosphere shifts immediately |
| 4 | Pick sky option | Q3 question appears (may not be pulse — adaptive ordering) |
| 5 | Complete all 7 | Convergence screen (2s), then result |
| 6 | Result blur | Low-clarity answers (silence, deep-night, depleted) → word is softly blurred |
| 7 | Share button | 640×800 card renders with mood word, tagline, palette |
| 8 | History button | Shows last results with dates |
| 9 | Again | Returns to intro, shows last result label |
| 10 | `test.html` Load example | Result in Blue Hour zone (Heavy/Hollow/Muted cluster) |

---

## Extending — adding a fourth axis

1. Add `presence` vote to every option in `answer-map.js`
2. Add `presence` coordinate to every mood in `mood-map.js`
3. Extend `dist3` in `distance.js`: add `+ ((a.presence - b.presence) * pw) ** 2` under the radical
4. Extend `weightedSum` to accumulate presence
5. Add `presenceNorm` to `computeMotion` in `output.js` if needed for UI

No other files change.

---

*Plan.Net Studios · May 2026 · v5*
