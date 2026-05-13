import { ANSWER_MAP }                          from './data/answer-map.js';
import { MOOD_MAP }                            from './data/mood-map.js';
import { QUESTIONS }                           from './data/questions.js';
import {
  QUESTION_WEIGHTS,
  weightedSum,
  zeroPadAnswers,
  findNearestNeighbors,
  rankQuestionsByInfoGain
} from './engine/distance.js';
import { buildResult }                         from './engine/output.js';

export { QUESTIONS, MOOD_MAP, QUESTION_WEIGHTS };

// ── Adaptive question ordering ────────────────────────────────────────────────
// First two questions are always fixed (colour → sky) — they anchor the
// emotional vocabulary. Remaining 5 are reordered by information gain after
// each answer. Colour and sky are always asked first regardless of info gain,
// because the image-based UI for them needs to appear at the start.
const FIXED_FIRST = ['colour', 'sky'];

export function getAdaptiveOrder(answers, currentCoord) {
  const answeredIds = Object.keys(answers);

  // If we haven't finished the fixed questions yet, return them first
  const nextFixed = FIXED_FIRST.find(id => !answeredIds.includes(id));
  if (nextFixed) {
    const remaining = QUESTIONS.filter(q => !answeredIds.includes(q.id));
    return remaining; // colour first, then sky, then the rest
  }

  // All fixed answered — rank remaining by info gain
  const ranked = rankQuestionsByInfoGain(
    currentCoord,
    answeredIds,
    QUESTIONS,
    ANSWER_MAP,
    MOOD_MAP
  );
  return ranked;
}

// ── Partial compute (for live atmosphere during onboarding) ───────────────────
// improvement #5: zero-pads unanswered questions instead of using midpoint guesses.
// Returns null if nothing answered yet.
export function partialCompute(answers, answerOrder) {
  const n = Object.keys(answers).length;
  if (n === 0) return null;

  try {
    // Zero-pad so unanswered questions contribute {0,0,0}
    const padded = zeroPadAnswers(answers, QUESTIONS);
    const coord  = weightedSum(padded, ANSWER_MAP, QUESTION_WEIGHTS, answerOrder);
    const neighbors = findNearestNeighbors(coord, MOOD_MAP, answers);
    const wts = neighbors.map(nb => nb.weight);

    function blendHex(hexes, ws) {
      let r = 0, g = 0, b = 0;
      hexes.forEach((h, i) => {
        const n = parseInt(h.slice(1), 16);
        r += ((n >> 16) & 255) * ws[i];
        g += ((n >> 8)  & 255) * ws[i];
        b += (n         & 255) * ws[i];
      });
      return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
    }

    const pal = {
      primary:   blendHex(neighbors.map(nb => nb.mood.palette[0]), wts),
      secondary: blendHex(neighbors.map(nb => nb.mood.palette[1]), wts),
      accent:    blendHex(neighbors.map(nb => nb.mood.palette[2]), wts)
    };

    const MAX_E = 12.6, MAX_C = 25.2;
    const mag   = Math.sqrt(coord.energy ** 2 + coord.valence ** 2 + coord.clarity ** 2);
    const motion = {
      angle:       Math.round(Math.atan2(coord.valence, coord.energy) * 180 / Math.PI),
      intensity:   parseFloat(Math.min(1, mag / Math.sqrt(MAX_E ** 2 + MAX_E ** 2 + MAX_C ** 2)).toFixed(3)),
      clarityNorm: parseFloat(Math.min(1, Math.max(0, (coord.clarity + MAX_C) / (2 * MAX_C))).toFixed(3))
    };

    // Confidence scales with number of answered questions (partial is always provisional)
    const partialConfidence = n / QUESTIONS.length;

    return {
      pal,
      motion,
      zone:              neighbors[0].mood.zone,
      mood:              neighbors[0].mood.name,
      confidence:        partialConfidence,
      energyNorm:        Math.min(1, Math.max(0, (coord.energy + MAX_E) / (2 * MAX_E))),
      coord
    };
  } catch {
    return null;
  }
}

// ── Full compute ──────────────────────────────────────────────────────────────
export function compute(answers, answerOrder) {
  // Validate all 7 questions answered
  const requiredIds = QUESTIONS.map(q => q.id);
  const missing = requiredIds.filter(id => !(id in answers));
  if (missing.length > 0) {
    throw new Error(
      `Missing answers for: ${missing.join(', ')}. All seven questions must be answered.`
    );
  }

  // Weighted 3D sum with recency
  const userCoord = weightedSum(answers, ANSWER_MAP, QUESTION_WEIGHTS, answerOrder);

  // Threshold neighbours with signature tie-break
  const neighbors = findNearestNeighbors(userCoord, MOOD_MAP, answers);

  return buildResult(neighbors, userCoord);
}
