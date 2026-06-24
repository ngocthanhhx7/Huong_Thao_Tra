const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeJournalPayload,
  normalizeMood,
} = require('../utils/wellnessJournalHelper');

test('normalizes legacy journal form payload into TeaJournal schema fields', () => {
  const payload = normalizeJournalPayload({
    teaName: 'Tra sen',
    date: '2026-06-24',
    time: '07:30',
    mood: '😊',
    rating: 5,
    feelings: ['thu gian', 'tap trung'],
    note: 'Sang khoan khoai',
    photo: { name: 'ignored-file-object.jpg' },
  });

  assert.equal(payload.teaName, 'Tra sen');
  assert.equal(payload.drunkAt.toISOString(), '2026-06-24T00:30:00.000Z');
  assert.equal(payload.mood, 'great');
  assert.deepEqual(payload.bodyFeelings, ['thu gian', 'tap trung']);
  assert.equal(payload.photo, '');
});

test('keeps schema mood values and drops unknown moods', () => {
  assert.equal(normalizeMood('good'), 'good');
  assert.equal(normalizeMood('not-a-mood'), null);
  assert.equal(normalizeMood(''), null);
});
