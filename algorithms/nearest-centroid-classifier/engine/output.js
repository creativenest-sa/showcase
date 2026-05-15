// The only file that knows the shape of the result object.
// v2: threshold neighbours, similarity scores, confidence, blend language.

// Max possible weighted magnitude (7 questions, max recency 1.20, max qweight 1.5, max vote 2)
// Energy/Valence per-axis max ≈ 7 × 1.5 × 1.20 × 1 = 12.6
// Clarity per-axis max ≈ 7 × 1.5 × 1.20 × 2 = 25.2
const MAX_E = 12.6;
const MAX_C = 25.2;
const MAX_MAGNITUDE = Math.sqrt(MAX_E ** 2 + MAX_E ** 2 + MAX_C ** 2);

function blendHex(hexValues, weights) {
  let r = 0, g = 0, b = 0;
  hexValues.forEach((hex, i) => {
    const n = parseInt(hex.slice(1), 16);
    r += ((n >> 16) & 0xff) * weights[i];
    g += ((n >>  8) & 0xff) * weights[i];
    b += ( n        & 0xff) * weights[i];
  });
  return '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function blendPalettes(neighbors) {
  const weights = neighbors.map(n => n.weight);
  return {
    primary:   blendHex(neighbors.map(n => n.mood.palette[0]), weights),
    secondary: blendHex(neighbors.map(n => n.mood.palette[1]), weights),
    accent:    blendHex(neighbors.map(n => n.mood.palette[2]), weights)
  };
}

function computeMotion(userCoord) {
  const { energy, valence, clarity } = userCoord;
  const magnitude = Math.sqrt(energy ** 2 + valence ** 2 + clarity ** 2);
  return {
    angle:       Math.round(Math.atan2(valence, energy) * 180 / Math.PI),
    intensity:   parseFloat(Math.min(1, magnitude / MAX_MAGNITUDE).toFixed(3)),
    clarityNorm: parseFloat(Math.min(1, Math.max(0, (clarity + MAX_C) / (2 * MAX_C))).toFixed(3))
  };
}

// Confidence: how dominant the primary mood is vs neighbours.
// 1.0 = landed exactly on a pin. 0.0 = perfectly equidistant from all.
function computeConfidence(neighbors) {
  if (!neighbors.length) return 0;
  if (neighbors[0].distance === 0) return 1.0;
  if (neighbors.length === 1) return parseFloat(neighbors[0].similarity.toFixed(2));
  // Primary weight minus average of others = dominance
  const primaryWeight = neighbors[0].weight;
  const othersAvg = neighbors.slice(1).reduce((s, n) => s + n.weight, 0) / (neighbors.length - 1);
  return parseFloat(Math.max(0, Math.min(1, primaryWeight - othersAvg + 0.5)).toFixed(2));
}

// Blend language: compose a human-readable description of the neighbour blend.
// Only surfaces undertones above MIN_UNDERTONE_WEIGHT threshold.
const MIN_UNDERTONE_WEIGHT = 0.15;

function buildBlendLanguage(neighbors) {
  const primary = neighbors[0].mood.name;
  const undertones = neighbors
    .slice(1)
    .filter(n => n.weight >= MIN_UNDERTONE_WEIGHT)
    .map(n => n.mood.name);

  if (!undertones.length) return '';
  if (undertones.length === 1) return `${primary}, with traces of ${undertones[0]}`;
  return `${primary}, with traces of ${undertones[0]} and ${undertones[1]}`;
}

export function buildResult(neighbors, userCoord) {
  const primary = neighbors[0].mood;
  const blended = blendPalettes(neighbors);
  const motion  = computeMotion(userCoord);

  return {
    mood:    primary.name,
    tagline: primary.tagline,
    zone:    primary.zone,

    palette: {
      primary:   primary.palette[0],
      secondary: primary.palette[1],
      accent:    primary.palette[2]
    },

    blendedPalette: blended,
    blendLanguage:  buildBlendLanguage(neighbors),
    confidence:     computeConfidence(neighbors),

    // #6: full neighbour set with similarity scores
    neighbors: neighbors.map(n => ({
      mood:       n.mood.name,
      zone:       n.mood.zone,
      distance:   Math.round(n.distance * 100) / 100,
      weight:     Math.round(n.weight   * 100) / 100,
      similarity: n.similarity ?? 0
    })),

    motion,

    debug: {
      userCoordinate: {
        energy:  Math.round(userCoord.energy  * 10) / 10,
        valence: Math.round(userCoord.valence * 10) / 10,
        clarity: Math.round(userCoord.clarity * 10) / 10
      },
      moodCoordinate:  primary.coordinate,
      primaryDistance: Math.round(neighbors[0].distance * 100) / 100,
      neighbourCount:  neighbors.length
    }
  };
}
