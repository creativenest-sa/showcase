export function sumCoordinates(coords) {
  return coords.reduce(
    (sum, c) => ({ energy: sum.energy + c.energy, valence: sum.valence + c.valence }),
    { energy: 0, valence: 0 }
  );
}

export function findNearestMood(userCoord, moodMap) {
  if (!moodMap || moodMap.length === 0) {
    throw new Error('findNearestMood: mood map is empty');
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const mood of moodMap) {
    const de = userCoord.energy - mood.coordinate.energy;
    const dv = userCoord.valence - mood.coordinate.valence;
    const distance = Math.sqrt(de * de + dv * dv);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = mood;
    }
  }

  return { mood: nearest, distance: minDistance };
}
