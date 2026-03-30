const test = require('node:test');
const assert = require('node:assert/strict');
const meetupData = require('../src/data/meetup-data');
const { createMatchService } = require('../src/services/match-service');

test('match service falls back when no OpenRouter API key is available', async () => {
  const service = createMatchService({
    configProvider: () => ({
      openRouter: { apiKey: '', model: 'test-model' },
      allowFallbackAi: true
    })
  });

  const result = await service.getMatch({ goal: 'Meet people working on evals and reliable agents' });

  assert.equal(result.source, 'fallback');
  assert.ok(result.headline);
  assert.ok(result.reason);
  assert.equal(result.recommendedAttendeeIds.length, 2);
  assert.equal(result.recommendedSessionIds.length, 2);
});

test('match service uses the seeded default goal when the request is blank', async () => {
  const service = createMatchService({
    configProvider: () => ({
      openRouter: { apiKey: '', model: 'test-model' },
      allowFallbackAi: true
    })
  });

  const result = await service.getMatch({ goal: '   ' });

  assert.equal(result.source, 'fallback');
  assert.ok(result.reason.includes(meetupData.defaults.matchGoal));
});

test('match service normalizes upstream results to valid seed ids only', async () => {
  const service = createMatchService({
    configProvider: () => ({
      openRouter: { apiKey: 'key', model: 'test-model' },
      allowFallbackAi: true
    }),
    completeJsonImpl: async () => ({
      model: 'test-model',
      json: {
        headline: 'Best path through the meetup',
        recommendedAttendeeIds: ['a2', 'missing-id', 'a2', 'a6'],
        recommendedSessionIds: ['s3', 'bad-session', 's4'],
        reason: 'These are the most relevant sessions and people for reliable AI tooling.'
      }
    })
  });

  const result = await service.getMatch({ goal: 'Find people building reliable AI tooling' });

  assert.deepEqual(result.recommendedAttendeeIds, ['a2', 'a6']);
  assert.deepEqual(result.recommendedSessionIds, ['s3', 's4']);
  assert.equal(result.source, 'openrouter');
});

test('match service falls back when upstream returns too few valid recommendations', async () => {
  const service = createMatchService({
    configProvider: () => ({
      openRouter: { apiKey: 'key', model: 'test-model' },
      allowFallbackAi: true
    }),
    completeJsonImpl: async () => ({
      model: 'test-model',
      json: {
        headline: 'One maybe-good intro',
        recommendedAttendeeIds: ['a2'],
        recommendedSessionIds: ['s3'],
        reason: 'This is a start, but it is not a full meetup path.'
      }
    })
  });

  const result = await service.getMatch({ goal: 'Find people building reliable AI tooling' });

  assert.equal(result.source, 'fallback');
  assert.equal(result.recommendedAttendeeIds.length, 2);
  assert.equal(result.recommendedSessionIds.length, 2);
});

test('match service falls back when upstream shape is invalid', async () => {
  const service = createMatchService({
    configProvider: () => ({
      openRouter: { apiKey: 'key', model: 'test-model' },
      allowFallbackAi: true
    }),
    completeJsonImpl: async () => ({
      model: 'test-model',
      json: {
        headline: '',
        recommendedAttendeeIds: [],
        recommendedSessionIds: [],
        reason: ''
      }
    })
  });

  const result = await service.getMatch({ goal: meetupData.defaults.matchGoal });

  assert.equal(result.source, 'fallback');
  assert.ok(result.reason.length > 0);
});

test('match service returns 503 when fallback is disabled and no key is configured', async () => {
  const service = createMatchService({
    configProvider: () => ({
      openRouter: { apiKey: '', model: 'test-model' },
      allowFallbackAi: false
    })
  });

  await assert.rejects(
    () => service.getMatch({ goal: meetupData.defaults.matchGoal }),
    (error) => error.statusCode === 503 && /fallback mode is disabled/i.test(error.message)
  );
});

test('match service returns 502 when fallback is disabled and upstream output is invalid', async () => {
  const service = createMatchService({
    configProvider: () => ({
      openRouter: { apiKey: 'key', model: 'test-model' },
      allowFallbackAi: false
    }),
    completeJsonImpl: async () => ({
      model: 'test-model',
      json: {
        headline: '',
        recommendedAttendeeIds: [],
        recommendedSessionIds: [],
        reason: ''
      }
    })
  });

  await assert.rejects(
    () => service.getMatch({ goal: meetupData.defaults.matchGoal }),
    (error) => error.statusCode === 502 && /upstream response was invalid/i.test(error.message)
  );
});
