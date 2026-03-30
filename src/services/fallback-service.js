function tokenize(value) {
  return String(value || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreTextMatch(queryTokens, value) {
  const textTokens = tokenize(value);
  let score = 0;

  for (const token of queryTokens) {
    if (textTokens.includes(token)) {
      score += 2;
    }
  }

  return score;
}

function scoreAttendee(goal, attendee) {
  const goalTokens = tokenize(goal);
  return (
    scoreTextMatch(goalTokens, attendee.focus) +
    scoreTextMatch(goalTokens, attendee.project) +
    scoreTextMatch(goalTokens, attendee.lookingFor) +
    scoreTextMatch(goalTokens, attendee.context) +
    scoreTextMatch(goalTokens, attendee.role)
  );
}

function scoreSession(goal, session) {
  const goalTokens = tokenize(goal);
  return (
    scoreTextMatch(goalTokens, session.tag) +
    scoreTextMatch(goalTokens, session.title) +
    scoreTextMatch(goalTokens, session.description) +
    scoreTextMatch(goalTokens, session.demoDetails)
  );
}

function rankItems(items, scoreFn) {
  return items
    .map((item) => ({ item, score: scoreFn(item) }))
    .sort((left, right) => right.score - left.score || left.item.id.localeCompare(right.item.id))
    .map((entry) => entry.item);
}

function getFallbackMatch({ goal, attendees, sessions }) {
  const rankedAttendees = rankItems(attendees, (attendee) => scoreAttendee(goal, attendee));
  const rankedSessions = rankItems(sessions, (session) => scoreSession(goal, session));
  const recommendedAttendees = rankedAttendees.slice(0, 2);
  const recommendedSessions = rankedSessions.slice(0, 2);

  return {
    headline: 'Start with the builders closest to your goal',
    recommendedAttendeeIds: recommendedAttendees.map((attendee) => attendee.id),
    recommendedSessionIds: recommendedSessions.map((session) => session.id),
    reason: `${recommendedAttendees[0].name} and ${recommendedAttendees[1].name} are the strongest matches for “${goal}”, and ${recommendedSessions[0].title} keeps you near the most relevant conversations before the room breaks into smaller build circles.`
  };
}

function buildIdea(theme, session, attendee, cityContext, index) {
  const prefixes = ['Red Line', 'Kendall', 'After-hours'];
  return {
    title: `${prefixes[index] || 'Boston'} ${theme.split(' ').slice(0, 4).join(' ')} studio`,
    summary: `Turn ${session.title.toLowerCase()} into a small product concept inspired by ${attendee.name}'s work on ${attendee.project.toLowerCase()}.`,
    implementationAngle: `Start with a thin workflow: capture one real Boston-area use case, build the fastest useful prototype, and test it with meetup collaborators from ${attendee.neighborhood} after the event.`,
    suggestedStack: `Node.js, Express, lightweight UI, and one model-powered workflow grounded in ${cityContext.headline.toLowerCase()}`
  };
}

function getFallbackIdeas({ theme, attendees, sessions, cityContext }) {
  const normalizedTheme = String(theme || cityContext.meetupGoal).trim() || cityContext.meetupGoal;
  const ideas = [0, 1, 2].map((index) =>
    buildIdea(
      normalizedTheme,
      sessions[index % sessions.length],
      attendees[index % attendees.length],
      cityContext,
      index
    )
  );

  return { ideas };
}

module.exports = {
  getFallbackMatch,
  getFallbackIdeas
};
