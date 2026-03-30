function describeSessions(sessions) {
  return sessions
    .map(
      (session) =>
        `- ${session.id}: ${session.time} | ${session.tag} | ${session.title} | ${session.description} | Speaker: ${session.speaker}`
    )
    .join('\n');
}

function describeAttendees(attendees) {
  return attendees
    .map(
      (attendee) =>
        `- ${attendee.id}: ${attendee.name} | ${attendee.role} | Focus: ${attendee.focus} | Project: ${attendee.project} | Looking for: ${attendee.lookingFor} | Neighborhood: ${attendee.neighborhood} | Context: ${attendee.context}`
    )
    .join('\n');
}

function buildMatchPrompt({ goal, attendees, sessions, cityContext }) {
  return {
    systemPrompt:
      'You are the Boston AI Tinkerers meetup scout. Return valid JSON only. Keep recommendations concrete, local, and concise.',
    userPrompt: [
      'Help a visitor navigate tonight\'s Boston AI Tinkerers meetup.',
      `Visitor goal: ${goal}`,
      `Boston context: ${cityContext.headline}. ${cityContext.summary} ${cityContext.transitNote}`,
      'Recommend the two best attendees and two best sessions for this person.',
      'Only use attendee IDs and session IDs from the lists below.',
      'Return JSON only with this exact shape:',
      '{"headline":"short title","recommendedAttendeeIds":["a1","a2"],"recommendedSessionIds":["s1","s2"],"reason":"1-3 sentence explanation grounded in the meetup context"}',
      'Attendees:',
      describeAttendees(attendees),
      'Sessions:',
      describeSessions(sessions)
    ].join('\n\n')
  };
}

function buildIdeasPrompt({ theme, attendees, sessions, cityContext }) {
  return {
    systemPrompt:
      'You are an energetic Boston meetup host who returns valid JSON only. Ideas should feel buildable after a local meetup conversation.',
    userPrompt: [
      'Generate Boston AI Tinkerers project ideas.',
      `Theme: ${theme}`,
      `Meetup context: ${cityContext.summary} Goal: ${cityContext.meetupGoal}`,
      'Use the attendee interests and session topics as inspiration, but do not mention private or hidden data.',
      'Return JSON only with this exact shape:',
      '{"ideas":[{"title":"...","summary":"...","implementationAngle":"...","suggestedStack":"optional short stack"}]}',
      'Return at least 3 ideas. Each idea must be specific enough that a visitor could start building tonight.',
      'Attendees:',
      describeAttendees(attendees),
      'Sessions:',
      describeSessions(sessions)
    ].join('\n\n')
  };
}

module.exports = {
  buildMatchPrompt,
  buildIdeasPrompt
};
