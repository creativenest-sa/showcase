# Implementation Plan — Mood Algorithm

**Build:** Option A (Nearest Neighbour) implementation of the mood algorithm, packaged as a self-contained "lego block" plus a bare HTML harness for testing.

The algorithm takes six answers and returns a result object containing a mood name, tagline, and colour palette. It runs entirely in the browser. No npm dependencies, no build step, no bundler.

---

## File structure to create

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
2. **Sum.** Add all six coordinates into a single user coordinate. Range is roughly (−6, −6) to (+6, +6).
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

`compute()` must throw a clear error for unknown question or option IDs.

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

The Racing option in `pulse` scores as `{ energy: +1, valence: 0 }` — energy without committed tone. No conditional logic; surrounding answers tilt the result naturally.

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

**Required pins:**

- An **Even** mood at exactly `(0, 0)` — what balanced answer sets land on.
- A **Muted** mood at exactly `(−4, −2)` with tagline *"The volume is turned down on everything."* — needed for the verification test below.

**Spread the rest** across the four quadrants:
- **High energy + positive valence** (Golden Hour zone) — Alive, Bright, Energised, Radiant
- **Low energy + positive valence** (Soft Light zone) — Soft, Tender, Calm, Peaceful
- **High energy + negative valence** (Wildfire Dusk zone) — Frayed, Restless, Wired, Edged
- **Low energy + negative valence** (Blue Hour zone) — Withdrawn, Muted, Heavy, Hollow

Place pins between roughly `(±2, ±2)` and `(±5, ±5)` — closer to the centre for milder moods, further out for stronger ones.

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

Use Euclidean distance. `findNearestMood` should throw if the mood map is empty.

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
- Exports `compute(answers)` — orchestrates the three steps. No logic of its own beyond input validation and wiring.
- Re-exports `QUESTIONS` and `MOOD_MAP` so consumers (like the test harness) only need to import this one file.

### `test.html`

Bare HTML test harness. No design, no animations.

Layout:
- Page title and a one-line subtitle
- Six dropdowns (one per question), populated dynamically from `QUESTIONS`
- Three buttons: **Run**, **Load worked example**, **Reset**
- Result panel showing: mood name, tagline, three colour swatches (primary / secondary / accent), and the `debug` JSON pretty-printed

Use `<script type="module">` to import from `mood-algorithm.js`. Show a clear error message if the user hits Run without picking all six answers.

The "Load worked example" button fills in the canonical case from the verification section below and runs it.

Add a comment at the top of `test.html`:

```html
<!-- Run with: cd mood-experience && python3 -m http.server 8000 -->
<!-- Then open: http://localhost:8000/test.html -->
```

---

## Placeholder content

The data files need plausible placeholder content so the harness runs end-to-end. The content team will replace it before launch.

For **questions and answer map**, generate options that fit each question's theme, with coordinates that reflect their meaning. Example calibrations:

- Q1 Colour — warm/vivid colours lean positive, cool/dark lean negative; saturated colours lean high-energy
- Q2 Sky — clear/bright skies positive, overcast/storm negative; storms high-energy, twilight low-energy
- Q3 Pulse — still/slow are low-energy, racing/quickened are high-energy; tone is mostly neutral
- Q4 Texture — soft/silk positive, heavy/cold negative; bristled is high-energy, wool is low-energy
- Q5 Sound — birdsong/crickets positive, static/heartbeat negative; silence is low-energy
- Q6 Battery — full positive/high, drained negative/low

The following six options must exist with these exact coordinates so the verification test passes:

| Question | Option ID | Label | (Energy, Valence) |
|----------|-----------|-------|-------------------|
| colour | `storm-grey` | Storm Grey | (+1, −1) |
| sky | `overcast` | Overcast | (−1, −1) |
| pulse | `slow-and-steady` | Slow and steady | (−1, +1) |
| texture | `heavy-wool` | Heavy wool | (−1, −1) |
| sound | `quiet-crickets` | Quiet crickets | (−1, +1) |
| battery | `flickering` | Flickering | (−1, −1) |

For the **mood map**, generate 17 moods following the quadrant guidance in the file spec above. Pick palettes that feel right for each mood's emotional tone — warm hues for positive, cool/desaturated for negative.

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
3. Picking all warm/positive answers produces a result in the high-energy positive area (mood name should be one of Radiant / Bright / Energised or similar).
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
