const fs = require('node:fs');
const path = require('node:path');
const meetupData = require('../src/data/meetup-data');
const { createApp } = require('../src/app');

const requiredFiles = [
  '.env.example',
  'Dockerfile',
  'README.md',
  'server.js',
  'src/app.js',
  'src/config.js',
  'src/data/meetup-data.js',
  'src/routes/health.js',
  'src/routes/data.js',
  'src/routes/match.js',
  'src/routes/ideas.js',
  'src/services/prompt-builders.js',
  'src/services/openrouter.js',
  'src/services/fallback-service.js',
  'src/services/match-service.js',
  'src/services/ideas-service.js',
  'src/utils/parse-json.js',
  'src/utils/validate-shapes.js',
  'public/index.html',
  'public/app.js',
  'public/styles.css',
  'tests/app.test.js',
  'tests/config.test.js',
  'tests/data.test.js',
  'tests/match-service.test.js',
  'tests/ideas-service.test.js',
  'tests/ui-shell.test.js',
  'scripts/lint.js',
  'scripts/build.js'
];

for (const relativeFile of requiredFiles) {
  const absoluteFile = path.join(__dirname, '..', relativeFile);
  if (!fs.existsSync(absoluteFile)) {
    throw new Error(`Missing required build artifact: ${relativeFile}`);
  }
}

if (!Array.isArray(meetupData.sessions) || !Array.isArray(meetupData.attendees)) {
  throw new Error('Meetup seed data is missing required collections.');
}

if (!meetupData.hero || meetupData.hero.title !== 'Boston AI Tinkerers') {
  throw new Error('Meetup seed data is missing the required Boston AI Tinkerers identity.');
}

const app = createApp();
if (!app || typeof app.use !== 'function') {
  throw new Error('Express app failed to initialize.');
}

console.log(`Build verification passed for ${meetupData.hero.title}.`);
