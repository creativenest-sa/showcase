# Mood Algorithm — How It Works

---

## The approach

Two options were considered:

- **Option A — Nearest Neighbour.** Each mood is placed at a coordinate on a shared map. The user's answers produce a coordinate too. The mood closest to the user's coordinate is the result.
- **Option B — Zone + Refinement Hybrid.** A two-step approach where coordinates first pick a broad zone, then a per-question profile picks the specific mood inside that zone.

**Option A is the chosen approach.** It's simpler, has fewer edge cases, and concentrates the design work in one place — mood placement on the map — rather than spreading it across zone boundaries and per-mood profiles. The rest of this document describes Option A. Option B is documented at the end as a non-destructive fallback if Option A proves too coarse in practice.

---

## How it works (Option A)

Each answer carries an (energy, valence) coordinate. Add the six together to find where the user lands. A separate map holds every mood at its own coordinate — the mood nearest the user's position is the one returned.

```
6 answers  →  sum of coordinates  →  closest mood wins
```

The result:

> **Muted.**  
> The volume is turned down on everything.

---

## The two dimensions

Every answer contributes to two axes:

| Axis | Range | Meaning |
|------|-------|---------|
| **Energy** | −1, 0, +1 | Activation — how alive the feeling is |
| **Valence** | −1, 0, +1 | Tone — broadly positive or negative |

After six questions, the user lands on a coordinate somewhere between (−6, −6) and (+6, +6).

---

## The mood map

Every mood is placed at a specific coordinate. Illustrative layout:

```
                  Positive (+valence)
                         │
        · Tender         │         · Radiant
                         │
        · Soft           │         · Bright
                         │
  ─────────────────── · Even ─────────────────── Energy
                       (0,0)
        · Muted          │         · Wired
                         │
        · Heavy          │         · Edged
                         │
                  Negative (−valence)
```

Moods near the edges represent stronger feelings. Moods near the centre represent quieter ones. **Even** sits at (0, 0) — the genuinely neutral state, which is where a balanced answer set should land.

Pin placement is the design. A wrongly placed pin shifts every nearby result, so this is where most of the careful work lives.

---

## Worked example — landing on Muted

**Answers:** Storm Grey · Overcast · Slow and steady · Heavy wool · Quiet crickets · Flickering

| Question | Answer | Coordinate |
|----------|--------|------------|
| Q1 Colour | Storm Grey | (+1, −1) |
| Q2 Sky | Overcast | (−1, −1) |
| Q3 Pulse | Slow and steady | (−1, +1) |
| Q4 Texture | Heavy wool | (−1, −1) |
| Q5 Sound | Quiet crickets | (−1, +1) |
| Q6 Battery | Flickering | (−1, −1) |
| **Sum** | | **(−4, −2)** |

User lands at (−4, −2). Euclidean distance to nearby moods:

| Mood | Coordinate | Distance |
|------|------------|----------|
| **Muted** | (−4, −2) | **0.00** |
| Heavy | (−5, −3) | 1.41 |
| Hollow | (−3, −4) | 2.24 |
| Tender | (−3, +2) | 4.12 |

Closest mood wins: **Muted.** *The volume is turned down on everything.*

---

## What Option A simplifies

Because the algorithm is a single step — sum, then find nearest — several things that more layered designs would need simply aren't required:

- **No zones.** No quadrant boundaries means no "user landed on the edge" edge cases.
- **No tie-breaks.** A coordinate of (0, 0) lands on Even. Near-zero coordinates land on whichever mood was pinned closest. The Q2 → Q4 → Q6 cascade rule disappears.
- **No Racing special case.** Racing scores as (+1, 0) — energy without committed tone. Surrounding answers determine which side it tilts toward, naturally. No conditional logic, no answer that depends on other answers.
- **No refinement step.** The pin placement *is* the refinement.

The whole algorithm is one function: sum coordinates, compute distances, return the nearest mood.

---

## Modular structure

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

- **Question data** — text, names, visuals shown to the person. No numbers.
- **Answer map** — every option's (energy, valence) coordinate.
- **Mood map** — every mood's coordinate, name, tagline, palette.
- **Distance engine** — sums answers, finds closest mood. Stateless.
- **Output builder** — assembles result from mood ID, including synonym variation.

Each piece can change without touching the others.

---

## Implementation

One file, pure JavaScript, no dependencies.

```
6 answers  →  mood-algorithm.js  →  result object
```

Result shape:

```js
{
  mood:    "Muted",
  tagline: "The volume is turned down on everything.",
  palette: { primary, secondary, accent }
}
```

Build locally with a bare HTML harness — six dropdowns, a run button, raw output on screen. Tweak the answer map, move a mood pin, hit run again. When it feels right, hand `mood-algorithm.js` to Claude Design. They import it, call one function, and build the full experience around the result. The algorithm runs entirely in the browser — no server, no database.

---

## Option B — Zone + Refinement Hybrid (alternative)

If Option A proves too coarse in practice — for example, if multiple moods cluster at similar coordinates and results in that region feel arbitrary — Option B is the next step up:

1. Use the (energy, valence) sum to pick a broad zone.
2. Within the zone, score each candidate mood against the user's per-question answers using a profile vector. Lowest distance wins.

The hybrid recovers signal that pure nearest neighbour discards: Q2's persistence, Q3's body-vs-mind, Q5's outward-vs-inward orientation. The cost is real — every mood needs a profile across all six questions — but the path is non-destructive. Only the distance engine changes; the answer map, mood map, question data, and output builder are unaffected.

Start with Option A. Move to Option B only if testing shows it's needed.

---
