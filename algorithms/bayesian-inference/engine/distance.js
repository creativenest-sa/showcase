// Pure distance functions — no imports from data files.
// v2: weighted clarity, recency, information gain, signature tie-break,
//     zero-padding, threshold neighbours, adaptive question ordering.

// ── Question weights ──────────────────────────────────────────────────────────
export const QUESTION_WEIGHTS = {
  colour:    1.0,
  sky:       1.5,   // atmospheric anchor, tie-breaker
  pulse:     1.4,   // body energy signal
  texture:   1.0,
  sound:     1.0,
  battery:   1.4,   // body energy + clarity signal
  timeofday: 1.2    // temporal clarity (Q7)
};

// ── #4 Recency weights ────────────────────────────────────────────────────────
// Later answers carry more weight — user is warmed up, more introspective.
// 7 steps from 0.82 → 1.20. Index by position in answer order.
export const RECENCY_WEIGHTS = [0.82, 0.88, 0.94, 1.00, 1.06, 1.14, 1.20];

// ── #3 Clarity axis weight ────────────────────────────────────────────────────
// Clarity is secondary. Downweight slightly vs Energy/Valence so zone assignment
// isn't skewed. Amplify when strongly negative — murky states are most diagnostic.
function clarityAxisWeight(userClarity) {
  return userClarity < -2 ? 1.05 : 0.80;
}

// ── Weighted 3D Euclidean distance ────────────────────────────────────────────
// #3: clarity weight is adaptive based on the user's clarity value
export function dist3(a, b, userClarity) {
  const cw = userClarity !== undefined ? clarityAxisWeight(userClarity) : 0.80;
  return Math.sqrt(
    (a.energy  - b.energy)  ** 2 +
    (a.valence - b.valence) ** 2 +
    ((a.clarity - b.clarity) * cw) ** 2
  );
}

// ── #5 Zero-padding for partial compute ───────────────────────────────────────
// Unanswered questions contribute {0,0,0} so partial coordinates reflect only
// what has actually been answered, not an arbitrary midpoint guess.
const ZERO = '__zero__';

export function zeroPadAnswers(answers, allQuestions) {
  const padded = { ...answers };
  allQuestions.forEach(q => { if (!(q.id in padded)) padded[q.id] = ZERO; });
  return padded;
}

// ── Weighted sum with recency + zero-padding support ─────────────────────────
// answerOrder: questionIds in the order they were answered (drives recency).
// Any option value of '__zero__' contributes nothing to the coordinate.
export function weightedSum(answers, answerMap, weights, answerOrder) {
  let energy = 0, valence = 0, clarity = 0;
  const order = answerOrder || Object.keys(answers);
  const realAnswers = order.filter(id => answers[id] && answers[id] !== ZERO);
  const n = realAnswers.length;

  let answeredIdx = 0;
  order.forEach(questionId => {
    const optionId = answers[questionId];
    if (!optionId || optionId === ZERO) return;

    if (!answerMap[questionId]) {
      throw new Error(`Unknown question ID: "${questionId}". Check ANSWER_MAP keys.`);
    }
    const vote = answerMap[questionId][optionId];
    if (!vote) {
      throw new Error(
        `Unknown option ID: "${optionId}" for question "${questionId}". ` +
        `Valid: ${Object.keys(answerMap[questionId]).join(', ')}`
      );
    }

    const qWeight  = weights[questionId] ?? 1.0;
    // #4: recency — map answered position onto RECENCY_WEIGHTS
    const ri = n > 1 ? Math.round((answeredIdx / (n - 1)) * (RECENCY_WEIGHTS.length - 1)) : RECENCY_WEIGHTS.length - 1;
    const recency  = RECENCY_WEIGHTS[Math.min(ri, RECENCY_WEIGHTS.length - 1)];

    energy  += vote.energy  * qWeight * recency;
    valence += vote.valence * qWeight * recency;
    clarity += vote.clarity * qWeight * recency;
    answeredIdx++;
  });

  return { energy, valence, clarity };
}

// ── #2 Signature tie-break score ─────────────────────────────────────────────
// Each mood has a `signature` map: { questionId: [characteristicOptionIds] }.
// Score = how many of the user's answers match the mood's characteristic options.
function signatureScore(mood, answers) {
  if (!mood.signature) return 0;
  let score = 0;
  for (const [qId, preferred] of Object.entries(mood.signature)) {
    if (answers[qId] && preferred.includes(answers[qId])) score++;
  }
  return score;
}

// ── #6 Threshold-based neighbour finder ──────────────────────────────────────
// Returns all moods within a dynamic distance cutoff (not a hard top-3).
// Each gets a weight (inverse-distance normalised) and a similarity score 0–1.
const TIE_THRESHOLD   = 0.75; // gap within which signature tie-break applies
const NEIGHBOUR_MAX   = 5;
const MIN_WEIGHT      = 0.07; // drop neighbours contributing less than 7%

export function findNearestNeighbors(userCoord, moodMap, answers) {
  if (!moodMap.length) throw new Error('moodMap is empty');

  const ranked = moodMap
    .map(mood => ({
      mood,
      distance: dist3(userCoord, mood.coordinate, userCoord.clarity)
    }))
    .sort((a, b) => a.distance - b.distance);

  // Exact hit
  if (ranked[0].distance === 0) {
    return [{ mood: ranked[0].mood, distance: 0, weight: 1.0, similarity: 1.0 }];
  }

  const minDist = ranked[0].distance;
  // Dynamic cutoff: nearest + threshold, or nearest × 1.7 — whichever is larger
  const cutoff  = Math.max(minDist + 3.5, minDist * 1.7);
  const pool    = ranked.filter(r => r.distance <= cutoff).slice(0, NEIGHBOUR_MAX);

  // #2: apply signature tie-break within TIE_THRESHOLD of the leader
  if (answers) {
    const tiedGroup = pool.filter(r => r.distance - minDist < TIE_THRESHOLD);
    if (tiedGroup.length > 1) {
      const withSig = tiedGroup.map(r => ({ ...r, sig: signatureScore(r.mood, answers) }));
      withSig.sort((a, b) => b.sig - a.sig || a.distance - b.distance);
      // If signature produced a clear winner, boost its effective distance
      if (withSig[0].sig > withSig[1].sig) {
        const winner = withSig[0];
        pool.forEach(r => {
          if (r.mood.id === winner.mood.id) r.distance *= 0.88; // pull closer
        });
        pool.sort((a, b) => a.distance - b.distance);
      }
    }
  }

  // Inverse-distance weights
  const invD  = pool.map(r => 1 / r.distance);
  const total = invD.reduce((s, v) => s + v, 0);
  const withWeights = pool.map((r, i) => ({ ...r, weight: invD[i] / total }));

  // Drop negligible
  const meaningful = withWeights.filter(r => r.weight >= MIN_WEIGHT);
  const finalPool  = meaningful.length ? meaningful : [withWeights[0]];

  // Re-normalise + add similarity score
  const ft = finalPool.reduce((s, r) => s + r.weight, 0);
  return finalPool.map(r => ({
    mood:       r.mood,
    distance:   Math.round(r.distance * 1000) / 1000,
    weight:     r.weight / ft,
    similarity: parseFloat(Math.max(0, 1 - r.distance / (cutoff + 0.1)).toFixed(3))
  }));
}

// ── #1 Adaptive question ordering — information gain ──────────────────────────
// After each answer, rank remaining questions by expected information gain.
// Uses variance of nearest-mood distances across all options as the heuristic:
// high variance = this question can move the coordinate a lot = ask it sooner.
export function rankQuestionsByInfoGain(currentCoord, answeredIds, allQuestions, answerMap, moodMap) {
  const remaining = allQuestions.filter(q => !answeredIds.includes(q.id));

  const scored = remaining.map(q => {
    const outcomes = q.options.map(opt => {
      const vote = answerMap[q.id]?.[opt.id];
      if (!vote) return null;
      const sim = {
        energy:  currentCoord.energy  + vote.energy,
        valence: currentCoord.valence + vote.valence,
        clarity: currentCoord.clarity + vote.clarity
      };
      // Distance to nearest mood pin from simulated coord
      return moodMap.reduce((best, mood) => {
        const d = dist3(sim, mood.coordinate, sim.clarity);
        return d < best ? d : best;
      }, Infinity);
    }).filter(v => v !== null);

    if (!outcomes.length) return { q, gain: 0 };
    const mean = outcomes.reduce((s, v) => s + v, 0) / outcomes.length;
    const variance = outcomes.reduce((s, v) => s + (v - mean) ** 2, 0) / outcomes.length;
    return { q, gain: variance };
  });

  return scored.sort((a, b) => b.gain - a.gain).map(s => s.q);
}

// Alias — tie-break is built into findNearestNeighbors
export { findNearestNeighbors as findNearestWithTieBreak };
