const meetupData = require('../data/meetup-data');
const { getConfig } = require('../config');
const { buildIdeasPrompt } = require('./prompt-builders');
const { completeJson } = require('./openrouter');
const { getFallbackIdeas } = require('./fallback-service');
const { normalizeIdeasOutput } = require('../utils/validate-shapes');

function createUnavailableIdeasError(error) {
  const unavailableError = new Error('Idea generation is unavailable right now.');

  if (error && error.code === 'OPENROUTER_API_KEY_MISSING') {
    unavailableError.message = 'Idea generation is unavailable because OpenRouter is not configured and fallback mode is disabled.';
    unavailableError.statusCode = 503;
    unavailableError.code = 'IDEAS_UNAVAILABLE';
    return unavailableError;
  }

  if (error && error.code === 'OPENROUTER_HTTP_ERROR') {
    unavailableError.message = 'Idea generation is temporarily unavailable because the upstream model request failed.';
    unavailableError.statusCode = 502;
    unavailableError.code = 'IDEAS_UPSTREAM_ERROR';
    return unavailableError;
  }

  if (
    error &&
    ['JSON_PARSE_EMPTY', 'JSON_PARSE_INVALID', 'JSON_PARSE_TYPE', 'IDEAS_SHAPE_INVALID'].includes(error.code)
  ) {
    unavailableError.message = 'Idea generation is temporarily unavailable because the upstream response was invalid.';
    unavailableError.statusCode = 502;
    unavailableError.code = 'IDEAS_UPSTREAM_INVALID';
    return unavailableError;
  }

  unavailableError.statusCode = (error && error.statusCode) || 502;
  unavailableError.code = (error && error.code) || 'IDEAS_UPSTREAM_ERROR';
  return unavailableError;
}

function createIdeasService({
  data = meetupData,
  configProvider = getConfig,
  completeJsonImpl = completeJson,
  fallbackImpl = getFallbackIdeas
} = {}) {
  return {
    async getIdeas({ theme } = {}) {
      if (theme !== undefined && typeof theme !== 'string') {
        const error = new Error('theme must be a string when provided.');
        error.statusCode = 400;
        throw error;
      }

      const normalizedTheme = (theme || '').trim() || data.defaults.ideaTheme || data.themes[0];
      const prompt = buildIdeasPrompt({
        theme: normalizedTheme,
        attendees: data.attendees,
        sessions: data.sessions,
        cityContext: data.cityContext
      });
      const config = configProvider();

      if (config.openRouter.apiKey) {
        try {
          const result = await completeJsonImpl({
            systemPrompt: prompt.systemPrompt,
            userPrompt: prompt.userPrompt,
            purpose: 'meetup ideas'
          });
          const normalized = normalizeIdeasOutput(result.json, { minimumIdeas: 3 });

          return {
            ...normalized,
            model: result.model,
            source: 'openrouter'
          };
        } catch (error) {
          if (!config.allowFallbackAi) {
            throw createUnavailableIdeasError(error);
          }
        }
      }

      if (!config.allowFallbackAi) {
        throw createUnavailableIdeasError({ code: 'OPENROUTER_API_KEY_MISSING' });
      }

      const fallback = normalizeIdeasOutput(
        fallbackImpl({
          theme: normalizedTheme,
          attendees: data.attendees,
          sessions: data.sessions,
          cityContext: data.cityContext
        }),
        { minimumIdeas: 3 }
      );

      return {
        ...fallback,
        source: 'fallback'
      };
    }
  };
}

module.exports = {
  createIdeasService
};
