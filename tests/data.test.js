const test = require('node:test');
const assert = require('node:assert/strict');
const meetupData = require('../src/data/meetup-data');

test('seed data includes Boston AI Tinkerers identity and rich meetup context', () => {
  assert.equal(meetupData.hero.title, 'Boston AI Tinkerers');
  assert.match(meetupData.cityContext.summary, /Boston AI Tinkerers/i);
  assert.ok(meetupData.sessions.length >= 6);
  assert.ok(meetupData.attendees.length >= 6);
  assert.ok(meetupData.themes.length >= 3);
});

test('attendees include richer profile context for AI matching', () => {
  for (const attendee of meetupData.attendees) {
    assert.ok(attendee.focus);
    assert.ok(attendee.project);
    assert.ok(attendee.lookingFor);
    assert.ok(attendee.context);
    assert.ok(attendee.neighborhood);
  }
});

test('sessions feel specific to a Boston builder meetup', () => {
  assert.ok(
    meetupData.sessions.some((session) => /Kendall|Cambridge|Boston|Somerville|MIT|Harvard/i.test(`${session.title} ${session.description}`))
  );
});
