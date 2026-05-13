export function buildResult(mood, userCoordinate, distance) {
  return {
    mood:    mood.name,
    tagline: mood.tagline,
    palette: { ...mood.palette },
    debug: {
      moodId:         mood.id,
      userCoordinate: { energy: userCoordinate.energy, valence: userCoordinate.valence },
      moodCoordinate: { energy: mood.coordinate.energy, valence: mood.coordinate.valence },
      distance:       Math.round(distance * 100) / 100,
    },
  };
}
