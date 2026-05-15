export const QUESTIONS = [
  {
    id: 'colour',
    label: 'Pick a colour that feels like you right now.',
    sublabel: 'Which colour comes closest to your mood right now?',
    options: [
      { id: 'honey-gold',    label: 'Honey Gold'    },
      { id: 'ember-red',     label: 'Ember Red'     },
      { id: 'petal-blush',   label: 'Petal Blush'   },
      { id: 'morning-frost', label: 'Morning Frost' },
      { id: 'storm-grey',    label: 'Storm Grey'    },
      { id: 'forest-floor',  label: 'Forest Floor'  },
      { id: 'midnight-plum', label: 'Midnight Plum' },
      { id: 'arctic-dusk',   label: 'Arctic Dusk'   }
    ]
  },
  {
    id: 'sky',
    label: 'Which sky are you under right now?',
    sublabel: 'What does your inner sky look like today?',
    options: [
      { id: 'golden-morning', label: 'Golden Morning' },
      { id: 'silver-fog',     label: 'Silver Fog'     },
      { id: 'open-blue',      label: 'Open Blue'      },
      { id: 'distant-storm',  label: 'Distant Storm'  },
      { id: 'amber-dusk',     label: 'Amber Dusk'     },
      { id: 'midnight-air',   label: 'Midnight Air'   },
      { id: 'after-rain',     label: 'After Rain'     },
      { id: 'windswept',      label: 'Windswept'      }
    ]
  },
  {
    id: 'pulse',
    label: 'What is your pulse today?',
    sublabel: 'What rhythm are you moving at today?',
    options: [
      { id: 'still',      label: 'Still'      },
      { id: 'hushed',     label: 'Hushed'     },
      { id: 'steady',     label: 'Steady'     },
      { id: 'drifting',   label: 'Drifting'   },
      { id: 'flickering', label: 'Flickering' },
      { id: 'restless',   label: 'Restless'   },
      { id: 'surging',    label: 'Surging'    },
      { id: 'racing',     label: 'Racing'     }
    ]
  },
  {
    id: 'texture',
    label: 'What would today feel like, under your hand?',
    sublabel: 'What would today feel like to touch?',
    options: [
      { id: 'heavy-wool',    label: 'Heavy Wool'    },
      { id: 'rough-sand',    label: 'Rough Sand'    },
      { id: 'clean-linen',   label: 'Clean Linen'   },
      { id: 'sunwarm-stone', label: 'Sun-warm Stone' },
      { id: 'cold-glass',    label: 'Cold Glass'    },
      { id: 'wet-bark',      label: 'Wet Bark'      },
      { id: 'soft-velvet',   label: 'Soft Velvet'   },
      { id: 'cracked-earth', label: 'Cracked Earth' }
    ]
  },
  {
    id: 'sound',
    label: 'Pick the closest sound.',
    sublabel: 'What does your inner world sound like right now?',
    options: [
      { id: 'late-night-piano',   label: 'Late-night piano'   },
      { id: 'forest-birds',       label: 'Forest birds'       },
      { id: 'ocean-tide',         label: 'Ocean tide'         },
      { id: 'midnight-crickets',  label: 'Midnight crickets'  },
      { id: 'distant-thunder',    label: 'Distant thunder'    },
      { id: 'silence',            label: 'Silence'            },
      { id: 'crackling-fire',     label: 'Crackling fire'     },
      { id: 'wind-through-trees', label: 'Wind through trees' }
    ]
  },
  {
    id: 'battery',
    label: 'How full are you? Battery.',
    sublabel: 'How full does your energy feel right now?',
    options: [
      { id: 'depleted',  label: 'Depleted'  },
      { id: 'dim',       label: 'Dim'       },
      { id: 'fragile',   label: 'Fragile'   },
      { id: 'floating',  label: 'Floating'  },
      { id: 'balanced',  label: 'Balanced'  },
      { id: 'bright',    label: 'Bright'    },
      { id: 'electric',  label: 'Electric'  },
      { id: 'saturated', label: 'Saturated' }
    ]
  },

  // ── Q7 — Time of day ────────────────────────────────────────────────────────
  // Not clock time — internal time. The light it feels like inside.
  {
    id: 'timeofday',
    label: 'What time of day does it feel like inside?',
    sublabel: 'Not the clock. The light you feel.',
    options: [
      { id: 'early-morning',  label: 'Early morning'  },
      { id: 'mid-morning',    label: 'Mid-morning'    },
      { id: 'afternoon',      label: 'Afternoon'      },
      { id: 'late-afternoon', label: 'Late afternoon' },
      { id: 'dusk',           label: 'Dusk'           },
      { id: 'night',          label: 'Night'          },
      { id: 'deep-night',     label: 'Deep night'     },
      { id: 'predawn',        label: 'Predawn'        }
    ]
  }
];
