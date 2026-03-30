const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const clientJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '..', 'public', 'styles.css'), 'utf8');

test('index.html includes required landing page sections', () => {
  assert.match(html, /hero/i);
  assert.match(html, /Tonight's flow/i);
  assert.match(html, /Meet the builders/i);
  assert.match(html, /Boston context/i);
  assert.match(html, /AI meetup matcher/i);
  assert.match(html, /AI build ideas/i);
});

test('frontend script talks to both AI endpoints and Boston identity is present', () => {
  assert.match(clientJs, /\/api\/match/);
  assert.match(clientJs, /\/api\/ideas/);
  assert.match(html, /Boston AI Tinkerers/);
});

test('frontend escapes dynamic content before injecting HTML', () => {
  assert.match(clientJs, /function escapeHtml/);
  assert.match(clientJs, /escapeHtml\(result\.headline\)/);
  assert.match(clientJs, /escapeHtml\(idea\.title\)/);
});

test('frontend includes loading, empty, and error state handling for async AI flows', () => {
  assert.match(html, /aria-live="polite"/);
  assert.match(clientJs, /renderLandingLoading/);
  assert.match(clientJs, /renderStateCard/);
  assert.match(clientJs, /setFormBusy/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /status-error/);
});
