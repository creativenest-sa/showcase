# Mood Map — v5

All 17 moods plotted on three axes: **Energy × Valence × Clarity**.

---

## The three axes

| Axis | Per-answer range | What it measures |
|------|-----------------|-----------------|
| **Energy** | −1, 0, +1 | Activation level — still and drained vs. charged and wired |
| **Valence** | −1, 0, +1 | Emotional tone — heavy and dark vs. open and warm |
| **Clarity** | −2, −1, 0, +1, +2 | Definition of the feeling — diffuse and murky vs. sharp and certain |

Clarity is orthogonal to Energy and Valence. The same mood can be experienced at different clarity levels — *Tender* with high clarity is close to the surface and named; with low clarity it is an unnamed warmth. The third axis separates states that were previously indistinguishable in 2D.

---

## The five zones

| Zone | Energy | Valence | Clarity character |
|------|--------|---------|------------------|
| **Golden Hour** | High + | Positive | Sharp, saturated |
| **Morning Mist** | Low + | Positive | Mixed — Calm/Peaceful clear, Tender/Soft soft |
| **Wildfire Dusk** | High + | Negative | Drops as energy becomes scattered |
| **Blue Hour** | Low − | Negative | Murky, dissolving |
| **Dead Calm** | Centre | Centre | Neutral, suspended |

---

## 3D diagram

```
                                    VALENCE +
                                         ▲
                          Peaceful       │        Radiant
                         (−5,+5,+2)     │       (+5,+5,+2)
                     Tender             │              Bright
                    (−3,+4,−1)    Calm  │  Energised  (+3,+4,+3)
                              (−4,+3,+2)│  (+4,+3,+3)
                         Soft           │      Alive
                        (−2,+2,−1)      │    (+2,+2,+1)
                                         │
  ENERGY − ────────────────────── Even (0,0,0) ──────────────────────── ENERGY +
                                         │
                        Withdrawn        │       Frayed
                        (−2,−3,−2)       │      (+2,−2,−2)
                    Muted                │          Restless
                   (−4,−2,−2)           │         (+3,−2,−1)
               Heavy                    │              Wired
              (−5,−4,−1)               │             (+4,−3,+1)
          Hollow                        │                  Edged
         (−3,−5,−3)                    │                 (+5,−4,+2)
                                         ▼
                                    VALENCE −

  Clarity: +3 (sharp/defined) ───────────────── −3 (murky/dissolved)
  Format: (Energy, Valence, Clarity)
```

---

## Reference table

| Mood | Energy | Valence | Clarity | Zone | Tagline |
|------|--------|---------|---------|------|---------|
| **Radiant** | +5 | +5 | +2 | Golden Hour | Open, warm, spilling over a little. |
| **Bright** | +3 | +4 | +3 | Golden Hour | Something just clicked. You're on. |
| **Energised** | +4 | +3 | +3 | Golden Hour | Present in your body. Switched on. |
| **Alive** | +2 | +2 | +1 | Golden Hour | Light, buzzy, slightly restless in a good way. |
| **Peaceful** | −5 | +5 | +2 | Morning Mist | Nothing to prove. Quietly okay. |
| **Tender** | −3 | +4 | −1 | Morning Mist | Feeling a lot, and close to the surface. |
| **Calm** | −4 | +3 | +2 | Morning Mist | Calm without effort. Just here. |
| **Soft** | −2 | +2 | −1 | Morning Mist | Unhurried. Letting things land slowly. |
| **Even** | 0 | 0 | 0 | Dead Calm | In between. Not quite one thing or another. |
| **Edged** | +5 | −4 | +2 | Wildfire Dusk | Something's building. You feel it everywhere. |
| **Wired** | +4 | −3 | +1 | Wildfire Dusk | Can't quite land. Body ahead of your mind. |
| **Restless** | +3 | −2 | −1 | Wildfire Dusk | Too many tabs open. Edges coming loose. |
| **Frayed** | +2 | −2 | −2 | Wildfire Dusk | A lot building. Not sure where it's going. |
| **Muted** | −4 | −2 | −2 | Blue Hour | The volume is turned down on everything. |
| **Heavy** | −5 | −4 | −1 | Blue Hour | Everything takes more than usual right now. |
| **Hollow** | −3 | −5 | −3 | Blue Hour | Going through the motions. Something missing. |
| **Withdrawn** | −2 | −3 | −2 | Blue Hour | Hard to see far ahead. Unclear and a bit stuck. |

---

## Colour palettes

Each palette is a flat array `[primary, secondary, accent]`. Blended results mix these proportionally by inverse distance across all active neighbours.

| Mood | Primary | Secondary | Accent |
|------|---------|-----------|--------|
| Radiant | `#F5C842` | `#F0A840` | `#E87830` |
| Bright | `#F8C060` | `#E8A030` | `#D08020` |
| Energised | `#F0884A` | `#E06030` | `#C84018` |
| Alive | `#E8A048` | `#D07828` | `#B85810` |
| Peaceful | `#A8D8C8` | `#78B8A8` | `#488878` |
| Tender | `#C0C8E8` | `#A0A8C8` | `#8088A8` |
| Calm | `#90C8B8` | `#60A898` | `#308878` |
| Soft | `#B8C8D8` | `#98A8C8` | `#7888A8` |
| Even | `#9898A8` | `#787888` | `#585868` |
| Edged | `#C84838` | `#A82818` | `#880808` |
| Wired | `#C85828` | `#A84010` | `#883000` |
| Restless | `#A87858` | `#886040` | `#685030` |
| Frayed | `#988870` | `#786858` | `#584840` |
| Muted | `#283858` | `#182848` | `#081838` |
| Heavy | `#304060` | `#204050` | `#103040` |
| Hollow | `#404858` | `#303848` | `#202838` |
| Withdrawn | `#485870` | `#384860` | `#283850` |

---

## Why Clarity is asymmetric

Clarity scores are deliberately asymmetric across zones. Negative states trend toward low clarity because the Blue Hour is defined by fog and dissolution. The exceptions are intentional:

- **Tender** and **Soft** are Morning Mist (positive) but low clarity — warmth that hasn't been named yet
- **Hollow** is the lowest-clarity mood (−3) — its defining feature *is* blankness itself
- **Edged** and **Wired** are Wildfire Dusk (negative) but carry positive clarity — these states know exactly what they are
- **Frayed** is the only high-energy negative mood with strongly negative clarity — scatter without direction

---

## Pin placement rationale

Mild moods sit close to centre. Extreme moods like Hollow and Radiant require consistent strong signals across multiple questions.

**Clarity separates pairs that Energy/Valence cannot distinguish:**
- Heavy (−5,−4,−1) vs Hollow (−3,−5,−3) — Heavy is a solid named weight; Hollow is formless absence
- Restless (+3,−2,−1) vs Frayed (+2,−2,−2) — Restless has direction; Frayed is scatter
- Tender (−3,+4,−1) vs Calm (−4,+3,+2) — Tender is unnamed warmth; Calm is crystalline and present

---

*Plan.Net Studios · May 2026 · v5*
