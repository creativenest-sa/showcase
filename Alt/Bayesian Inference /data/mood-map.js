// 17 moods in (energy, valence, clarity) space.
// signature: characteristic answer combinations that identify this mood.
// Used by the tie-break engine when top candidates are within 0.75 distance.

export const MOOD_MAP = [
  {
    id: 'radiant', name: 'Radiant',
    coordinate: { energy: 5, valence: 5, clarity: 2 },
    zone: 'Golden Hour',
    tagline: 'Open, warm, spilling over a little.',
    palette: ['#F5C842', '#F0A840', '#E87830'],
    signature: {
      colour:    ['honey-gold'],
      sky:       ['golden-morning', 'open-blue'],
      pulse:     ['surging'],
      battery:   ['electric', 'bright'],
      timeofday: ['mid-morning', 'afternoon']
    }
  },
  {
    id: 'bright', name: 'Bright',
    coordinate: { energy: 3, valence: 4, clarity: 3 },
    zone: 'Golden Hour',
    tagline: "Something just clicked. You're on.",
    palette: ['#F8C060', '#E8A030', '#D08020'],
    signature: {
      colour:    ['honey-gold', 'morning-frost'],
      sky:       ['golden-morning', 'open-blue'],
      pulse:     ['surging', 'steady'],
      texture:   ['clean-linen', 'sunwarm-stone'],
      timeofday: ['mid-morning']
    }
  },
  {
    id: 'energised', name: 'Energised',
    coordinate: { energy: 4, valence: 3, clarity: 3 },
    zone: 'Golden Hour',
    tagline: 'Present in your body. Switched on.',
    palette: ['#F0884A', '#E06030', '#C84018'],
    signature: {
      colour:    ['honey-gold', 'ember-red'],
      sky:       ['golden-morning'],
      pulse:     ['surging', 'racing'],
      battery:   ['electric', 'bright'],
      timeofday: ['mid-morning', 'afternoon']
    }
  },
  {
    id: 'alive', name: 'Alive',
    coordinate: { energy: 2, valence: 2, clarity: 1 },
    zone: 'Golden Hour',
    tagline: 'Light, buzzy, slightly restless in a good way.',
    palette: ['#E8A048', '#D07828', '#B85810'],
    signature: {
      colour:    ['honey-gold', 'petal-blush'],
      pulse:     ['surging', 'restless'],
      battery:   ['bright', 'electric'],
      timeofday: ['afternoon', 'late-afternoon']
    }
  },
  {
    id: 'peaceful', name: 'Peaceful',
    coordinate: { energy: -5, valence: 5, clarity: 2 },
    zone: 'Morning Mist',
    tagline: 'Nothing to prove. Quietly okay.',
    palette: ['#A8D8C8', '#78B8A8', '#488878'],
    signature: {
      colour:    ['forest-floor', 'morning-frost', 'arctic-dusk'],
      sky:       ['open-blue', 'after-rain'],
      pulse:     ['steady', 'hushed'],
      texture:   ['clean-linen', 'sunwarm-stone'],
      sound:     ['forest-birds', 'ocean-tide'],
      battery:   ['balanced', 'floating'],
      timeofday: ['early-morning', 'late-afternoon']
    }
  },
  {
    id: 'tender', name: 'Tender',
    coordinate: { energy: -3, valence: 4, clarity: -1 },
    zone: 'Morning Mist',
    tagline: 'Feeling a lot, and close to the surface.',
    palette: ['#C0C8E8', '#A0A8C8', '#8088A8'],
    signature: {
      colour:    ['petal-blush', 'morning-frost'],
      sky:       ['silver-fog', 'amber-dusk'],
      pulse:     ['hushed', 'drifting'],
      texture:   ['soft-velvet'],
      sound:     ['ocean-tide', 'crackling-fire'],
      timeofday: ['dusk', 'late-afternoon']
    }
  },
  {
    id: 'calm', name: 'Calm',
    coordinate: { energy: -4, valence: 3, clarity: 2 },
    zone: 'Morning Mist',
    tagline: 'Calm without effort. Just here.',
    palette: ['#90C8B8', '#60A898', '#308878'],
    signature: {
      colour:    ['forest-floor', 'morning-frost'],
      sky:       ['open-blue', 'after-rain'],
      pulse:     ['steady', 'still'],
      texture:   ['clean-linen', 'cold-glass'],
      sound:     ['forest-birds', 'midnight-crickets'],
      battery:   ['balanced', 'floating'],
      timeofday: ['early-morning', 'late-afternoon']
    }
  },
  {
    id: 'soft', name: 'Soft',
    coordinate: { energy: -2, valence: 2, clarity: -1 },
    zone: 'Morning Mist',
    tagline: 'Unhurried. Letting things land slowly.',
    palette: ['#B8C8D8', '#98A8C8', '#7888A8'],
    signature: {
      colour:    ['petal-blush', 'arctic-dusk'],
      sky:       ['silver-fog', 'amber-dusk'],
      pulse:     ['hushed', 'drifting'],
      texture:   ['soft-velvet', 'clean-linen'],
      timeofday: ['dusk', 'late-afternoon', 'early-morning']
    }
  },
  {
    id: 'even', name: 'Even',
    coordinate: { energy: 0, valence: 0, clarity: 0 },
    zone: 'Dead Calm',
    tagline: 'In between. Not quite one thing or another.',
    palette: ['#9898A8', '#787888', '#585868'],
    signature: {
      pulse:     ['drifting', 'still'],
      battery:   ['balanced', 'floating'],
      timeofday: ['afternoon']
    }
  },
  {
    id: 'edged', name: 'Edged',
    coordinate: { energy: 5, valence: -4, clarity: 2 },
    zone: 'Wildfire Dusk',
    tagline: "Something's building. You feel it everywhere.",
    palette: ['#C84838', '#A82818', '#880808'],
    signature: {
      colour:    ['ember-red', 'storm-grey'],
      sky:       ['distant-storm'],
      pulse:     ['racing', 'restless'],
      texture:   ['rough-sand'],
      battery:   ['electric', 'saturated'],
      timeofday: ['night', 'predawn']
    }
  },
  {
    id: 'wired', name: 'Wired',
    coordinate: { energy: 4, valence: -3, clarity: 1 },
    zone: 'Wildfire Dusk',
    tagline: "Can't quite land. Body ahead of your mind.",
    palette: ['#C85828', '#A84010', '#883000'],
    signature: {
      colour:    ['ember-red', 'storm-grey'],
      sky:       ['distant-storm', 'windswept'],
      pulse:     ['racing', 'restless'],
      battery:   ['electric', 'saturated'],
      timeofday: ['night', 'deep-night']
    }
  },
  {
    id: 'restless', name: 'Restless',
    coordinate: { energy: 3, valence: -2, clarity: -1 },
    zone: 'Wildfire Dusk',
    tagline: 'Too many tabs open. Edges coming loose.',
    palette: ['#A87858', '#886040', '#685030'],
    signature: {
      colour:    ['storm-grey', 'ember-red'],
      sky:       ['windswept', 'distant-storm'],
      pulse:     ['restless', 'racing'],
      sound:     ['wind-through-trees', 'distant-thunder'],
      timeofday: ['night', 'late-afternoon']
    }
  },
  {
    id: 'frayed', name: 'Frayed',
    coordinate: { energy: 2, valence: -2, clarity: -2 },
    zone: 'Wildfire Dusk',
    tagline: "A lot building. Not sure where it's going.",
    palette: ['#988870', '#786858', '#584840'],
    signature: {
      colour:    ['storm-grey', 'midnight-plum'],
      sky:       ['windswept', 'silver-fog'],
      pulse:     ['restless', 'flickering'],
      battery:   ['fragile', 'saturated'],
      timeofday: ['night', 'predawn']
    }
  },
  {
    id: 'muted', name: 'Muted',
    coordinate: { energy: -4, valence: -2, clarity: -2 },
    zone: 'Blue Hour',
    tagline: 'The volume is turned down on everything.',
    palette: ['#283858', '#182848', '#081838'],
    signature: {
      colour:    ['midnight-plum', 'storm-grey'],
      sky:       ['overcast', 'silver-fog', 'midnight-air'],
      pulse:     ['still', 'flickering'],
      sound:     ['silence', 'distant-thunder'],
      battery:   ['depleted', 'dim'],
      timeofday: ['night', 'predawn', 'deep-night']
    }
  },
  {
    id: 'heavy', name: 'Heavy',
    coordinate: { energy: -5, valence: -4, clarity: -1 },
    zone: 'Blue Hour',
    tagline: 'Everything takes more than usual right now.',
    palette: ['#304060', '#204050', '#103040'],
    signature: {
      colour:    ['midnight-plum', 'storm-grey'],
      sky:       ['midnight-air', 'silver-fog'],
      pulse:     ['still', 'drifting'],
      texture:   ['heavy-wool', 'wet-bark', 'cracked-earth'],
      battery:   ['depleted', 'dim', 'fragile'],
      timeofday: ['deep-night', 'predawn', 'night']
    }
  },
  {
    id: 'hollow', name: 'Hollow',
    coordinate: { energy: -3, valence: -5, clarity: -3 },
    zone: 'Blue Hour',
    tagline: 'Going through the motions. Something missing.',
    palette: ['#404858', '#303848', '#202838'],
    signature: {
      colour:    ['midnight-plum', 'arctic-dusk'],
      sky:       ['midnight-air', 'silver-fog'],
      pulse:     ['flickering', 'still'],
      sound:     ['silence'],
      battery:   ['depleted', 'dim'],
      timeofday: ['deep-night', 'predawn']
    }
  },
  {
    id: 'withdrawn', name: 'Withdrawn',
    coordinate: { energy: -2, valence: -3, clarity: -2 },
    zone: 'Blue Hour',
    tagline: 'Hard to see far ahead. Unclear and a bit stuck.',
    palette: ['#485870', '#384860', '#283850'],
    signature: {
      colour:    ['midnight-plum', 'storm-grey'],
      sky:       ['silver-fog', 'midnight-air'],
      pulse:     ['drifting', 'flickering'],
      texture:   ['heavy-wool', 'cracked-earth'],
      battery:   ['fragile', 'floating'],
      timeofday: ['night', 'predawn', 'deep-night']
    }
  },

  // ── Stillwater — low energy · near-zero valence · very negative clarity ──────
  // The absence of feeling. Not heavy (which still has weight), not hollow
  // (which has loss). Just flat. The flatness that comes after something big.
  {
    id: 'numb', name: 'Numb',
    coordinate: { energy: -2, valence: 0, clarity: -4 },
    zone: 'Stillwater',
    tagline: 'Flat. Not sad, not fine. Just switched off.',
    palette: ['#606068', '#484850', '#303038'],
    signature: {
      colour:    ['storm-grey', 'midnight-plum'],
      sky:       ['silver-fog', 'midnight-air'],
      pulse:     ['still', 'drifting'],
      sound:     ['silence'],
      battery:   ['depleted', 'dim', 'floating'],
      timeofday: ['predawn', 'deep-night', 'afternoon']
    }
  },

  // ── Nostalgic — low energy · strongly positive valence · negative clarity ────
  // Warmth that belongs to the past. Not sad exactly — more like standing in
  // the light of something that isn't here anymore.
  {
    id: 'nostalgic', name: 'Nostalgic',
    coordinate: { energy: -3, valence: 4, clarity: -3 },
    zone: 'Amber Hours',
    tagline: "Warm for something that isn't here anymore.",
    palette: ['#C89858', '#A87840', '#886030'],
    signature: {
      colour:    ['honey-gold', 'petal-blush', 'forest-floor'],
      sky:       ['amber-dusk', 'golden-morning'],
      pulse:     ['hushed', 'drifting'],
      texture:   ['soft-velvet', 'sunwarm-stone'],
      sound:     ['crackling-fire', 'ocean-tide', 'late-night-piano'],
      battery:   ['floating', 'fragile'],
      timeofday: ['dusk', 'late-afternoon']
    }
  },

  // ── Grateful — near-zero energy · strongly positive valence · clear ──────────
  // Stillness that is actually fullness. Not excitement — more like a quiet
  // awareness that something good is happening or has happened.
  {
    id: 'grateful', name: 'Grateful',
    coordinate: { energy: 0, valence: 5, clarity: 2 },
    zone: 'Amber Hours',
    tagline: 'Quietly full. Something landed right.',
    palette: ['#D4A870', '#B88850', '#9C6C38'],
    signature: {
      colour:    ['honey-gold', 'forest-floor', 'morning-frost'],
      sky:       ['golden-morning', 'after-rain', 'amber-dusk'],
      pulse:     ['steady', 'hushed'],
      texture:   ['sunwarm-stone', 'clean-linen'],
      sound:     ['crackling-fire', 'forest-birds', 'midnight-crickets'],
      battery:   ['balanced', 'bright'],
      timeofday: ['late-afternoon', 'early-morning', 'dusk']
    }
  },

  // ── Determined — high energy · mildly positive · very high clarity ───────────
  // Focused forward motion. Not the buzz of Energised — sharper than that.
  // You know what you're doing and you're doing it.
  {
    id: 'determined', name: 'Determined',
    coordinate: { energy: 3, valence: 1, clarity: 5 },
    zone: 'Golden Hour',
    tagline: 'Clear about what needs doing. Moving.',
    palette: ['#E07820', '#C05808', '#A04000'],
    signature: {
      colour:    ['honey-gold', 'morning-frost', 'ember-red'],
      sky:       ['open-blue', 'golden-morning'],
      pulse:     ['steady', 'surging'],
      texture:   ['rough-sand', 'cold-glass', 'sunwarm-stone'],
      sound:     ['late-night-piano', 'forest-birds'],
      battery:   ['bright', 'electric', 'balanced'],
      timeofday: ['mid-morning', 'afternoon', 'early-morning']
    }
  },

  // ── Anxious — high energy · strongly negative valence · negative clarity ──────
  // Activation without direction. High alert, unclear threat. Not the anger
  // of Edged — more like a static that won't resolve.
  {
    id: 'anxious', name: 'Anxious',
    coordinate: { energy: 4, valence: -4, clarity: -3 },
    zone: 'Wildfire Dusk',
    tagline: "Something feels wrong. Can't name it.",
    palette: ['#906050', '#705040', '#503830'],
    signature: {
      colour:    ['ember-red', 'storm-grey', 'midnight-plum'],
      sky:       ['windswept', 'distant-storm', 'silver-fog'],
      pulse:     ['racing', 'flickering', 'restless'],
      texture:   ['rough-sand', 'cracked-earth'],
      sound:     ['distant-thunder', 'wind-through-trees', 'silence'],
      battery:   ['fragile', 'saturated', 'depleted'],
      timeofday: ['predawn', 'deep-night', 'night']
    }
  },
];
