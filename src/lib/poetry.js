const LINES = {
  'winter-day': "Right now, snow is settling on the Atlas peaks.",
  'winter-night': "Tonight, the peaks sleep quietly under snow and stars.",
  'spring-day': "Right now, the foothills are turning green again.",
  'spring-night': "Blossoms rest in the dark, waiting on tomorrow's light.",
  'summer-day': "Right now, the sun holds steady over dry stone.",
  'summer-night': "The heat has faded — crickets take the night shift.",
  'autumn-day': "Right now, golden light falls across the ridgelines.",
  'autumn-night': "Leaves are falling in the dark, unseen but falling still.",
}

export function getPoeticLine(season, mode) {
  return LINES[`${season}-${mode}`] || LINES['summer-day']
}
