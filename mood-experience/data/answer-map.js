// (energy, valence) — each value is -1, 0, or +1
export const ANSWER_MAP = {
  colour: {
    'honey-gold':    { energy: +1, valence: +1 },
    'storm-grey':    { energy: +1, valence: -1 },  // required
    'rose-blush':    { energy:  0, valence: +1 },
    'midnight-blue': { energy: -1, valence: -1 },
    'forest-green':  { energy: -1, valence: +1 },
    'ivory-white':   { energy:  0, valence: +1 },
    'burnt-sienna':  { energy: +1, valence:  0 },
    'lavender':      { energy: -1, valence: +1 },
  },
  sky: {
    'clear-blue':     { energy: +1, valence: +1 },
    'overcast':       { energy: -1, valence: -1 },  // required
    'sunrise':        { energy: +1, valence: +1 },
    'golden-hour':    { energy:  0, valence: +1 },
    'storm-clouds':   { energy: +1, valence: -1 },
    'twilight':       { energy: -1, valence:  0 },
    'starless-night': { energy: -1, valence: -1 },
  },
  pulse: {
    'still':           { energy: -1, valence:  0 },
    'slow-and-steady': { energy: -1, valence: +1 },  // required
    'ticking':         { energy:  0, valence:  0 },
    'quickened':       { energy: +1, valence: +1 },
    'racing':          { energy: +1, valence:  0 },  // energy without committed tone — required
  },
  texture: {
    'silk':       { energy:  0, valence: +1 },
    'cotton':     { energy:  0, valence: +1 },
    'heavy-wool': { energy: -1, valence: -1 },  // required
    'sandpaper':  { energy: +1, valence: -1 },
    'cool-stone': { energy: -1, valence:  0 },
    'warm-wood':  { energy:  0, valence: +1 },
  },
  sound: {
    'birdsong':       { energy:  0, valence: +1 },
    'quiet-crickets': { energy: -1, valence: +1 },  // required
    'white-noise':    { energy:  0, valence:  0 },
    'static':         { energy: +1, valence: -1 },
    'heartbeat':      { energy:  0, valence: -1 },
    'laughter':       { energy: +1, valence: +1 },
  },
  battery: {
    'full':      { energy: +1, valence: +1 },
    'charging':  { energy: +1, valence: +1 },
    'holding':   { energy:  0, valence: +1 },
    'half':      { energy:  0, valence:  0 },
    'flickering': { energy: -1, valence: -1 },  // required
    'drained':   { energy: -1, valence: -1 },
  },
};
