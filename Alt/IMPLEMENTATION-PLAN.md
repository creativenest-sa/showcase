# Implementation Plan — Mood Mode v7

**Approach:** 3D Nearest Centroid Classifier with adaptive question ordering, recency weighting, signature tie-breaking, threshold-based neighbour blending, and a Bayesian learning layer that self-improves from user feedback. Self-contained ES module bundle. No npm, no build step, no server required.

---

## Quickstart

```bash
cd mood-experience
python3 -m http.server 8080
# open http://localhost:8080/index.html   ← full experience
# open http://localhost:8080/test.html    ← algorithm harness
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
│   ├── mood-map.js            22 moods — 3D coordinates, signatures, palettes, zones
│   ├── answer-map.json        JSON copy (machine-readable reference)
│   └── mood-map.json          JSON copy (machine-readable reference)
│
├── engine/
│   ├── distance.js            All maths — weighted sum, dist3, neighbours, info gain
│   ├── output.js              Result shape — blend, confidence, motion, language
│   └── learning.js            Learning layer — telemetry, feedback, weight tuning, Bayesian
│
├── index.html                 Full immersive experience
└── test.html                  Bare test harness (still functional)
```

All files use ES modules (`export` / `import`). Engine files must not import from data files.

---

## How the algorithm works

```
7 answers  →  recency-weighted 3D sum  →  threshold neighbours
           →  signature tie-break  →  inverse-distance blend  →  result
```

1. **Translate** — look up each answer's `(energy, valence, clarity)` vote in `ANSWER_MAP`
2. **Apply recency weights** — later answers carry more weight `[0.82 → 1.20]`
3. **Apply question weights** — sky ×1.5, pulse ×1.4, battery ×1.4, timeofday ×1.2
4. **Sum** — all weighted votes into one `(E, V, C)` user coordinate
5. **Find neighbours** — 3D Euclidean distance to all 22 mood pins; collect within dynamic cutoff (max 5, min 7% contribution)
6. **Signature tie-break** — if top candidates within 0.75 distance, score by characteristic answer patterns; winner gets 12% distance boost
7. **Inverse-distance blend** — closer moods dominate result and palette
8. **Bayesian overlay** (once sufficient feedback exists) — blend in learned probability distributions from observed sessions

---

## The three axes

| Axis | Vote range | Weighted sum range | What it captures |
|------|-----------|-------------------|-----------------|
| **Energy** | −1, 0, +1 | −12.6 → +12.6 | Activation — drained vs. wired |
| **Valence** | −1, 0, +1 | −12.6 → +12.6 | Tone — dark/heavy vs. open/warm |
| **Clarity** | −2, −1, 0, +1, +2 | −25.2 → +25.2 | Definition — murky vs. sharp |

Clarity axis weight: **0.80** normally, **1.05** when user clarity < −2.

---

## Question weights

| Question | Weight | Why |
|----------|--------|-----|
| colour | ×1.0 | Emotional tone anchor |
| sky | ×1.5 | Atmospheric anchor, strongest tie-breaker |
| pulse | ×1.4 | Most direct body-energy signal |
| texture | ×1.0 | Tactile emotional register |
| sound | ×1.0 | Ambient emotional register |
| battery | ×1.4 | Most direct capacity and clarity signal |
| timeofday | ×1.2 | Temporal clarity signal |

---

## Recency weights

```js
[0.82, 0.88, 0.94, 1.00, 1.06, 1.14, 1.20]
// first answer carries 0.82×, last carries 1.20× — 46% more than first
```

---

## Adaptive question ordering

- Q1 (colour) and Q2 (sky) always asked first — they anchor the visual vocabulary
- After Q2, remaining questions ranked by **information gain** — the question that most reduces coordinate uncertainty is asked next
- Two users with different Q1/Q2 answers will see different Q3–Q7 sequences
- This is intentional — flag it in peer review so it isn't read as a bug

---

## The learning layer (engine/learning.js)

Three capabilities that activate progressively as sessions accumulate:

### Telemetry
Every session logs anonymously to localStorage:
- All 7 answers and the order they were given
- Time spent on each question (dwell time in ms)
- Final result: mood, zone, confidence, top 3 neighbours
- Feedback signal if given

Capped at 500 sessions. Storage keys: `mm_sessions`, `mm_meta`.

### Feedback
"Does this feel right?" appears on the result screen after reveal. Two options: *"Yes, it does"* / *"Not quite"*. Signal stored against that session.

### Weight learning
Gradient descent on question weights from feedback history. Runs automatically every 25 sessions with feedback, and immediately on any "not quite" response.

- "Feels right" → small reinforcement of all question weights
- "Not quite" → increases weights of questions whose answer was consistent with the correct mood; decreases questions whose answer led away from it
- Weight range clamped: 0.5 minimum, 2.5 maximum
- Weights normalised to average 1.0 after each update
- Falls back to designed weights silently until enough data exists

### Bayesian profile matching
For each mood, builds a probability distribution from observed sessions: `P(answer | mood)`. Uses Naive Bayes with Laplace smoothing. Blends into the spatial result once sufficient data exists.

**Activation thresholds (calibrated for 500-person rollout):**
- Bayesian scores compute after **100 total sessions**
- Blend weight starts after **50 feedback sessions**
- Reaches maximum **40% Bayesian influence** at **500 feedback sessions**
- Before these thresholds: algorithm is 100% spatial, learning layer is invisible

---

## The 22 moods — zones

| Zone | Moods | Count |
|------|-------|-------|
| **Golden Hour** | Radiant, Bright, Energised, Determined, Alive | 5 |
| **Morning Mist** | Peaceful, Tender, Calm, Soft | 4 |
| **Amber Hours** | Grateful, Nostalgic | 2 |
| **Dead Calm** | Even | 1 |
| **Wildfire Dusk** | Edged, Wired, Anxious, Restless, Frayed | 5 |
| **Blue Hour** | Muted, Heavy, Hollow, Withdrawn | 4 |
| **Stillwater** | Numb | 1 |

Full coordinates, palettes, and signature patterns in `MOOD-MAP.md`.

---

## Public API

```js
import { compute, partialCompute, getAdaptiveOrder,
         QUESTIONS, MOOD_MAP } from './mood-algorithm.js';

// Full compute — all 7 answers required
const result = compute(answers, answerOrder, { learnedWeights, bayesScores, bayesBlendWeight });

// Partial compute — any number of answers, zero-padded
const partial = partialCompute(answers, answerOrder);

// Next questions ranked by information gain
const queue = getAdaptiveOrder(answers, currentCoord);
```

### Full result shape

```js
{
  mood:           "Anxious",
  tagline:        "Something feels wrong. Can't name it.",
  zone:           "Wildfire Dusk",
  blendLanguage:  "Anxious, with traces of Wired and Frayed",
  confidence:     0.51,

  palette:        { primary: "#906050", secondary: "#705040", accent: "#503830" },
  blendedPalette: { primary: "...", secondary: "...", accent: "..." },

  neighbors: [
    { mood: "Anxious",  zone: "Wildfire Dusk", distance: 6.21, weight: 0.38, similarity: 0.61 },
    { mood: "Wired",    zone: "Wildfire Dusk", distance: 7.84, weight: 0.31, similarity: 0.51 },
    { mood: "Frayed",   zone: "Wildfire Dusk", distance: 8.10, weight: 0.31, similarity: 0.49 }
  ],

  motion: {
    angle:       -42,    // gradient rotation
    intensity:   0.67,   // animation speed
    clarityNorm: 0.17    // saturation / result-word blur
  },

  debug: {
    userCoordinate:  { energy: 4.8, valence: -4.2, clarity: -8.6 },
    moodCoordinate:  { energy: 4, valence: -4, clarity: -3 },
    primaryDistance: 6.21,
    neighbourCount:  3
  }
}
```

---

## Engine file specs

### `engine/distance.js` exports

| Export | Description |
|--------|-------------|
| `QUESTION_WEIGHTS` | Designed per-question multipliers |
| `RECENCY_WEIGHTS` | `[0.82…1.20]` — 7 position weights |
| `dist3(a, b, userClarity)` | Adaptive 3D Euclidean distance |
| `zeroPadAnswers(answers, questions)` | Zero-pads unanswered questions |
| `weightedSum(answers, map, weights, order)` | Recency-weighted coordinate sum |
| `findNearestNeighbors(coord, moodMap, answers)` | Threshold neighbours + signature tie-break |
| `rankQuestionsByInfoGain(coord, answeredIds, qs, map, moodMap)` | Adaptive ordering |

### `engine/output.js` exports

| Export | Description |
|--------|-------------|
| `buildResult(neighbors, userCoord)` | Assembles full result object |

### `engine/learning.js` exports

| Export | Description |
|--------|-------------|
| `sessionStart()` | Call when user clicks Begin |
| `sessionQuestionShown(questionId)` | Call each time a question renders |
| `sessionAnswered(questionId, optionId)` | Call on each answer |
| `sessionComplete(result)` | Call after compute(), logs full session |
| `recordFeedback(signal)` | `'right'` or `'notquite'` |
| `getFeedbackStats()` | `{ total, right, notquite, accuracy }` |
| `getLearnedWeights(baseWeights)` | Returns learned weights or base fallback |
| `getBayesianScores(answers, moodMap)` | Returns per-mood Bayesian probabilities or null |
| `getBayesBlendWeight()` | Returns 0→0.4 based on feedback session count |
| `getAnalytics()` | Full analytics object for Insights panel |
| `clearLearningData()` | Privacy reset — clears all localStorage keys |

---

## Architecture invariants

| Rule | Why |
|------|-----|
| Engine files never import from data files | Distance/output/learning work on any mood map |
| Data files contain no logic | Pure lookup tables — easy to edit, impossible to break |
| `mood-algorithm.js` is the only cross-side importer | One wiring point |
| `questions.js` contains no numbers | UI and algorithm fully decoupled |
| `output.js` is the only file that knows the result shape | Change contract → change one file |
| `learning.js` never modifies the core algorithm | Additive layer only — algorithm works without it |

---

## Verification checklist

| # | Test | Expected |
|---|------|---------|
| 1 | Load `index.html` via server | Intro screen visible, canvas animating |
| 2 | Click Begin | Q1 colour swatches appear (8 circles) |
| 3 | Pick a colour | Canvas atmosphere shifts immediately |
| 4 | Complete all 7 | Convergence screen, then result |
| 5 | Result blur | Low-clarity answers → word is softly blurred |
| 6 | "Yes, it does" | Feedback stored, confidence bar pulses |
| 7 | "Not quite" | Feedback stored, triggers weight recheck |
| 8 | Insights button | Analytics panel shows session stats |
| 9 | Share button | 640×800 PNG card with mood word and palette |
| 10 | History button | Last results with dates and swatches |
| 11 | Again | Returns to intro, shows last result label |
| 12 | `test.html` | 7 dropdowns, works independently |

---

## Extending — adding a new mood

1. Choose coordinates — check minimum distance from all existing pins using `dist3()`; aim for ≥ 2.0
2. Add entry to `data/mood-map.js` with `id`, `name`, `coordinate`, `zone`, `tagline`, `palette`, `signature`
3. Add to `engine/llm-classifier.js` `MOOD_VOCAB` array if LLM track is re-enabled
4. No other files need to change

## Extending — adding a fourth axis

1. Add vote to every option in `data/answer-map.js`
2. Add coordinate to every mood in `data/mood-map.js`
3. Add `+ ((a.axis - b.axis) * w) ** 2` to `dist3()` in `engine/distance.js`
4. Extend `weightedSum()` accumulation and `computeMotion()` in `engine/output.js`

---

## Recommended next steps for 500-person rollout

1. **Add shared backend** — localStorage is per-device. For aggregate learning across 500 users, POST each session to a central database. The `sessionComplete()` payload is already shaped for this. Supabase or a simple serverless function + PostgreSQL is sufficient.

2. **Monitor confidence scores** — after 200 sessions, plot the distribution of `result.confidence` across all results. Persistently low confidence (< 0.45) at specific coordinates indicates either missing mood pins or ambiguous answer options in that region.

3. **Watch dwell times** — the Insights panel shows average dwell per question. Questions with very high dwell times are either the most emotionally resonant (good) or the most confusing (bad). Cross-reference with feedback accuracy to distinguish them.

4. **Add a free-text field** — one open question after the result: *"anything we missed?"* — even 50 responses will reveal vocabulary gaps the 22 pins don't cover.

---


