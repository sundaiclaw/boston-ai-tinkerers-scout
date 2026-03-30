const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const meetupData = require('../src/data/meetup-data');
const { createApp } = require('../src/app');

function buildApp(configOverride = {}) {
  return createApp({
    configProvider: () => ({
      openRouter: {
        apiKey: '',
        model: 'test-model',
        baseUrl: 'https://openrouter.test'
      },
      allowFallbackAi: true,
      ...configOverride
    })
  });
}

test('GET /healthz returns app status and AI runtime flags', async () => {
  const response = await request(buildApp()).get('/healthz');

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, 'ok');
  assert.equal(response.body.ok, true);
  assert.equal(response.body.service, 'boston-ai-tinkerers');
  assert.equal(response.body.fallbackEnabled, true);
  assert.equal(response.body.openRouterConfigured, false);
  assert.equal(response.body.model, 'test-model');
});

test('GET /api/data returns seeded landing page payload', async () => {
  const response = await request(buildApp()).get('/api/data');

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.hero.title, meetupData.hero.title);
  assert.equal(response.body.attendees.length, meetupData.attendees.length);
  assert.equal(response.body.sessions.length, meetupData.sessions.length);
});

test('POST /api/match returns a valid normalized response', async () => {
  const response = await request(buildApp())
    .post('/api/match')
    .send({ goal: 'Find people building local-first AI tools' });

  assert.equal(response.statusCode, 200);
  assert.ok(response.body.headline);
  assert.ok(Array.isArray(response.body.recommendedAttendeeIds));
  assert.ok(Array.isArray(response.body.recommendedSessionIds));
  assert.equal(response.body.source, 'fallback');
  assert.ok(response.body.reason);
});

test('POST /api/ideas returns at least three ideas', async () => {
  const response = await request(buildApp())
    .post('/api/ideas')
    .send({ theme: 'Agent workflows for labs, startups, and civic teams' });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.source, 'fallback');
  assert.ok(Array.isArray(response.body.ideas));
  assert.ok(response.body.ideas.length >= 3);
});

test('POST /api/match rejects malformed JSON with a clear client error', async () => {
  const response = await request(buildApp())
    .post('/api/match')
    .set('Content-Type', 'application/json')
    .send('{"goal":');

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    error: 'Invalid JSON body.'
  });
});

test('POST /api/ideas rejects non-object request bodies', async () => {
  const response = await request(buildApp())
    .post('/api/ideas')
    .send([{ theme: 'bad shape' }]);

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, {
    error: 'Request body must be a JSON object.'
  });
});

test('unknown API routes return JSON 404s instead of the SPA shell', async () => {
  const response = await request(buildApp()).get('/api/not-real');

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.body, {
    error: 'API route not found.'
  });
});

test('AI routes return 503 when fallback is disabled and OpenRouter is missing', async () => {
  const app = buildApp({ allowFallbackAi: false });

  const matchResponse = await request(app).post('/api/match').send({ goal: meetupData.defaults.matchGoal });
  const ideasResponse = await request(app).post('/api/ideas').send({ theme: meetupData.defaults.ideaTheme });

  assert.equal(matchResponse.statusCode, 503);
  assert.match(matchResponse.body.error, /fallback mode is disabled/i);
  assert.equal(ideasResponse.statusCode, 503);
  assert.match(ideasResponse.body.error, /fallback mode is disabled/i);
});

test('spa fallback serves index.html for non-API routes', async () => {
  const response = await request(buildApp()).get('/non-existent-route');

  assert.equal(response.statusCode, 200);
  assert.match(response.text, /Boston AI Tinkerers/);
});
