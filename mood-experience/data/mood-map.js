export const MOOD_MAP = [
  // Centre
  {
    id: 'even',
    name: 'Even',
    coordinate: { energy: 0, valence: 0 },
    tagline: 'Neither here nor there — just present.',
    palette: { primary: '#8E9BAE', secondary: '#B2BFCF', accent: '#6A7A8E' },
  },

  // High energy + positive valence (Golden Hour zone)
  {
    id: 'radiant',
    name: 'Radiant',
    coordinate: { energy: 5, valence: 5 },
    tagline: 'Everything feels lit from within.',
    palette: { primary: '#F5A623', secondary: '#FAC85A', accent: '#D4881A' },
  },
  {
    id: 'bright',
    name: 'Bright',
    coordinate: { energy: 3, valence: 4 },
    tagline: "You're switched on and the world feels wide open.",
    palette: { primary: '#F7C948', secondary: '#FAE08A', accent: '#D4A820' },
  },
  {
    id: 'energised',
    name: 'Energised',
    coordinate: { energy: 4, valence: 3 },
    tagline: "There's momentum here — you're ready.",
    palette: { primary: '#E8834E', secondary: '#F0A87A', accent: '#C45F2A' },
  },

  // Low energy + positive valence (Soft Light zone)
  {
    id: 'tender',
    name: 'Tender',
    coordinate: { energy: -3, valence: 4 },
    tagline: 'Something soft and open is close to the surface.',
    palette: { primary: '#C9A8D4', secondary: '#DEC4E6', accent: '#A07AB8' },
  },
  {
    id: 'calm',
    name: 'Calm',
    coordinate: { energy: -4, valence: 3 },
    tagline: 'Still, clear, settled.',
    palette: { primary: '#8BB8C8', secondary: '#B0CFDC', accent: '#5E94A8' },
  },
  {
    id: 'peaceful',
    name: 'Peaceful',
    coordinate: { energy: -5, valence: 5 },
    tagline: 'A deep quiet that asks nothing of you.',
    palette: { primary: '#A8C8B8', secondary: '#C4DDD0', accent: '#709880' },
  },
  {
    id: 'soft',
    name: 'Soft',
    coordinate: { energy: -2, valence: 2 },
    tagline: 'Gentle and unhurried.',
    palette: { primary: '#D4B8C8', secondary: '#E6D0DC', accent: '#A888A0' },
  },

  // High energy + negative valence (Wildfire Dusk zone)
  {
    id: 'wired',
    name: 'Wired',
    coordinate: { energy: 4, valence: -3 },
    tagline: 'Too much input, not enough out.',
    palette: { primary: '#C84B4B', secondary: '#DF7878', accent: '#A02A2A' },
  },
  {
    id: 'edged',
    name: 'Edged',
    coordinate: { energy: 5, valence: -4 },
    tagline: 'Something is pulling tight.',
    palette: { primary: '#A84040', secondary: '#C86060', accent: '#803030' },
  },
  {
    id: 'restless',
    name: 'Restless',
    coordinate: { energy: 3, valence: -2 },
    tagline: "You can't quite land.",
    palette: { primary: '#C87840', secondary: '#DC9A68', accent: '#A05A28' },
  },

  // Low energy + negative valence (Blue Hour zone)
  {
    id: 'muted',
    name: 'Muted',
    coordinate: { energy: -4, valence: -2 },
    tagline: 'The volume is turned down on everything.',
    palette: { primary: '#6B7B8C', secondary: '#8FA0B3', accent: '#4F5C6B' },
  },
  {
    id: 'heavy',
    name: 'Heavy',
    coordinate: { energy: -5, valence: -4 },
    tagline: "It's all a little much to carry.",
    palette: { primary: '#4A5268', secondary: '#6A7290', accent: '#333A50' },
  },
  {
    id: 'hollow',
    name: 'Hollow',
    coordinate: { energy: -3, valence: -5 },
    tagline: 'Not empty exactly — just echoing.',
    palette: { primary: '#5C6878', secondary: '#7A8898', accent: '#404E5E' },
  },
  {
    id: 'withdrawn',
    name: 'Withdrawn',
    coordinate: { energy: -2, valence: -3 },
    tagline: "You'd rather not, today.",
    palette: { primary: '#7A7E8E', secondary: '#9A9EAE', accent: '#5A5E6E' },
  },
];
