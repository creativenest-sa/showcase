# Onboarding — Sensory-Led Visual Questions v5

All 7 questions. 8 options each. Complete scoring across three axes.

---

## Design principles

The onboarding is not a form — it is an atmospheric experience that also happens to collect data. Each question should:

- **Feel atmospheric** — evoke, don't describe
- **Connect through the body** — colour, sky, pulse, touch, sound, energy, time
- **Avoid clinical language** — no mood labels, no therapy-speak, no weather-app words
- **Show the thing, not name it** — Q1 and Q2 use visual cards, not text pills

The canvas background responds to every answer in real time. The algorithm is already running.

---

## Question 01 — Colour

**Question:** Pick a colour that feels like you right now.

**UI:** Large circular swatches with label below. Tap to select.

| Option | Hex | Energy | Valence | Clarity | Character |
|--------|-----|--------|---------|---------|-----------|
| Honey Gold | `#D4A017` | +1 | +1 | +1 | Warm, optimistic, generous |
| Ember Red | `#C8402A` | +1 | −1 | −1 | Intense, passionate, overwhelmed |
| Petal Blush | `#F0A8B0` | −1 | +1 | −1 | Soft, hopeful, emotionally tender |
| Morning Frost | `#C8DCE8` | −1 | +1 | +1 | Calm, serene, clear-headed |
| Storm Grey | `#4A5568` | +1 | −1 | −1 | Unsettled, distant, pressured |
| Forest Floor | `#3B5E3A` | −1 | +1 | 0 | Grounded, patient, earthy |
| Midnight Plum | `#5B2D6E` | −1 | −1 | −1 | Heavy, inward, contemplative |
| Arctic Dusk | `#2E4A7A` | −1 | +1 | +1 | Still, reflective, spacious |

**Moodboard direction:** Abstract colour washes — flowing silk, liquid colour, atmospheric blur. No objects. Pure feeling-colour.

---

## Question 02 — Sky

**Question:** Which sky are you under right now?

**UI:** Painted image cards (procedurally rendered). Tap to select.

| Option | Energy | Valence | Clarity | Character |
|--------|--------|---------|---------|-----------|
| Golden Morning | +1 | +1 | +1 | Warm, hopeful, clear-lit — the day just opened |
| Silver Fog | −1 | 0 | −1 | Soft, muffled, present but not sharp |
| Open Blue | 0 | +1 | +2 | Clean, spacious, unclouded — nothing pressing |
| Distant Storm | +1 | −1 | −1 | Tension at the edges, not here yet |
| Amber Dusk | −1 | +1 | 0 | Nostalgic, winding down, bittersweet warmth |
| Midnight Air | −1 | −1 | 0 | Still, private, interior |
| After Rain | −1 | +1 | +1 | Cleared, slightly raw, fresh — something passed |
| Windswept | +1 | −1 | −2 | Movement, scattered, hard to land |

**Design notes:** These are inner skies, not weather forecasts. Avoid weather-app language — "Golden Morning" not "Sunny", "Midnight Air" not "Clear Night". The board explicitly calls this out.

**Weight: ×1.5** — atmospheric anchor, used as tie-breaker.

---

## Question 03 — Pulse

**Question:** What is your pulse today?

**Inner framing:** What rhythm are you moving at today?

**UI:** Text pill options.

| Option | Energy | Valence | Clarity | Character |
|--------|--------|---------|---------|-----------|
| Still | −1 | −1 | −1 | Nothing moving. Total quiet inside |
| Hushed | −1 | +1 | 0 | Very slow, barely there — a resting state |
| Steady | −1 | +1 | +1 | Reliable rhythm, nothing urgent |
| Drifting | −1 | 0 | −1 | Slow but untethered — no fixed beat |
| Flickering | −1 | −1 | −2 | Unsteady, coming and going |
| Restless | +1 | −1 | −1 | Faster than comfortable, can't settle |
| Surging | +1 | +1 | +1 | Strong push, building, directional |
| Racing | +1 | −1 | 0 | Too fast, ahead of thought |

**Design notes:** Avoid clinical/medical language. Think: tempo, movement, nervous system energy, emotional pace.

**Weight: ×1.4** — most direct body energy signal alongside Battery.

**Canvas FX:** Particle field where density and speed are driven by the intensity value from the partial compute. Click anywhere to spawn a ripple.

---

## Question 04 — Texture

**Question:** What would today feel like, under your hand?

**Inner framing:** What would today feel like to touch?

| Option | Energy | Valence | Clarity | Character |
|--------|--------|---------|---------|-----------|
| Heavy Wool | −1 | −1 | −1 | Weight, friction, something pressing |
| Rough Sand | +1 | −1 | +1 | Gritty, specific, slightly uncomfortable |
| Clean Linen | −1 | +1 | +2 | Airy, light, freshly ordered |
| Sun-warm Stone | +1 | +1 | +1 | Solid, held, radiating quiet heat |
| Cold Glass | −1 | −1 | +1 | Smooth, clear, slightly detached |
| Wet Bark | −1 | −1 | −1 | Dark, organic, raw after rain |
| Soft Velvet | −1 | +1 | −1 | Delicate, close, a little exposed |
| Cracked Earth | −1 | −1 | −2 | Dry, split, depleted |

**Design notes:** Clean Linen and Sun-warm Stone are the strongest positive-clarity textures in the set. Cracked Earth is the most depleted, lowest-clarity option. Each card could carry animated material behaviour in a future iteration (grain, reflections, subtle movement).

**Canvas FX:** Sine-wave lines across the screen. Amplitude is driven by clarity — low clarity = wild waves, high clarity = fine controlled lines.

---

## Question 05 — Sound

**Question:** Pick the closest sound.

**Inner framing:** What does your inner world sound like right now?

| Option | Energy | Valence | Clarity | Character |
|--------|--------|---------|---------|-----------|
| Late-night piano | +1 | +1 | +1 | Intimate, introspective, warm |
| Forest birds | −1 | +1 | +1 | Layered, organic, gently alive |
| Ocean tide | −1 | +1 | −1 | Rhythmic, vast, slightly melancholic |
| Midnight crickets | −1 | +1 | 0 | Still night, quietly alive |
| Distant thunder | +1 | −1 | −1 | Something heavy approaching |
| Silence | −1 | 0 | −2 | Absence — could be peace, could be emptiness |
| Crackling fire | −1 | +1 | +1 | Warmth, containment, primal comfort |
| Wind through trees | +1 | 0 | −1 | Movement, breath, slightly untamed |

**Design notes:** Sound is probably the most emotionally immediate sense after touch. Silence is the strongest negative-clarity option — its defining feature is that it could mean anything.

**Canvas FX:** Each option has a distinct visual. Forest Birds = V-shaped bird silhouettes drifting. Crackling Fire = rising amber ember particles. Silence = one very slow expanding ring per 5 seconds. Midnight Crickets = blinking point lights. Wind Through Trees = flowing bezier lines.

---

## Question 06 — Battery

**Question:** How full are you? Battery.

**Inner framing:** How full does your energy feel right now?

| Option | Energy | Valence | Clarity | Character |
|--------|--------|---------|---------|-----------|
| Depleted | −1 | −1 | −1 | Nothing left. Running on fumes |
| Dim | −1 | −1 | −1 | Barely flickering. Dull and low |
| Fragile | −1 | −1 | −1 | Some charge but easily lost |
| Floating | −1 | 0 | −1 | Untethered, light, slightly disconnected |
| Balanced | 0 | +1 | +1 | Enough. Neither over nor under |
| Bright | +1 | +1 | +1 | Good charge. Clear and present |
| Electric | +1 | +1 | +2 | High energy, buzzing — strongest positive clarity in set |
| Saturated | +1 | −1 | −2 | Overwhelmed with input. Full to overflowing |

**Design notes:** Electric (+2 clarity) and Saturated (−2 clarity) are the sharpest contrasts in this question. Electric is the clearest possible self-reading. Saturated is the most dissolved high-energy state. Depleted, Dim, and Fragile are all identical in votes — they're distinguished by the user's sense of which word fits best.

**Canvas FX:** Vertical fill column. Level tracks the energy estimate from partial compute. Particles float upward through the fill. High-energy options add a glow spark at the top.

**Weight: ×1.4** — most direct capacity and clarity signal alongside Pulse.

---

## Question 07 — Time of Day

**Question:** What time of day does it feel like inside?

**Inner framing:** Not the clock. The light you feel.

| Option | Energy | Valence | Clarity | Character |
|--------|--------|---------|---------|-----------|
| Early morning | −1 | +1 | +1 | Fresh, unhurried, hopeful |
| Mid-morning | +1 | +1 | +2 | Sharpest clarity in the set — focused, present |
| Afternoon | +1 | 0 | +1 | Functional, moving, present |
| Late afternoon | −1 | +1 | 0 | Winding, warm, reflective |
| Dusk | −1 | +1 | −1 | Liminal, bittersweet, transitional |
| Night | −1 | −1 | −1 | Interior, contracting, private |
| Deep night | −1 | −1 | −2 | Dissolving, lowest-clarity negative option |
| Predawn | 0 | −1 | −2 | Suspended, between states, formless |

**Design notes:** This is internal time, not clock time. Someone awake at 2pm feeling like predawn is giving completely different information than their location on the calendar. Mid-morning is the most positively defined state — you know where you are and what you're doing. Predawn and Deep night are the two strongest negative-clarity votes in the entire system.

**Canvas FX:** Sky gradient that shifts per option. Night options include drifting star particles. Horizon glow moves with mouse position.

**Weight: ×1.2** — strong temporal clarity signal.

---

## Scoring summary

| Question | Weight | Max E contribution | Max V contribution | Max C contribution |
|----------|--------|-------------------|-------------------|-------------------|
| colour | ×1.0 | ±1.0 | ±1.0 | ±1.0 |
| sky | ×1.5 | ±1.5 | ±1.5 | ±3.0 |
| pulse | ×1.4 | ±1.4 | ±1.4 | ±2.8 |
| texture | ×1.0 | ±1.0 | ±1.0 | ±2.0 |
| sound | ×1.0 | ±1.0 | ±1.0 | ±2.0 |
| battery | ×1.4 | ±1.4 | ±1.4 | ±2.8 |
| timeofday | ×1.2 | ±1.2 | ±1.2 | ±2.4 |

Plus recency multiplier applied per answer position: `[0.82, 0.88, 0.94, 1.00, 1.06, 1.14, 1.20]`.

---

*Plan.Net Studios · May 2026 · v5*
