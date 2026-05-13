import { ANSWER_MAP } from './data/answer-map.js';
import { MOOD_MAP }   from './data/mood-map.js';
import { sumCoordinates, findNearestMood } from './engine/distance.js';
import { buildResult } from './engine/output.js';

export { MOOD_MAP } from './data/mood-map.js';
export { QUESTIONS } from './data/questions.js';

/**
 * @param {{ colour, sky, pulse, texture, sound, battery }} answers — option IDs keyed by question ID
 * @returns {{ mood, tagline, palette, debug }}
 */
export function compute(answers) {
  const questionIds = ['colour', 'sky', 'pulse', 'texture', 'sound', 'battery'];

  const coords = questionIds.map(qId => {
    const questionMap = ANSWER_MAP[qId];
    if (!questionMap) {
      throw new Error(`compute: unknown question "${qId}"`);
    }
    const optionId = answers[qId];
    if (optionId === undefined || optionId === null) {
      throw new Error(`compute: missing answer for question "${qId}"`);
    }
    const coord = questionMap[optionId];
    if (!coord) {
      throw new Error(`compute: unknown option "${optionId}" for question "${qId}"`);
    }
    return coord;
  });

  const userCoordinate = sumCoordinates(coords);
  const { mood, distance } = findNearestMood(userCoordinate, MOOD_MAP);
  return buildResult(mood, userCoordinate, distance);
}
