function uniqueValidIds(candidateIds, validIds, limit) {
  const seen = new Set();
  const normalized = [];

  for (const candidate of Array.isArray(candidateIds) ? candidateIds : []) {
    if (typeof candidate !== 'string') {
      continue;
    }

    if (!validIds.has(candidate) || seen.has(candidate)) {
      continue;
    }

    seen.add(candidate);
    normalized.push(candidate);

    if (normalized.length >= limit) {
      break;
    }
  }

  return normalized;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeMatchOutput(raw, { attendees, sessions }) {
  const attendeeIds = new Set(attendees.map((attendee) => attendee.id));
  const sessionIds = new Set(sessions.map((session) => session.id));

  const normalized = {
    headline: normalizeText(raw && raw.headline),
    recommendedAttendeeIds: uniqueValidIds(raw && raw.recommendedAttendeeIds, attendeeIds, 2),
    recommendedSessionIds: uniqueValidIds(raw && raw.recommendedSessionIds, sessionIds, 2),
    reason: normalizeText(raw && raw.reason)
  };

  if (!normalized.headline || !normalized.reason) {
    const error = new Error('Match result must include a headline and reason.');
    error.code = 'MATCH_SHAPE_INVALID';
    throw error;
  }

  if (normalized.recommendedAttendeeIds.length < 2 || normalized.recommendedSessionIds.length < 2) {
    const error = new Error('Match result must include two valid attendees and two valid sessions.');
    error.code = 'MATCH_SHAPE_INVALID';
    throw error;
  }

  return normalized;
}

function normalizeIdea(idea) {
  return {
    title: normalizeText(idea && idea.title),
    summary: normalizeText(idea && idea.summary),
    implementationAngle: normalizeText(idea && idea.implementationAngle),
    suggestedStack: normalizeText(idea && idea.suggestedStack)
  };
}

function normalizeIdeasOutput(raw, { minimumIdeas = 3 } = {}) {
  const ideas = Array.isArray(raw && raw.ideas) ? raw.ideas.map(normalizeIdea) : [];
  const filteredIdeas = ideas.filter(
    (idea) => idea.title && idea.summary && idea.implementationAngle
  );

  if (filteredIdeas.length < minimumIdeas) {
    const error = new Error(`Expected at least ${minimumIdeas} valid ideas.`);
    error.code = 'IDEAS_SHAPE_INVALID';
    throw error;
  }

  return {
    ideas: filteredIdeas.slice(0, Math.max(minimumIdeas, filteredIdeas.length))
  };
}

module.exports = {
  normalizeMatchOutput,
  normalizeIdeasOutput
};
