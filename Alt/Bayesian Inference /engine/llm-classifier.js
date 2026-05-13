// ─────────────────────────────────────────────────────────────────────────────
// LLM Parallel Classifier
// Sends the user's 7 sensory answers to Claude and gets an independent
// mood reading — no coordinates, no weights, pure language understanding.
//
// The result is shown alongside the spatial result so users can compare,
// and divergences are logged as the most valuable training signal.
// ─────────────────────────────────────────────────────────────────────────────

// Full mood vocabulary — must match MOOD_MAP exactly so results are comparable
const MOOD_VOCAB = [
  { name: 'Radiant',   zone: 'Golden Hour',   tagline: 'Open, warm, spilling over a little.' },
  { name: 'Bright',    zone: 'Golden Hour',   tagline: "Something just clicked. You're on." },
  { name: 'Energised', zone: 'Golden Hour',   tagline: 'Present in your body. Switched on.' },
  { name: 'Alive',     zone: 'Golden Hour',   tagline: 'Light, buzzy, slightly restless in a good way.' },
  { name: 'Peaceful',  zone: 'Morning Mist',  tagline: 'Nothing to prove. Quietly okay.' },
  { name: 'Tender',    zone: 'Morning Mist',  tagline: 'Feeling a lot, and close to the surface.' },
  { name: 'Calm',      zone: 'Morning Mist',  tagline: 'Calm without effort. Just here.' },
  { name: 'Soft',      zone: 'Morning Mist',  tagline: 'Unhurried. Letting things land slowly.' },
  { name: 'Even',      zone: 'Dead Calm',     tagline: 'In between. Not quite one thing or another.' },
  { name: 'Edged',     zone: 'Wildfire Dusk', tagline: "Something's building. You feel it everywhere." },
  { name: 'Wired',     zone: 'Wildfire Dusk', tagline: "Can't quite land. Body ahead of your mind." },
  { name: 'Restless',  zone: 'Wildfire Dusk', tagline: 'Too many tabs open. Edges coming loose.' },
  { name: 'Frayed',    zone: 'Wildfire Dusk', tagline: "A lot building. Not sure where it's going." },
  { name: 'Muted',     zone: 'Blue Hour',     tagline: 'The volume is turned down on everything.' },
  { name: 'Heavy',     zone: 'Blue Hour',     tagline: 'Everything takes more than usual right now.' },
  { name: 'Hollow',    zone: 'Blue Hour',     tagline: 'Going through the motions. Something missing.' },
  { name: 'Withdrawn',  zone: 'Blue Hour',     tagline: 'Hard to see far ahead. Unclear and a bit stuck.' },
  { name: 'Numb',       zone: 'Stillwater',    tagline: 'Flat. Not sad, not fine. Just switched off.' },
  { name: 'Nostalgic',  zone: 'Amber Hours',   tagline: "Warm for something that isn't here anymore." },
  { name: 'Grateful',   zone: 'Amber Hours',   tagline: 'Quietly full. Something landed right.' },
  { name: 'Determined', zone: 'Golden Hour',   tagline: 'Clear about what needs doing. Moving.' },
  { name: 'Anxious',    zone: 'Wildfire Dusk', tagline: "Something feels wrong. Can't name it." },
];

// Human-readable labels for each question + option for the prompt
const Q_LABELS = {
  colour:    'Colour that feels like them right now',
  sky:       'Sky they feel they are under',
  pulse:     'Their pulse / inner rhythm today',
  texture:   'What today would feel like to touch',
  sound:     'The closest sound to their inner world',
  battery:   'How full their energy battery is',
  timeofday: 'What time of day it feels like inside (not clock time)',
};

// Build the prompt from the user's answers and question/option labels
function buildPrompt(answers, questions) {
  // Map option IDs to human labels from the QUESTIONS array
  const labelMap = {};
  questions.forEach(q => {
    labelMap[q.id] = { question: q.label, options: {} };
    q.options.forEach(o => { labelMap[q.id].options[o.id] = o.label; });
  });

  // Format answers as readable lines
  const answerLines = Object.entries(answers).map(([qId, oId]) => {
    const q = labelMap[qId];
    if (!q) return null;
    const qLabel = Q_LABELS[qId] || q.question;
    const oLabel = q.options[oId] || oId;
    return `• ${qLabel}: **${oLabel}**`;
  }).filter(Boolean).join('\n');

  // Mood vocabulary for the model to choose from
  const moodList = MOOD_VOCAB.map(m =>
    `- ${m.name} (${m.zone}): "${m.tagline}"`
  ).join('\n');

  return `You are reading someone's emotional state through seven sensory answers they gave about how they feel right now. Your job is to identify their current mood from a specific vocabulary of 17 named moods.

## Their answers

${answerLines}

## The 17 mood vocabulary (you must choose from exactly these)

${moodList}

## Your task

Read the seven answers holistically — not as data points, but as a sensory portrait of a person's inner state right now. Consider:
- The overall atmosphere the answers create together
- Which answers feel most emotionally charged or specific
- Combinations that reinforce each other
- Anything unexpected or contradictory

Then identify:
1. The **primary mood** — which single mood name fits best
2. Up to 2 **undertone moods** — secondary moods that are also present (optional, only include if genuinely present)
3. A **one-sentence reading** — a brief, personal observation about this specific person's state right now. Not a definition of the mood — something you noticed in their particular combination of answers. Write directly to them (use "you").
4. Your **confidence** — how clearly do the answers point to one mood? (low / medium / high)
5. A **reasoning note** — which 2-3 answers were most decisive and why (for the comparison display)

Respond with ONLY a JSON object in this exact shape — no other text:

{
  "mood": "ExactMoodName",
  "zone": "Zone Name",
  "tagline": "the tagline from the vocabulary above, copied exactly",
  "reading": "Your one-sentence personal observation written directly to the user.",
  "undertones": ["MoodName", "MoodName"],
  "confidence": "low|medium|high",
  "reasoning": "Which answers were most decisive and why — max 2 sentences.",
  "method": "llm"
}`;
}

// Parse and validate the LLM response
function parseResponse(raw, fallbackResult) {
  try {
    // Strip any markdown code fences if present
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed  = JSON.parse(cleaned);

    // Validate mood is from the vocabulary
    const validMood = MOOD_VOCAB.find(m => m.name === parsed.mood);
    if (!validMood) {
      console.warn('[LLM] Unknown mood returned:', parsed.mood, '— using spatial fallback');
      return null;
    }

    return {
      mood:       parsed.mood,
      zone:       validMood.zone,
      tagline:    validMood.tagline,   // use canonical tagline, not whatever was returned
      reading:    parsed.reading  || '',
      undertones: (parsed.undertones || []).filter(u => MOOD_VOCAB.find(m => m.name === u)),
      confidence: ['low','medium','high'].includes(parsed.confidence) ? parsed.confidence : 'medium',
      reasoning:  parsed.reasoning || '',
      method:     'llm',
      // palette from MOOD_MAP will be applied by caller
    };
  } catch (err) {
    console.warn('[LLM] Parse error:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN — call the API and return the LLM result
// Returns null if API unavailable or response invalid
// ─────────────────────────────────────────────────────────────────────────────

// ── API key ───────────────────────────────────────────────────────────────────
// Set your Anthropic API key here, or in localStorage as 'mm_api_key',
// or pass it via the URL hash: http://localhost:8080/#apikey=sk-ant-...
// The key is never sent anywhere except api.anthropic.com.
let _apiKey = null;

export function setApiKey(key) {
  _apiKey = key;
  try { localStorage.setItem('mm_api_key', key); } catch {}
}

function getApiKey() {
  if (_apiKey) return _apiKey;
  // Try localStorage
  try {
    const stored = localStorage.getItem('mm_api_key');
    if (stored) { _apiKey = stored; return stored; }
  } catch {}
  // Try URL hash: #apikey=sk-ant-...
  try {
    const hash = window.location.hash.slice(1);
    const match = hash.match(/(?:^|&)apikey=([^&]+)/);
    if (match) {
      _apiKey = decodeURIComponent(match[1]);
      // Save to localStorage so it persists, then clean the URL
      try { localStorage.setItem('mm_api_key', _apiKey); } catch {}
      history.replaceState(null, '', window.location.pathname);
      return _apiKey;
    }
  } catch {}
  return null;
}

export async function classifyWithLLM(answers, questions, moodMap) {
  const key = getApiKey();
  if (!key) {
    console.info('[LLM] No API key set. Call MM.setApiKey("sk-ant-...") or load with #apikey=... in the URL.');
    return null;
  }

  const prompt = buildPrompt(answers, questions);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':                          'application/json',
        'x-api-key':                             key,
        'anthropic-version':                     '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 500,
        system:     'You are a precise emotional classifier. Respond only with the JSON object requested. No other text, no explanation outside the JSON.',
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn('[LLM] API error:', response.status, err?.error?.message || '');
      return null;
    }

    const data = await response.json();
    const raw  = data.content?.[0]?.text || '';
    const result = parseResponse(raw);

    if (!result) return null;

    // Attach the palette from MOOD_MAP so the UI can colour the LLM result
    const moodPin = moodMap.find(m => m.name === result.mood);
    if (moodPin) {
      result.palette = {
        primary:   moodPin.palette[0],
        secondary: moodPin.palette[1],
        accent:    moodPin.palette[2],
      };
    }

    return result;

  } catch (err) {
    console.warn('[LLM] Network error:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIVERGENCE ANALYSIS
// Compare spatial and LLM results — categorise the agreement level
// ─────────────────────────────────────────────────────────────────────────────

export function analyseDivergence(spatialResult, llmResult) {
  if (!llmResult) return { level: 'unavailable', label: '' };

  const sameZone = spatialResult.zone === llmResult.zone;
  const sameMood = spatialResult.mood === llmResult.mood;

  // Check if spatial primary appears as an LLM undertone or vice versa
  const spatialInLLMUndertones = (llmResult.undertones || []).includes(spatialResult.mood);
  const llmInSpatialNeighbors  = spatialResult.neighbors.some(n => n.mood === llmResult.mood);

  if (sameMood) {
    return { level: 'agreement',  label: 'Both readings agree' };
  }
  if (sameZone && (spatialInLLMUndertones || llmInSpatialNeighbors)) {
    return { level: 'close',      label: 'Same zone, adjacent moods' };
  }
  if (sameZone) {
    return { level: 'zone-match', label: 'Same emotional territory' };
  }
  return { level: 'divergence',   label: 'Different readings' };
}

// ─────────────────────────────────────────────────────────────────────────────
// DIVERGENCE STORAGE — log each comparison for analysis
// ─────────────────────────────────────────────────────────────────────────────

const DIV_KEY = 'mm_divergences';

export function logDivergence(answers, spatialResult, llmResult, userChose) {
  try {
    const stored = JSON.parse(localStorage.getItem(DIV_KEY) || '[]');
    stored.unshift({
      ts:            Date.now(),
      spatialMood:   spatialResult.mood,
      spatialZone:   spatialResult.zone,
      llmMood:       llmResult?.mood   || null,
      llmZone:       llmResult?.zone   || null,
      llmConfidence: llmResult?.confidence || null,
      divergence:    analyseDivergence(spatialResult, llmResult).level,
      userChose:     userChose || null,  // 'spatial' | 'llm' | null
      answers:       { ...answers },
    });
    localStorage.setItem(DIV_KEY, JSON.stringify(stored.slice(0, 200)));
  } catch {}
}

export function getDivergenceStats() {
  try {
    const stored = JSON.parse(localStorage.getItem(DIV_KEY) || '[]');
    const total  = stored.length;
    if (!total) return null;

    const byLevel = {};
    stored.forEach(d => { byLevel[d.divergence] = (byLevel[d.divergence] || 0) + 1; });

    const chosen = stored.filter(d => d.userChose);
    const choseLLM     = chosen.filter(d => d.userChose === 'llm').length;
    const choseSpatial = chosen.filter(d => d.userChose === 'spatial').length;

    return {
      total,
      byLevel,
      agreementRate:  Math.round(((byLevel.agreement || 0) / total) * 100),
      llmPreferred:   choseLLM,
      spatialPreferred: choseSpatial,
      userChoiceTotal: chosen.length,
    };
  } catch { return null; }
}
