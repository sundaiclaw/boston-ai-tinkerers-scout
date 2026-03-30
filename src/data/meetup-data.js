const meetupData = {
  hero: {
    title: 'Boston AI Tinkerers',
    subtitle:
      'A Kendall Square meetup for local builders shipping scrappy, useful, and occasionally weird AI products.',
    venue: 'CIC Cambridge · Venture Café Forum Room',
    neighborhood: 'Kendall Square',
    dateLabel: 'Thursday · 6:30 PM · Cambridge, MA',
    communityNote:
      'Bring the prototype, the unfinished notebook, or the half-working agent. This room is for people who like turning demos into collaborations.'
  },
  stats: [
    { label: 'Builders expected', value: '80+' },
    { label: 'Live demos tonight', value: '6' },
    { label: 'Neighborhoods represented', value: '11' }
  ],
  sessions: [
    {
      id: 's1',
      time: '6:30 PM',
      tag: 'Opening loop',
      title: 'Lightning demos from the floor',
      description:
        'Boston builders show rough but real prototypes: voice agents, eval tooling, lab copilots, and local-first assistants that can survive a bad Wi‑Fi night.',
      speaker: 'Hosted by the Boston AI Tinkerers volunteer crew',
      demoDetails: 'Six two-minute demos with instant follow-up intros for anyone who wants to jam after the talks.',
      location: 'Main room'
    },
    {
      id: 's2',
      time: '7:00 PM',
      tag: 'Problem swap',
      title: 'Open mic: what are you stuck on?',
      description:
        'Attendees trade bottlenecks around RAG quality, agent UX, evaluation, and actually getting people to use the thing you built.',
      speaker: 'Facilitated by Priya Raman',
      demoDetails: 'Three short prompts help visitors surface concrete asks instead of vague networking chatter.',
      location: 'Back lounge'
    },
    {
      id: 's3',
      time: '7:25 PM',
      tag: 'Builder talk',
      title: 'Local-first AI tools for real Boston workflows',
      description:
        'A practical talk on privacy-friendly deployment, edge inference, and why local institutions still need software that works on commuter-rail-grade connections.',
      speaker: 'Theo Alvarez · Edge ML engineer',
      demoDetails: 'Includes a walk-through of an offline retrieval demo running on a tiny GPU box.',
      location: 'Main room'
    },
    {
      id: 's4',
      time: '7:55 PM',
      tag: 'Collaboration',
      title: 'Project matchmaking circles',
      description:
        'Small-group intros for attendees looking for design partners, eval help, customer discovery buddies, or a fast post-meetup sprint team.',
      speaker: 'Maya Chen + community hosts',
      demoDetails: 'Each circle is organized around a concrete build goal so visitors leave with names, not just vibes.',
      location: 'Cafe tables'
    },
    {
      id: 's5',
      time: '8:25 PM',
      tag: 'Community demo',
      title: 'MIT, Harvard, and startup lab showcase',
      description:
        'A short lineup of prototypes from local research labs and startup teams translating new model capabilities into products people might actually adopt.',
      speaker: 'Rotating local teams',
      demoDetails: 'Expect fast demos, candid questions, and immediate “who should I meet next?” energy.',
      location: 'Main room'
    },
    {
      id: 's6',
      time: '8:50 PM',
      tag: 'After-hours',
      title: 'Cambridge-to-Somerville hack plan',
      description:
        'A last call for people heading to late-night build sessions, Red Line conversations, or coffee-fueled follow-up jams.',
      speaker: 'Open floor',
      demoDetails: 'The room turns meetup momentum into explicit next steps and shared notes.',
      location: 'Atrium + Slack handoff'
    }
  ],
  attendees: [
    {
      id: 'a1',
      name: 'Maya Chen',
      role: 'Product engineer · local-first tools',
      focus: 'Agent UX for people with messy real workflows',
      project: 'A voice-first debugging coach for customer support teams',
      lookingFor: 'Frontend collaborator who can make AI output feel trustworthy and calm',
      neighborhood: 'Somerville',
      vibe: 'Moves fast, loves crisp product feedback, and is happy to pair after the meetup.',
      context: 'Usually testing demos with service teams in Cambridge and downtown Boston.'
    },
    {
      id: 'a2',
      name: 'Theo Alvarez',
      role: 'Edge ML engineer',
      focus: 'Local inference, tiny GPU deployments, and resilient offline workflows',
      project: 'An offline retrieval toolkit for clinics, field teams, and hardware-constrained orgs',
      lookingFor: 'Operators or PMs with real low-connectivity user stories',
      neighborhood: 'Cambridge',
      vibe: 'Deeply practical, generous with infrastructure advice, and very into benchmark screenshots.',
      context: 'Spends most weeks bouncing between Kendall Square offices and Somerville hack nights.'
    },
    {
      id: 'a3',
      name: 'Priya Raman',
      role: 'Applied AI researcher',
      focus: 'AI for science tooling, knowledge capture, and lab collaboration',
      project: 'A lab-note summarizer that turns raw experiment logs into clean weekly briefs',
      lookingFor: 'A product-minded builder who can help move from “cool demo” to daily use',
      neighborhood: 'Allston',
      vibe: 'Thoughtful, systems-minded, and great at spotting where a workflow breaks down.',
      context: 'Collaborates with researchers around Longwood and MIT and wants tighter feedback loops.'
    },
    {
      id: 'a4',
      name: 'Jordan Reyes',
      role: 'Civic tech designer',
      focus: 'Public-interest workflows, multilingual assistants, and city service access',
      project: 'A neighborhood permit assistant for small businesses navigating Boston paperwork',
      lookingFor: 'Design partner or backend builder interested in trust and accessibility',
      neighborhood: 'Jamaica Plain',
      vibe: 'Warm connector energy with a bias toward useful, not flashy.',
      context: 'Often brings questions from community orgs and local service providers.'
    },
    {
      id: 'a5',
      name: 'Nina Patel',
      role: 'Creative technologist · voice + hardware',
      focus: 'Ambient interfaces, spoken interaction, and playful physical computing',
      project: 'An ambient standup bot that captures team blockers from short voice check-ins',
      lookingFor: 'Hardware hacker or audio engineer who likes building in public',
      neighborhood: 'Brookline',
      vibe: 'Energetic demo table magnet who makes prototypes feel inviting.',
      context: 'Shares experiments at pop-up maker events around Boston and Cambridge.'
    },
    {
      id: 'a6',
      name: 'Omar Hassan',
      role: 'Eval + safety lead',
      focus: 'Prompt stress-testing, agent evaluation, and failure-mode discovery',
      project: 'A red-team harness for agent workflows used by small product teams',
      lookingFor: 'Founder with a real user problem and enough traffic to break a model',
      neighborhood: 'Medford',
      vibe: 'Sharp, funny, and happiest when a prototype survives contact with reality.',
      context: 'Helps startup teams around Boston tighten reliability before shipping customer pilots.'
    },
    {
      id: 'a7',
      name: 'Elena Petrova',
      role: 'Bio + data engineer',
      focus: 'Scientific datasets, retrieval quality, and usable researcher tools',
      project: 'A citation-aware assistant for wet-lab teams reviewing prior experiments',
      lookingFor: 'Someone strong in product storytelling and onboarding',
      neighborhood: 'Watertown',
      vibe: 'Methodical builder who appreciates small but meaningful workflow wins.',
      context: 'Bridges biotech teams in Cambridge with more product-native builders in Boston.'
    },
    {
      id: 'a8',
      name: 'Samir Gupta',
      role: 'Founder · workflow automation',
      focus: 'Sales ops copilots, CRM cleanup, and agent workflows that save busy teams real hours',
      project: 'A meeting-to-follow-up copilot for tiny startups running lean',
      lookingFor: 'An eval partner and anyone with painful customer handoff workflows',
      neighborhood: 'South Boston',
      vibe: 'Startup-energy operator who wants sharp feedback and quick experiments.',
      context: 'Regular at Boston startup meetups and wants more technically opinionated collaborators.'
    }
  ],
  highlights: [
    {
      title: 'Demo tables worth orbiting',
      description: 'Expect a small crowd around local inference rigs, a civic-tech prototype, and a few gloriously unstable agent demos.'
    },
    {
      title: 'Best use of the room',
      description: 'Ask for one concrete intro, one workflow critique, and one possible post-meetup sprint partner.'
    },
    {
      title: 'What makes this meetup different',
      description: 'It is less conference, more workshop energy: local operators, researchers, and product builders in the same room.'
    }
  ],
  themes: [
    'Local-first AI tools for Boston communities',
    'Meetup demos that can turn into real products',
    'Agent workflows for labs, startups, and civic teams',
    'Reliable AI systems for messy human operations'
  ],
  cityContext: {
    headline: 'Built in Boston, pressure-tested by the room',
    summary:
      'Boston AI Tinkerers blends Kendall Square researchers, Cambridge startup operators, and neighborhood builders who care about useful software more than stagecraft.',
    neighborhoods: ['Cambridge', 'Somerville', 'Allston', 'Jamaica Plain', 'Brookline', 'South Boston'],
    transitNote: 'Most follow-up plans happen within one Red Line ride of the meetup.',
    meetupGoal:
      'Help visitors find the right people, the right demos, and at least one next build step before the night ends.'
  },
  norms: [
    'Show the half-built thing, not just the polished deck.',
    'Lead with a real user problem or workflow bottleneck.',
    'Trade intros that can become an actual working session next week.'
  ],
  collaborationPrompts: [
    'Who here has a workflow painful enough to justify a prototype?',
    'What could this room ship in a seven-day sprint?',
    'Which demo deserves a Red Line debrief and a shared repo tonight?'
  ],
  defaults: {
    matchGoal: 'Meet people building practical AI tools for real Boston users',
    ideaTheme: 'Meetup demos that can turn into real products'
  }
};

module.exports = meetupData;
