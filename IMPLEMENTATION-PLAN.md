# Implementation Plan — Mood Algorithm

**Approach:** Nearest Centroid Classifier operating in a 2D affect space, packaged as a self-contained module plus a bare HTML harness for testing.

The algorithm takes six answers and returns a result object containing a mood name, tagline, and colour palette. It runs entirely in the browser. No npm dependencies, no build step, no bundler.

---

## File structure

```
mood-experience/
├── mood-algorithm.js        Entry point — exports compute()
├── data/
│   ├── questions.js         Question text + answer options shown to user
│   ├── answer-map.js        Each option's (energy, valence) coordinate
│   └── mood-map.js          Each mood's coordinate, name, tagline, palette
├── engine/
│   ├── distance.js          Sum coordinates + find nearest mood
│   └── output.js            Build the result object
└── test.html                Bare harness — six dropdowns + run button
```

All files use ES modules (`export` / `import`).

---

## How the algorithm works

Three steps. No zones, no tie-breaks, no special cases.

1. **Look up coordinates.** Each of the six answers has an (energy, valence) coordinate stored in the answer map. Energy and valence each take values of `−1`, `0`, or `+1`.
2. **Sum.** Add all six coordinates into a single user coordinate. Range is (−6, −6) to (+6, +6).
3. **Find nearest.** Each mood is pinned at a coordinate on the same plane. Return the mood with the smallest Euclidean distance from the user's coordinate.

---

## Public API

`mood-algorithm.js` exports one function plus the static data:

```js
import { compute, QUESTIONS, MOOD_MAP } from './mood-algorithm.js';

const result = compute({
  colour:  'storm-grey',
  sky:     'overcast',
  pulse:   'slow-and-steady',
  texture: 'heavy-wool',
  sound:   'quiet-crickets',
  battery: 'flickering'
});
```

Returns:

```js
{
  mood:    "Muted",
  tagline: "The volume is turned down on everything.",
  palette: { primary: "#6B7B8C", secondary: "#8FA0B3", accent: "#4F5C6B" },
  debug: {
    moodId:         "muted",
    userCoordinate: { energy: -4, valence: -2 },
    moodCoordinate: { energy: -4, valence: -2 },
    distance:       0
  }
}
```

`compute()` throws a clear error for unknown question or option IDs.

---

## File specs

### `data/questions.js`

Exports `QUESTIONS` — array of six question objects in this order: `colour`, `sky`, `pulse`, `texture`, `sound`, `battery`.

Shape:

```js
{
  id: 'colour',
  label: 'Pick a colour that feels right today',
  options: [
    { id: 'honey-gold', label: 'Honey Gold' },
    { id: 'storm-grey', label: 'Storm Grey' },
    // ...
  ]
}
```

Each question has 5–8 options. No numeric data lives in this file — only text shown to the user.

### `data/answer-map.js`

Exports `ANSWER_MAP` — nested lookup:

```js
{
  colour: {
    'honey-gold': { energy: +1, valence: +1 },
    'storm-grey': { energy: +1, valence: -1 },
    // ...
  },
  sky: { /* ... */ },
  // ...
}
```

`ANSWER_MAP[questionId][optionId]` returns `{ energy, valence }` where each is `−1`, `0`, or `+1`.

### `data/mood-map.js`

Exports `MOOD_MAP` — array of 17 mood objects. Shape:

```js
{
  id: 'muted',
  name: 'Muted',
  coordinate: { energy: -4, valence: -2 },
  tagline: 'The volume is turned down on everything.',
  palette: { primary: '#6B7B8C', secondary: '#8FA0B3', accent: '#4F5C6B' }
}
```

17 moods across four quadrants, balanced 8 high-energy / 8 low-energy / 1 centre:

- **High energy + positive valence** (Golden Hour zone) — Alive (+2,+2), Bright (+3,+4), Energised (+4,+3), Radiant (+5,+5)
- **Low energy + positive valence** (Soft Light zone) — Soft (−2,+2), Tender (−3,+4), Calm (−4,+3), Peaceful (−5,+5)
- **High energy + negative valence** (Wildfire Dusk zone) — Frayed (+2,−2), Restless (+3,−2), Wired (+4,−3), Edged (+5,−4)
- **Low energy + negative valence** (Blue Hour zone) — Withdrawn (−2,−3), Muted (−4,−2), Heavy (−5,−4), Hollow (−3,−5)
- **Centre** — Even (0,0)

Pins range from (±2, ±2) at the mild end to (±5, ±5) at the strongest. See [MOOD-MAP.md](MOOD-MAP.md) for the full reference table and diagram.

### `engine/distance.js`

Exports two pure functions. No imports from the data files.

```js
export function sumCoordinates(coords)
// coords: array of { energy, valence }
// returns: { energy, valence }

export function findNearestMood(userCoord, moodMap)
// userCoord: { energy, valence }
// moodMap:   array of mood objects
// returns:   { mood: <nearest mood object>, distance: <number> }
```

Uses Euclidean distance. `findNearestMood` throws if the mood map is empty.

### `engine/output.js`

Exports one function:

```js
export function buildResult(mood, userCoordinate, distance)
// returns: result object as documented in the Public API section above
```

This is the only file that knows the result shape.

### `mood-algorithm.js`

The entry point.

- Imports `ANSWER_MAP` and `MOOD_MAP` from the data files.
- Imports `sumCoordinates` and `findNearestMood` from `engine/distance.js`.
- Imports `buildResult` from `engine/output.js`.
- Exports `compute(answers)` — orchestrates the three steps. No logic beyond input validation and wiring.
- Re-exports `QUESTIONS` and `MOOD_MAP` so consumers only need to import this one file.

### `test.html`

Bare HTML test harness. No design, no animations.

```html
<!-- Run with: cd mood-experience && python3 -m http.server 8000 -->
<!-- Then open: http://localhost:8000/test.html -->
```

Layout:
- Page title and a one-line subtitle
- Six dropdowns (one per question), populated dynamically from `QUESTIONS`
- Three buttons: **Run**, **Load worked example**, **Reset**
- Result panel showing: mood name, tagline, three colour swatches (primary / secondary / accent), and the `debug` JSON pretty-printed

---

## Verification

The build is correct if all of the following hold:

1. Opening `test.html` (via local server) shows six dropdowns populated from the questions.
2. Clicking **Load worked example** populates the dropdowns and produces:
   - mood: **Muted**
   - tagline: *"The volume is turned down on everything."*
   - user coordinate: **(−4, −2)**
   - mood coordinate: **(−4, −2)**
   - distance: **0**
3. Picking all warm/positive answers produces a result in the high-energy positive zone (Alive / Bright / Energised / Radiant).
4. Calling `compute()` with an unknown question or option ID throws a clear, descriptive error.
5. The harness shows a useful error message if Run is clicked with answers missing.

---

## Notes on architecture

The five-module split exists so each concern can change independently:

- Editing question wording → only `questions.js` changes
- Recalibrating a vote → only `answer-map.js` changes
- Moving a mood pin → only `mood-map.js` changes
- Changing distance metric → only `distance.js` changes
- Changing result shape → only `output.js` changes

Keep this separation strictly. The engine files must not import from the data files. The data files must not contain logic. `mood-algorithm.js` is the only file that imports from both sides.

---

*Plan.Net Studios · May 2026*
