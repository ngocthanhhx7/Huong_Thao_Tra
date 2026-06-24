const MOOD_BY_EMOJI = {
  '😊': 'great',
  '😌': 'good',
  '😐': 'okay',
  '😔': 'bad',
  '😤': 'awful',
};

const VALID_MOODS = new Set(['awful', 'bad', 'okay', 'good', 'great']);

const normalizeMood = (mood) => {
  if (!mood) return null;
  if (VALID_MOODS.has(mood)) return mood;
  return MOOD_BY_EMOJI[mood] || null;
};

const buildDrunkAt = ({ drunkAt, date, time }) => {
  if (drunkAt) return new Date(drunkAt);

  const day = date || new Date().toISOString().slice(0, 10);
  const clock = time || new Date().toTimeString().slice(0, 5);
  return new Date(`${day}T${clock}:00`);
};

const normalizeJournalPayload = (body) => ({
  tea: body.tea || null,
  teaName: body.teaName || '',
  drunkAt: buildDrunkAt(body),
  mood: normalizeMood(body.mood),
  rating: body.rating || null,
  bodyFeelings: body.bodyFeelings || body.feelings || [],
  note: body.note || '',
  photo: typeof body.photo === 'string' ? body.photo : '',
});

module.exports = {
  buildDrunkAt,
  normalizeJournalPayload,
  normalizeMood,
};
