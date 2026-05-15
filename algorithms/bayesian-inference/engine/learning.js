// ─────────────────────────────────────────────────────────────────────────────
// Mood Mode — Learning Engine
// Self-contained learning layer that sits on top of the spatial classifier.
// Nothing in this file modifies the core algorithm — it only produces
// adjusted weights and parallel Bayesian scores that the caller can blend in.
//
// Three capabilities:
//   1. TELEMETRY   — log every session anonymously (answers + result + dwell times)
//   2. FEEDBACK    — "feels right / not quite" signal, stored per session
//   3. LEARNING    — gradient descent on question weights from feedback history
//                 — Bayesian profile matching from observed answer distributions
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// TESTING MODE
// Set TESTING_MODE = true during local testing and peer review.
// Set TESTING_MODE = false before production rollout.
//
// Testing:    Bayesian influence visible after ~5 sessions / 3 feedback taps.
// Production: Bayesian influence stable after ~100 sessions / 50 feedback taps.
// ─────────────────────────────────────────────────────────────────────────────
export const TESTING_MODE = true; // ← flip to false for production

const THRESHOLDS = TESTING_MODE ? {
  bayesMinSessions:  5,    // total sessions before Bayes scores compute
  blendMinFeedback:  3,    // feedback responses before blend weight > 0
  blendMaxFeedback:  50,   // feedback responses at which blend reaches 40%
  weightUpdateEvery: 3,    // run weight learning every N feedback sessions
} : {
  bayesMinSessions:  100,  // statistically stable for 500-person rollout
  blendMinFeedback:  50,
  blendMaxFeedback:  500,
  weightUpdateEvery: 25,
};

const STORE = {
  SESSIONS:  'mm_sessions',    // array of session objects (capped at 500)
  WEIGHTS:   'mm_weights',     // learned question weight overrides
  PROFILES:  'mm_profiles',    // Bayesian per-mood answer distributions
  META:      'mm_meta',        // session count, last weight update etc.
};

// ── Storage helpers ───────────────────────────────────────────────────────────

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; }
}

// ── Session schema ────────────────────────────────────────────────────────────
// {
//   id:          string   — random session id
//   ts:          number   — unix ms timestamp
//   answers:     object   — { questionId: optionId }
//   answerOrder: string[] — order questions were answered
//   dwellMs:     object   — { questionId: ms spent before answering }
//   result:      object   — { mood, zone, confidence, neighbors[0..2].mood }
//   feedback:    null | 'right' | 'notquite'
// }

// ─────────────────────────────────────────────────────────────────────────────
// 1. TELEMETRY
// ─────────────────────────────────────────────────────────────────────────────

let _activeSession = null;
let _questionStartTime = null;
const _dwellAccum = {};

export function sessionStart() {
  _activeSession = {
    id:          Math.random().toString(36).slice(2),
    ts:          Date.now(),
    answers:     {},
    answerOrder: [],
    dwellMs:     {},
    result:      null,
    feedback:    null,
  };
  _questionStartTime = Date.now();
  Object.keys(_dwellAccum).forEach(k => delete _dwellAccum[k]);
}

export function sessionQuestionShown(questionId) {
  _questionStartTime = Date.now();
}

export function sessionAnswered(questionId, optionId) {
  if (!_activeSession) return;
  const dwell = Date.now() - (_questionStartTime || Date.now());
  _activeSession.answers[questionId]     = optionId;
  _activeSession.answerOrder.push(questionId);
  _activeSession.dwellMs[questionId]     = dwell;
}

export function sessionComplete(result) {
  if (!_activeSession) return;
  _activeSession.result = {
    mood:       result.mood,
    zone:       result.zone,
    confidence: result.confidence,
    neighbors:  result.neighbors.slice(0, 3).map(n => n.mood),
  };

  // Persist
  const sessions = load(STORE.SESSIONS) || [];
  sessions.unshift(_activeSession);
  save(STORE.SESSIONS, sessions.slice(0, 500)); // cap at 500

  // Update Bayesian profiles with this session
  _updateProfiles(_activeSession);

  // Update meta
  const meta = load(STORE.META) || { count: 0, lastWeightUpdate: 0 };
  meta.count++;
  save(STORE.META, meta);

  // Auto-trigger weight learning every 25 sessions with feedback
  const feedbackCount = (load(STORE.SESSIONS) || []).filter(s => s.feedback).length;
  if (feedbackCount > 0 && feedbackCount % THRESHOLDS.weightUpdateEvery === 0) {
    learnWeights();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────

export function recordFeedback(signal) {
  // signal: 'right' | 'notquite'
  if (!_activeSession) return;
  _activeSession.feedback = signal;

  // Update the stored session with feedback
  const sessions = load(STORE.SESSIONS) || [];
  const idx = sessions.findIndex(s => s.id === _activeSession.id);
  if (idx !== -1) {
    sessions[idx].feedback = signal;
    save(STORE.SESSIONS, sessions);
  }

  // If "not quite", flag for weight learning
  if (signal === 'notquite') learnWeights();
}

export function getFeedbackStats() {
  const sessions = (load(STORE.SESSIONS) || []).filter(s => s.feedback);
  const right    = sessions.filter(s => s.feedback === 'right').length;
  const notquite = sessions.filter(s => s.feedback === 'notquite').length;
  const total    = sessions.length;
  return {
    total,
    right,
    notquite,
    accuracy: total > 0 ? Math.round((right / total) * 100) : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3a. WEIGHT LEARNING — gradient descent on question weights
//
// For each "not quite" session: increase weights of questions whose answer
// was INCONSISTENT with the result mood's signature (they pulled the coord
// away from the right answer — so we need to hear them more loudly).
// For each "feels right" session: reinforce current weights (small nudge toward
// questions whose answer WAS consistent with the result signature).
//
// Learning rate decays as session count grows — early sessions have more
// impact, later sessions make smaller adjustments.
// ─────────────────────────────────────────────────────────────────────────────

const LEARNING_RATE_BASE = 0.04;
const WEIGHT_MIN  = 0.5;
const WEIGHT_MAX  = 2.5;

export function learnWeights(baseWeights) {
  const sessions = (load(STORE.SESSIONS) || []).filter(s => s.feedback && s.result);
  if (sessions.length < 5) return null; // not enough data yet

  // Load or initialise weights from base
  let weights = load(STORE.WEIGHTS) || { ...baseWeights };

  const n = sessions.length;
  // Decay rate — early sessions move weights more
  const lr = LEARNING_RATE_BASE / (1 + Math.log(n) * 0.1);

  sessions.forEach(session => {
    const { answers, result, feedback } = session;
    if (!result) return;

    // For each question the user answered
    Object.entries(answers).forEach(([qId, oId]) => {
      const w = weights[qId] ?? 1.0;

      if (feedback === 'right') {
        // This set of answers led to a correct result — small reinforce
        weights[qId] = Math.min(WEIGHT_MAX, w + lr * 0.3);
      } else {
        // "Not quite" — look at whether this answer was consistent with
        // the result mood. If consistent but result was wrong, question
        // needs more weight. If inconsistent, less weight.
        // We proxy consistency by checking if this question's answer
        // is in the result mood's neighbour set's signatures.
        const wasConsistent = _answerMatchesMood(qId, oId, result.mood);
        if (wasConsistent) {
          // This answer pointed right but result was wrong — boost it
          weights[qId] = Math.min(WEIGHT_MAX, w + lr);
        } else {
          // This answer pointed away — reduce its influence
          weights[qId] = Math.max(WEIGHT_MIN, w - lr * 0.5);
        }
      }
    });
  });

  // Normalise so weights average to 1.0 (preserve scale)
  const qIds  = Object.keys(weights);
  const avg   = qIds.reduce((s, k) => s + weights[k], 0) / qIds.length;
  if (avg > 0) qIds.forEach(k => { weights[k] = Math.round((weights[k] / avg) * 1000) / 1000; });

  save(STORE.WEIGHTS, weights);

  const meta = load(STORE.META) || {};
  meta.lastWeightUpdate = Date.now();
  meta.sessionsAtUpdate = n;
  save(STORE.META, meta);

  return weights;
}

// Get the current learned weights (falls back to base weights if no learning yet)
export function getLearnedWeights(baseWeights) {
  const stored = load(STORE.WEIGHTS);
  if (!stored) return { ...baseWeights };

  // Merge: only override questions we have learned data for
  const merged = { ...baseWeights };
  Object.entries(stored).forEach(([k, v]) => {
    if (k in merged) merged[k] = v;
  });
  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3b. BAYESIAN PROFILE MATCHING
//
// For each mood, build a probability distribution:
//   P(answer | mood) = (count of sessions where result=mood AND answer=x) / total sessions for mood
//
// Then for a given answer set:
//   score(mood) = Π P(answer_i | mood)  (naive Bayes — independence assumption)
//
// Blend spatial score with Bayesian score once enough data exists:
//   finalScore = (1 - bayesWeight) × spatialScore + bayesWeight × bayesScore
//
// bayesWeight starts at 0, reaches 0.4 at 200+ sessions with feedback.
// ─────────────────────────────────────────────────────────────────────────────

function _updateProfiles(session) {
  if (!session.result) return;
  const mood = session.result.mood;
  const profiles = load(STORE.PROFILES) || {};

  if (!profiles[mood]) profiles[mood] = { count: 0, answers: {} };
  profiles[mood].count++;

  Object.entries(session.answers).forEach(([qId, oId]) => {
    if (!profiles[mood].answers[qId])   profiles[mood].answers[qId]   = {};
    if (!profiles[mood].answers[qId][oId]) profiles[mood].answers[qId][oId] = 0;
    profiles[mood].answers[qId][oId]++;
  });

  save(STORE.PROFILES, profiles);
}

export function getBayesianScores(answers, moodMap) {
  const profiles = load(STORE.PROFILES);
  if (!profiles) return null;

  const totalSessions = Object.values(profiles).reduce((s, p) => s + p.count, 0);
  if (totalSessions < THRESHOLDS.bayesMinSessions) return null;

  const scores = {};

  moodMap.forEach(mood => {
    const profile = profiles[mood.name];
    if (!profile || profile.count < 3) {
      scores[mood.name] = 0;
      return;
    }

    // Naive Bayes: log-sum to avoid underflow
    let logScore = Math.log(profile.count / totalSessions); // prior P(mood)

    Object.entries(answers).forEach(([qId, oId]) => {
      const qDist = profile.answers[qId];
      if (!qDist) return;
      const count = qDist[oId] || 0;
      const total = Object.values(qDist).reduce((s, v) => s + v, 0);
      // Laplace smoothing: add 1 to each count to avoid zero probabilities
      const p = (count + 1) / (total + 8); // 8 = typical option count
      logScore += Math.log(p);
    });

    scores[mood.name] = logScore;
  });

  // Convert from log-space to 0–1 range (softmax)
  const logValues = Object.values(scores);
  const maxLog    = Math.max(...logValues);
  const expSum    = logValues.reduce((s, v) => s + Math.exp(v - maxLog), 0);

  const normalised = {};
  Object.entries(scores).forEach(([mood, log]) => {
    normalised[mood] = Math.exp(log - maxLog) / expSum;
  });

  return normalised;
}

// Compute blend weight for Bayesian scores (0 at start, max 0.4 at 200+ sessions)
export function getBayesBlendWeight() {
  const sessions = (load(STORE.SESSIONS) || []).filter(s => s.feedback);
  const n = sessions.length;
  if (n < THRESHOLDS.blendMinFeedback) return 0;
  return Math.min(0.4, (n - THRESHOLDS.blendMinFeedback) / (THRESHOLDS.blendMaxFeedback - THRESHOLDS.blendMinFeedback) * 0.4);
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS — for peer review dashboard
// ─────────────────────────────────────────────────────────────────────────────

export function getAnalytics() {
  const sessions  = load(STORE.SESSIONS) || [];
  const meta      = load(STORE.META) || { count: 0 };
  const weights   = load(STORE.WEIGHTS);
  const profiles  = load(STORE.PROFILES) || {};
  const feedback  = getFeedbackStats();

  // Mood distribution
  const moodDist = {};
  sessions.forEach(s => {
    if (s.result) moodDist[s.result.mood] = (moodDist[s.result.mood] || 0) + 1;
  });

  // Zone distribution
  const zoneDist = {};
  sessions.forEach(s => {
    if (s.result) zoneDist[s.result.zone] = (zoneDist[s.result.zone] || 0) + 1;
  });

  // Average dwell per question (ms)
  const dwellTotals = {}, dwellCounts = {};
  sessions.forEach(s => {
    Object.entries(s.dwellMs || {}).forEach(([qId, ms]) => {
      dwellTotals[qId] = (dwellTotals[qId] || 0) + ms;
      dwellCounts[qId] = (dwellCounts[qId] || 0) + 1;
    });
  });
  const avgDwell = {};
  Object.keys(dwellTotals).forEach(qId => {
    avgDwell[qId] = Math.round(dwellTotals[qId] / dwellCounts[qId]);
  });

  // Most common answer per question
  const answerDist = {};
  sessions.forEach(s => {
    Object.entries(s.answers || {}).forEach(([qId, oId]) => {
      if (!answerDist[qId]) answerDist[qId] = {};
      answerDist[qId][oId] = (answerDist[qId][oId] || 0) + 1;
    });
  });

  // Average confidence
  const confidences = sessions.filter(s => s.result?.confidence != null).map(s => s.result.confidence);
  const avgConfidence = confidences.length
    ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100) / 100
    : null;

  return {
    totalSessions:  meta.count,
    storedSessions: sessions.length,
    feedback,
    avgConfidence,
    moodDistribution:   moodDist,
    zoneDistribution:   zoneDist,
    avgDwellMs:         avgDwell,
    answerDistribution: answerDist,
    learnedWeights:     weights,
    bayesBlendWeight:   getBayesBlendWeight(),
    profiledMoods:      Object.keys(profiles).length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Simple proxy: check if this answer appears in the MOOD_MAP signature for the given mood
function _answerMatchesMood(qId, oId, moodName) {
  // We can't import MOOD_MAP here (no data imports in engine), so we use stored profiles
  const profiles = load(STORE.PROFILES) || {};
  const profile  = profiles[moodName];
  if (!profile) return false;
  const dist = profile.answers[qId];
  if (!dist) return false;
  const counts = Object.values(dist);
  const max    = Math.max(...counts);
  return (dist[oId] || 0) >= max * 0.5; // "consistent" = within 50% of most common answer
}

// Export for external reset (testing / privacy)
export function clearLearningData() {
  [STORE.SESSIONS, STORE.WEIGHTS, STORE.PROFILES, STORE.META].forEach(k =>
    localStorage.removeItem(k)
  );
}
