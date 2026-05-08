# Mood Algorithm — How It Works

A browser-based mood engine that takes six answers and returns the closest emotional state from a mapped set of moods — no server, no dependencies, one function call.

**Quick links**
- [Mood Map](MOOD-MAP.md) — all 17 moods plotted on the (energy, valence) plane
- [Implementation Plan](IMPLEMENTATION-PLAN.md) — file structure, API spec, and verification steps
- [Running the demo](#running-the-demo) — how to spin up the test harness locally

---

## The algorithm

This is a **Nearest Centroid Classifier** — each mood is pinned at a point on the plane, the user's answers produce a coordinate, and the closest pin wins. No training data, no learning phases, no special cases. Just geometry.

Because the algorithm is purely spatial, additional dimensions can be added (e.g. a third axis for clarity or sleep quality). Each new dimension requires answer votes and mood pin coordinates for that axis — the distance calculation gains one more term. The mood map and answer map are the only files affected.

---

## The idea in one sentence

The user answers six questions. Each answer nudges a point across a 2D emotional map. Whichever mood pin is closest to where they land — that's their result.

---

## The two dimensions

Every answer contributes a small vote on two axes:

| Axis | Range | What it captures |
|------|-------|-----------------|
| **Energy** | −1, 0, +1 | How activated the feeling is — still and drained vs. alive and wired |
| **Valence** | −1, 0, +1 | The tone of that feeling — dark and heavy vs. open and warm |

Six questions means six votes per axis. The user can land anywhere between (−6, −6) and (+6, +6).

---

## The mood map

17 moods are pinned across that same plane. Stronger feelings sit near the edges; quieter ones sit near the centre. **Even** lives at (0, 0) — the genuinely neutral state.

```
                              Positive (+valence)
                                      │
  Peaceful  ·  (−5,+5)               │               (+ 5,+5)  · Radiant
    Tender  ·  (−3,+4)               │               (+3,+4)   · Bright
      Calm  ·  (−4,+3)               │               (+4,+3)   · Energised
      Soft  ·  (−2,+2)               │               (+2,+2)   · Alive
                                      │
──────────────────────────────────· Even (0,0) ────────────────────────────── Energy
                                      │
     Muted  ·  (−4,−2)               │               (+2,−2)   · Frayed
  Withdrawn  · (−2,−3)               │               (+3,−2)   · Restless
     Heavy  ·  (−5,−4)               │               (+4,−3)   · Wired
    Hollow  ·  (−3,−5)               │               (+5,−4)   · Edged
                                      │
                              Negative (−valence)

          Low energy ◄────────────────────────────────► High energy
```

The four zones:
- **Top right** — high energy, positive tone *(Alive, Bright, Energised, Radiant)*
- **Top left** — low energy, positive tone *(Soft, Tender, Calm, Peaceful)*
- **Bottom right** — high energy, negative tone *(Frayed, Restless, Wired, Edged)*
- **Bottom left** — low energy, negative tone *(Withdrawn, Muted, Heavy, Hollow)*

Pin placement is where all the design work lives. Move a pin and every nearby result shifts with it.

---

## How the algorithm runs

```
6 answers  →  sum of coordinates  →  closest mood wins
```

Three steps, no special cases:

1. **Translate** — look up each answer's `(energy, valence)` vote in the answer map
2. **Sum** — add all six votes together to get one user coordinate
3. **Find nearest** — measure Euclidean distance to every mood pin, return the closest

---

## Worked example — landing on Muted

**Answers:** Storm Grey · Overcast · Slow and steady · Heavy wool · Quiet crickets · Flickering

| Question | Answer | Vote |
|----------|--------|------|
| Q1 Colour | Storm Grey | (+1, −1) |
| Q2 Sky | Overcast | (−1, −1) |
| Q3 Pulse | Slow and steady | (−1, +1) |
| Q4 Texture | Heavy wool | (−1, −1) |
| Q5 Sound | Quiet crickets | (−1, +1) |
| Q6 Battery | Flickering | (−1, −1) |
| **Sum** | | **(−4, −2)** |

User lands at (−4, −2). The algorithm measures distance to every mood pin:

| Mood | Coordinate | Distance |
|------|------------|----------|
| **Muted** | (−4, −2) | **0.00** |
| Heavy | (−5, −4) | 2.24 |
| Withdrawn | (−2, −3) | 2.24 |
| Hollow | (−3, −5) | 3.16 |

Closest mood wins: **Muted.** *The volume is turned down on everything.*

---

## What the files do

```
mood-experience/
├── mood-algorithm.js        ← the front door
├── data/
│   ├── questions.js         ← what the user sees
│   ├── answer-map.js        ← what each answer means numerically
│   └── mood-map.js          ← where the 17 moods live on the plane
└── engine/
    ├── distance.js          ← the maths
    └── output.js            ← shapes the result object
```

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
│ Question   │ ─►│ Answer     │ ─►│ Distance   │ ─►│ Output     │
│ data       │   │ map        │   │ engine     │   │ builder    │
└────────────┘   └────────────┘   └─────▲──────┘   └────────────┘
                                        │
                                  ┌─────┴──────┐
                                  │ Mood map   │
                                  └────────────┘
```

**`data/questions.js`** — Pure UI content. Six questions and their labelled answer options. No numbers anywhere. The only file a copywriter ever needs to touch.

**`data/answer-map.js`** — The translation layer. Maps every option ID to an `(energy, valence)` vote. Picking "Storm Grey" gives `(+1, −1)`. Picking "Birdsong" gives `(0, +1)`. This is where the emotional meaning of each choice lives.

**`data/mood-map.js`** — The destination map. 17 moods, each pinned at a coordinate, with a name, tagline, and colour palette. Moving a pin here changes what answer sets land on that mood — this is the main design lever.

**`engine/distance.js`** — Two pure functions. `sumCoordinates` adds the six answer vectors. `findNearestMood` scans all 17 pins and returns the closest. No data, no state — just maths.

**`engine/output.js`** — Assembles the final result object from the winning mood. The only file that knows what shape the result takes.

**`mood-algorithm.js`** — The orchestrator. Imports everything, wires it together, and exposes one function: `compute(answers)`. A consumer only ever needs to import this single file.

Each piece can change without touching the others — move a pin, recalibrate a vote, rename a mood — and nothing else breaks.

---

## What the result looks like

```js
{
  mood:    "Muted",
  tagline: "The volume is turned down on everything.",
  palette: { primary: "#6B7B8C", secondary: "#8FA0B3", accent: "#4F5C6B" }
}
```

The algorithm runs entirely in the browser. No server, no database, no build step.

---

## The map as a mood wheel — colour and motion

Because this is a spatial algorithm — not a weighted score — it naturally supports something a scoring system can't: **continuous colour and motion driven by where the user actually lands on the plane.**

### The plane is already a mood wheel

The energy/valence coordinate system is structurally identical to the Russell Circumplex Model of affect — the same model that underlies most mood wheels in psychology. That's not a coincidence. The four quadrants map directly:

```
             calm · peaceful · tender · soft
                  (low energy, positive)
                          │
  heavy · hollow    ──────┼──────   alive · bright · radiant
  withdrawn · muted       │         energised
  (low energy, neg)      Even      (high energy, pos)
                          │
             frayed · restless · wired · edged
                  (high energy, negative)
```

Arranged radially this becomes a wheel. The algorithm is already doing wheel-navigation — it just presents it as a grid.

### Colour blending between neighbors

The algorithm currently returns the winning mood's palette. But the user rarely lands exactly on a pin — they land *between* pins. That distance data is already in the output.

By surfacing the top 3 nearest moods alongside their distances, the UI layer can blend palettes proportionally:

```
user lands between Alive (dist 0.8) and Bright (dist 1.4) and Energised (dist 1.6)
  → primary colour = weighted blend of their three primaries
  → the closer the mood, the more it dominates the blend
```

This means colours never hard-cut between states. Someone sitting halfway between Alive and Frayed gets a colour that is literally halfway between those two palettes. The map becomes a continuous colour field, not 17 discrete buckets.

### Gradient direction and motion intensity

Two values fall out of the user coordinate for free:

| Value | Formula | What it drives |
|---|---|---|
| **Angle** | `atan2(valence, energy)` | Direction of a gradient or rotation — points toward the emotional zone the user is in |
| **Intensity** | `√(energy² + valence²) ÷ 6` | Normalised 0–1 distance from centre — drives animation speed, saturation, or gradient boldness |

Someone landing at (−4, −2) has an angle pointing toward the low-energy negative zone and a high intensity — a slow, desaturated, heavy gradient. Someone at (+4, +3) gets a fast, warm, saturated one pointing toward the golden-hour zone. **Even** at (0, 0) produces zero intensity — still, neutral, no motion.

### What this means for the algorithm

The core logic doesn't change. The only addition needed is surfacing the nearest neighbors in the output alongside the winner:

```js
{
  mood:      "Alive",
  tagline:   "Sharp enough to notice. Open enough to enjoy it.",
  palette:   { primary, secondary, accent },     // winning mood — use as base
  neighbors: [                                    // next two closest, for blending
    { mood: "Bright",    distance: 2.24, palette: { ... } },
    { mood: "Energised", distance: 2.24, palette: { ... } },
  ],
  motion: {
    angle:     45,      // degrees — gradient rotation direction
    intensity: 0.47,    // 0 (centre/still) → 1 (edge/strong)
  }
}
```

The UI layer has everything it needs. The algorithm stays a single nearest-neighbour lookup — the spatial richness is already baked in.

---

## Option B — Zone + Refinement Hybrid (alternative)

If the nearest-neighbour approach ever feels too coarse — for example, if multiple moods cluster at similar coordinates and results in that region feel arbitrary — Option B is the next step up:

1. Use the (energy, valence) sum to pick a broad zone.
2. Within the zone, score each candidate mood against the user's per-question answers using a profile vector. Lowest distance wins.

Only the distance engine would change — the answer map, mood map, question data, and output builder are all unaffected.

Start with Option A. Move to Option B only if testing shows it's needed.

---

## Running the demo

```bash
cd mood-experience
python3 -m http.server 3000
```

Then open **http://localhost:3000/test.html** in your browser.

- **Run** — computes a result from your six selected answers
- **Load worked example** — fills in the canonical test case and runs it (should return *Muted*, distance 0)
- **Reset** — clears all answers

Stop the server with `Ctrl+C`.