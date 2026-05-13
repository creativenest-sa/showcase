# Mood Map — v7

22 moods across six zones, plotted on three axes: **Energy × Valence × Clarity**.

---

## The three axes

| Axis | Per-answer range | What it measures |
|------|-----------------|-----------------|
| **Energy** | −1, 0, +1 | Activation — still and drained vs. charged and wired |
| **Valence** | −1, 0, +1 | Tone — heavy and dark vs. open and warm |
| **Clarity** | −2 to +2 | Definition — diffuse and murky vs. sharp and certain |

Clarity is orthogonal to Energy and Valence. Two people can land at identical (E, V) coordinates with very different clarity — one knowing exactly how they feel, one unable to name it. The axis separates moods that would be indistinguishable in 2D.

---

## The six zones

| Zone | Energy | Valence | Character |
|------|--------|---------|-----------|
| **Golden Hour** | High + | Positive | Sharp, saturated, forward |
| **Morning Mist** | Low + | Positive | Soft, open, restful |
| **Dead Calm** | Centre | Centre | Neutral, suspended |
| **Wildfire Dusk** | High + | Negative | Activated, dark, building |
| **Blue Hour** | Low − | Negative | Heavy, murky, contracting |
| **Amber Hours** | Low/neutral | Positive | Warm, retrospective, quiet |
| **Stillwater** | Low | Neutral | Flat, absent, switched off |

---

## 3D diagram

```
                                    VALENCE +
                                         ▲
                          Peaceful       │        Radiant
                         (−5,+5,+2)     │       (+5,+5,+2)
                    Grateful            │              Bright
                    ( 0,+5,+2)    Calm  │  Energised  (+3,+4,+3)
                              (−4,+3,+2)│  (+4,+3,+3)
               Nostalgic  Tender        │  Determined   Alive
              (−3,+4,−3)  (−3,+4,−1)   │  (+3,+1,+5)  (+2,+2,+1)
                         Soft           │
                        (−2,+2,−1)      │
                                         │
  ENERGY − ──────────────────────── Even (0,0,0) ─────────────────────── ENERGY +
                        Numb             │       Frayed
                       (−2, 0,−4)        │      (+2,−2,−2)
                        Withdrawn        │       Restless
                        (−2,−3,−2)       │      (+3,−2,−1)
                    Muted                │          Anxious  Wired
                   (−4,−2,−2)           │         (+4,−4,−3)(+4,−3,+1)
               Heavy                    │              Edged
              (−5,−4,−1)               │             (+5,−4,+2)
          Hollow
         (−3,−5,−3)
                                         ▼
                                    VALENCE −

  Clarity: +5 (Determined, sharpest) ──────────── −4 (Numb, most dissolved)
  Format: (Energy, Valence, Clarity)
```

---

## Complete reference table

| Mood | Energy | Valence | Clarity | Zone | Tagline |
|------|--------|---------|---------|------|---------|
| **Radiant** | +5 | +5 | +2 | Golden Hour | Open, warm, spilling over a little. |
| **Bright** | +3 | +4 | +3 | Golden Hour | Something just clicked. You're on. |
| **Energised** | +4 | +3 | +3 | Golden Hour | Present in your body. Switched on. |
| **Determined** | +3 | +1 | +5 | Golden Hour | Clear about what needs doing. Moving. |
| **Alive** | +2 | +2 | +1 | Golden Hour | Light, buzzy, slightly restless in a good way. |
| **Peaceful** | −5 | +5 | +2 | Morning Mist | Nothing to prove. Quietly okay. |
| **Tender** | −3 | +4 | −1 | Morning Mist | Feeling a lot, and close to the surface. |
| **Calm** | −4 | +3 | +2 | Morning Mist | Calm without effort. Just here. |
| **Soft** | −2 | +2 | −1 | Morning Mist | Unhurried. Letting things land slowly. |
| **Grateful** | 0 | +5 | +2 | Amber Hours | Quietly full. Something landed right. |
| **Nostalgic** | −3 | +4 | −3 | Amber Hours | Warm for something that isn't here anymore. |
| **Even** | 0 | 0 | 0 | Dead Calm | In between. Not quite one thing or another. |
| **Edged** | +5 | −4 | +2 | Wildfire Dusk | Something's building. You feel it everywhere. |
| **Wired** | +4 | −3 | +1 | Wildfire Dusk | Can't quite land. Body ahead of your mind. |
| **Anxious** | +4 | −4 | −3 | Wildfire Dusk | Something feels wrong. Can't name it. |
| **Restless** | +3 | −2 | −1 | Wildfire Dusk | Too many tabs open. Edges coming loose. |
| **Frayed** | +2 | −2 | −2 | Wildfire Dusk | A lot building. Not sure where it's going. |
| **Muted** | −4 | −2 | −2 | Blue Hour | The volume is turned down on everything. |
| **Heavy** | −5 | −4 | −1 | Blue Hour | Everything takes more than usual right now. |
| **Hollow** | −3 | −5 | −3 | Blue Hour | Going through the motions. Something missing. |
| **Withdrawn** | −2 | −3 | −2 | Blue Hour | Hard to see far ahead. Unclear and a bit stuck. |
| **Numb** | −2 | 0 | −4 | Stillwater | Flat. Not sad, not fine. Just switched off. |

---

## Colour palettes

| Mood | Primary | Secondary | Accent |
|------|---------|-----------|--------|
| Radiant | `#F5C842` | `#F0A840` | `#E87830` |
| Bright | `#F8C060` | `#E8A030` | `#D08020` |
| Energised | `#F0884A` | `#E06030` | `#C84018` |
| Determined | `#E07820` | `#C05808` | `#A04000` |
| Alive | `#E8A048` | `#D07828` | `#B85810` |
| Peaceful | `#A8D8C8` | `#78B8A8` | `#488878` |
| Tender | `#C0C8E8` | `#A0A8C8` | `#8088A8` |
| Calm | `#90C8B8` | `#60A898` | `#308878` |
| Soft | `#B8C8D8` | `#98A8C8` | `#7888A8` |
| Grateful | `#D4A870` | `#B88850` | `#9C6C38` |
| Nostalgic | `#C89858` | `#A87840` | `#886030` |
| Even | `#9898A8` | `#787888` | `#585868` |
| Edged | `#C84838` | `#A82818` | `#880808` |
| Wired | `#C85828` | `#A84010` | `#883000` |
| Anxious | `#906050` | `#705040` | `#503830` |
| Restless | `#A87858` | `#886040` | `#685030` |
| Frayed | `#988870` | `#786858` | `#584840` |
| Muted | `#283858` | `#182848` | `#081838` |
| Heavy | `#304060` | `#204050` | `#103040` |
| Hollow | `#404858` | `#303848` | `#202838` |
| Withdrawn | `#485870` | `#384860` | `#283850` |
| Numb | `#606068` | `#484850` | `#303038` |

---

## Why the new moods were added (v7)

**Determined (+3, +1, +5)** — The Golden Hour zone had activation (Energised), warmth-overflow (Radiant), and gentle buzz (Alive), but nothing for focused forward motion. Determined has the highest clarity coordinate in the system (+5) because knowing exactly what you're doing *is* its defining feature. Sits 2.75 from Energised — close enough to be recognisable as related, far enough to win cleanly on the right answer set.

**Anxious (+4, −4, −3)** — Wildfire Dusk had Edged (high energy, negative, *sharp* — it knows what it is) and Wired (high energy, negative, slight clarity) but nothing for the specific texture of high activation with unclear threat. Anxious has negative clarity (−3) which is what separates it from Edged. Sits 3.0 from Frayed and 3.1 from Restless.

**Nostalgic (−3, +4, −3)** — Tender and Soft both live in the low-energy positive zone but both describe present-tense emotional states. Nostalgic is retrospective — warmth that belongs to the past, experienced now as a soft dissolve. The negative clarity (−3) reflects that nostalgia is inherently unfocused — it drifts. Sits 2.1 from Tender.

**Grateful (0, +5, +2)** — Strongly positive valence at near-zero energy with moderate clarity. The positive zone was well-covered for high energy and for low energy, but the specific quiet of noticing something good had no pin. Different from Peaceful (which is about the absence of pressure) and from Tender (which is about emotional exposure). Sits 3.3 from Bright.

**Numb (−2, 0, −4)** — The lowest-clarity coordinate in the system (−4). Not heavy (which still has weight), not hollow (which has a felt loss) — just flat. Zero valence means it doesn't read as negative or positive, just absent. Sits 3.5 from Muted, genuinely its own territory. In blend results it often appears alongside Hollow and Muted, which is accurate — these states genuinely co-occur.

---

## Clarity as the third dimension — design rationale

Clarity separates pairs that Energy/Valence cannot distinguish:

| Pair | Same (E,V) region | What Clarity separates |
|------|------------------|----------------------|
| Tender vs Nostalgic | Both (−3, +4) range | Tender is present-tense; Nostalgic is past-tense and dissolving |
| Edged vs Anxious | Both high energy negative | Edged knows what it is (+2); Anxious doesn't (−3) |
| Determined vs Energised | Both high energy positive | Determined is focused (+5); Energised is physical (+3) |
| Hollow vs Numb | Both low energy near-neutral | Hollow has felt loss (−3); Numb is pure flat (−4) |
| Heavy vs Muted | Both low energy negative | Heavy has weight (−1); Muted is diffuse (−2) |

---

## Motion output from user coordinate

| Value | Formula | Drives |
|-------|---------|--------|
| **angle** | `atan2(valence, energy) × 180/π` | Gradient rotation direction |
| **intensity** | `√(E²+V²+C²) / maxMagnitude` | Animation speed, gradient boldness |
| **clarityNorm** | `(C + maxC) / (2 × maxC)` | Colour saturation, result-word blur |
| **confidence** | Primary neighbour weight dominance | Certainty indicator on result screen |

---

