Boston AI Tinkerers Scout is an AI meetup companion for people attending Boston AI Tinkerers.

What it does:
- Shows a seeded Boston AI Tinkerers event lineup with sessions, speakers, and logistics.
- Lets an attendee describe their interests and goals.
- Uses AI to recommend the best sessions, likely networking targets, and a meetup plan.

Who it's for:
- builders, founders, engineers, researchers, and curious attendees going to Boston AI Tinkerers events.

Core job:
- Help me decide what to attend and how to get value from the meetup.

Current alternative:
- People skim scattered meetup blurbs and improvise their plan, which makes it easy to miss the best sessions and conversations.

Key differentiator:
- It turns event info plus attendee intent into a concrete AI-generated meetup game plan.

AI integration:
- Server-side OpenRouter call using free model via OPENROUTER_BASE_URL, OPENROUTER_API_KEY, and OPENROUTER_MODEL.
- Fallback mode still returns deterministic recommendations if AI is unavailable.

Demo flow:
1. Open the seeded Boston AI Tinkerers event board.
2. Review sessions and speakers.
3. Enter attendee goals and interests.
4. Generate a personalized meetup plan.
5. Review recommended sessions, people to meet, and prep questions.

Tech stack suggestion:
- React + TypeScript frontend, Node/Express backend, Vite build, Bun runtime.

Change name:
- boston-ai-tinkerers-scout
