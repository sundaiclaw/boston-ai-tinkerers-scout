const test = require('node:test');
const assert = require('node:assert/strict');
const meetupData = require('../src/data/meetup-data');
const { createIdeasService } = require('../src/services/ideas-service');

test('ideas service returns at least three actionable fallback ideas', async () => {
  const service = createIdeasService({
    configProvider: () => ({
      openRouter: { apiKey: '', model: 'test-model' },
      allowFallbackAi: true
    })
  });

  const result = await service.getIdeas({ theme: 'Reliable AI systems for messy human operations' });

  assert.equal(result.source, 'fallback');
  assert.ok(result.ideas.length >= 3);
  for (const idea of result.ideas) {
    assert.ok(idea.title);
    assert.ok(idea.summary);
    assert.ok(idea.implementationAngle);
  }
});

test('ideas service uses the seeded default theme when the request is blank', async () => {
  const service = createIdeasService({
    configProvider: () => ({
      openRouter: { apiKey: '', model: 'test-model' },
      allowFallbackAi: true
    })
  });

  const result = await service.getIdeas({ theme: '  ' });

  assert.equal(result.source, 'fallback');
  assert.ok(result.ideas.every((idea) => idea.title.length > 0));
});

test('ideas service keeps valid OpenRouter output when it meets the contract', async () => {
  const service = createIdeasService({
    configProvider: () => ({
      openRouter: { apiKey: 'key', model: 'test-model' },
      allowFallbackAi: true
    }),
    completeJsonImpl: async () => ({
      model: 'test-model',
      json: {
        ideas: [
          {
            title: 'Demo handoff copilot',
            summary: 'Capture promising meetup demos and turn them into follow-up tasks.',
            implementationAngle: 'Build a notes-to-actions workflow for people doing rapid post-meetup collaboration.',
            suggestedStack: 'Express + SQLite + OpenRouter'
          },
          {
            title: 'Neighborhood pilot matcher',
            summary: 'Match local builders with nearby users or testers.',
            implementationAngle: 'Start with Boston neighborhoods and a simple scoring model for relevance.',
            suggestedStack: 'Node.js + Postgres + maps API'
          },
          {
            title: 'Lab workflow explainer',
            summary: 'Translate messy research notes into concise next-step briefs.',
            implementationAngle: 'Focus on one lab workflow and add structured summaries first.',
            suggestedStack: 'Express + background jobs + LLM'
          }
        ]
      }
    })
  });

  const result = await service.getIdeas({ theme: 'Meetup demos that can turn into real products' });

  assert.equal(result.source, 'openrouter');
  assert.equal(result.ideas.length, 3);
});

test('ideas service falls back when upstream ideas are vague or incomplete', async () => {
  const service = createIdeasService({
    configProvider: () => ({
      openRouter: { apiKey: 'key', model: 'test-model' },
      allowFallbackAi: true
    }),
    completeJsonImpl: async () => ({
      model: 'test-model',
      json: {
        ideas: [{ title: 'Thing', summary: '', implementationAngle: '' }]
      }
    })
  });

  const result = await service.getIdeas({ theme: 'Local-first AI tools for Boston communities' });

  assert.equal(result.source, 'fallback');
  assert.ok(result.ideas.length >= 3);
});

test('ideas service returns 503 when fallback is disabled and no key is configured', async () => {
  const service = createIdeasService({
    configProvider: () => ({
      openRouter: { apiKey: '', model: 'test-model' },
      allowFallbackAi: false
    })
  });

  await assert.rejects(
    () => service.getIdeas({ theme: meetupData.defaults.ideaTheme }),
    (error) => error.statusCode === 503 && /fallback mode is disabled/i.test(error.message)
  );
});

test('ideas service returns 502 when fallback is disabled and upstream output is invalid', async () => {
  const service = createIdeasService({
    configProvider: () => ({
      openRouter: { apiKey: 'key', model: 'test-model' },
      allowFallbackAi: false
    }),
    completeJsonImpl: async () => ({
      model: 'test-model',
      json: {
        ideas: [{ title: 'Thing', summary: '', implementationAngle: '' }]
      }
    })
  });

  await assert.rejects(
    () => service.getIdeas({ theme: meetupData.defaults.ideaTheme }),
    (error) => error.statusCode === 502 && /upstream response was invalid/i.test(error.message)
  );
});
