// Votes on three axes per answer option.
//   energy:  −1 (drained/still)   0 (neutral)  +1 (activated/wired)
//   valence: −1 (dark/heavy)      0 (neutral)  +1 (open/warm)
//   clarity: −2 (murky/diffuse)..+2 (sharp/defined)

export const ANSWER_MAP = {
  colour: {
    'honey-gold':    { energy: +1, valence: +1, clarity: +1 },
    'ember-red':     { energy: +1, valence: -1, clarity: -1 },
    'petal-blush':   { energy: -1, valence: +1, clarity: -1 },
    'morning-frost': { energy: -1, valence: +1, clarity: +1 },
    'storm-grey':    { energy: +1, valence: -1, clarity: -1 },
    'forest-floor':  { energy: -1, valence: +1, clarity:  0 },
    'midnight-plum': { energy: -1, valence: -1, clarity: -1 },
    'arctic-dusk':   { energy: -1, valence: +1, clarity: +1 }
  },
  sky: {
    'golden-morning': { energy: +1, valence: +1, clarity: +1 },
    'silver-fog':     { energy: -1, valence:  0, clarity: -1 },
    'open-blue':      { energy:  0, valence: +1, clarity: +2 },
    'distant-storm':  { energy: +1, valence: -1, clarity: -1 },
    'amber-dusk':     { energy: -1, valence: +1, clarity:  0 },
    'midnight-air':   { energy: -1, valence: -1, clarity:  0 },
    'after-rain':     { energy: -1, valence: +1, clarity: +1 },
    'windswept':      { energy: +1, valence: -1, clarity: -2 }
  },
  pulse: {
    'still':      { energy: -1, valence: -1, clarity: -1 },
    'hushed':     { energy: -1, valence: +1, clarity:  0 },
    'steady':     { energy: -1, valence: +1, clarity: +1 },
    'drifting':   { energy: -1, valence:  0, clarity: -1 },
    'flickering': { energy: -1, valence: -1, clarity: -2 },
    'restless':   { energy: +1, valence: -1, clarity: -1 },
    'surging':    { energy: +1, valence: +1, clarity: +1 },
    'racing':     { energy: +1, valence: -1, clarity:  0 }
  },
  texture: {
    'heavy-wool':    { energy: -1, valence: -1, clarity: -1 },
    'rough-sand':    { energy: +1, valence: -1, clarity: +1 },
    'clean-linen':   { energy: -1, valence: +1, clarity: +2 },
    'sunwarm-stone': { energy: +1, valence: +1, clarity: +1 },
    'cold-glass':    { energy: -1, valence: -1, clarity: +1 },
    'wet-bark':      { energy: -1, valence: -1, clarity: -1 },
    'soft-velvet':   { energy: -1, valence: +1, clarity: -1 },
    'cracked-earth': { energy: -1, valence: -1, clarity: -2 }
  },
  sound: {
    'late-night-piano':   { energy: +1, valence: +1, clarity: +1 },
    'forest-birds':       { energy: -1, valence: +1, clarity: +1 },
    'ocean-tide':         { energy: -1, valence: +1, clarity: -1 },
    'midnight-crickets':  { energy: -1, valence: +1, clarity:  0 },
    'distant-thunder':    { energy: +1, valence: -1, clarity: -1 },
    'silence':            { energy: -1, valence:  0, clarity: -2 },
    'crackling-fire':     { energy: -1, valence: +1, clarity: +1 },
    'wind-through-trees': { energy: +1, valence:  0, clarity: -1 }
  },
  battery: {
    'depleted':  { energy: -1, valence: -1, clarity: -1 },
    'dim':       { energy: -1, valence: -1, clarity: -1 },
    'fragile':   { energy: -1, valence: -1, clarity: -1 },
    'floating':  { energy: -1, valence:  0, clarity: -1 },
    'balanced':  { energy:  0, valence: +1, clarity: +1 },
    'bright':    { energy: +1, valence: +1, clarity: +1 },
    'electric':  { energy: +1, valence: +1, clarity: +2 },
    'saturated': { energy: +1, valence: -1, clarity: -2 }
  },

  // ── Q7 Time of day ──────────────────────────────────────────────────────────
  // Strong temporal-clarity signal. Deep night / predawn = low clarity, low energy.
  // Late morning / afternoon = higher clarity. Internal time often diverges from clock.
  timeofday: {
    'early-morning': { energy: -1, valence: +1, clarity: +1 },  // fresh, unhurried, hopeful
    'mid-morning':   { energy: +1, valence: +1, clarity: +2 },  // sharpest clarity of day
    'afternoon':     { energy: +1, valence:  0, clarity: +1 },  // functional, present
    'late-afternoon':{ energy: -1, valence: +1, clarity:  0 },  // winding, warm, reflective
    'dusk':          { energy: -1, valence: +1, clarity: -1 },  // liminal, bittersweet
    'night':         { energy: -1, valence: -1, clarity: -1 },  // interior, contracting
    'deep-night':    { energy: -1, valence: -1, clarity: -2 },  // dissolving, lowest clarity
    'predawn':       { energy:  0, valence: -1, clarity: -2 }   // suspended, between states
  }
};
