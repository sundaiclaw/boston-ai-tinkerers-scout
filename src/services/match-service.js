const meetupData = require('../data/meetup-data');
const { getConfig } = require('../config');
const { buildMatchPrompt } = require('./prompt-builders');
const { completeJson } = require('./openrouter');
const { getFallbackMatch } = require('./fallback-service');
const { normalizeMatchOutput } = require('../utils/validate-shapes');

function createUnavailableMatchError(error) {
  const unavailableError = new Error('AI matching is unavailable right now.');

  if (error && error.code === 'OPENROUTER_API_KEY_MISSING') {
    unavailableError.message = 'AI matching is unavailable because OpenRouter is not configured and fallback mode is disabled.';
    unavailableError.statusCode = 503;
    unavailableError.code = 'MATCH_UNAVAILABLE';
    return unavailableError;
  }

  if (error && error.code === 'OPENROUTER_HTTP_ERROR') {
    unavailableError.message = 'AI matching is temporarily unavailable because the upstream model request failed.';
    unavailableError.statusCode = 502;
    unavailableError.code = 'MATCH_UPSTREAM_ERROR';
    return unavailableError;
  }

  if (
    error &&
    ['JSON_PARSE_EMPTY', 'JSON_PARSE_INVALID', 'JSON_PARSE_TYPE', 'MATCH_SHAPE_INVALID'].includes(error.code)
  ) {
    unavailableError.message = 'AI matching is temporarily unavailable because the upstream response was invalid.';
    unavailableError.statusCode = 502;
    unavailableError.code = 'MATCH_UPSTREAM_INVALID';
    return unavailableError;
  }

  unavailableError.statusCode = (error && error.statusCode) || 502;
  unavailableError.code = (error && error.code) || 'MATCH_UPSTREAM_ERROR';
  return unavailableError;
}

function createMatchService({
  data = meetupData,
  configProvider = getConfig,
  completeJsonImpl = completeJson,
  fallbackImpl = getFallbackMatch
} = {}) {
  return {
    async getMatch({ goal } = {}) {
      if (goal !== undefined && typeof goal !== 'string') {
        const error = new Error('goal must be a string when provided.');
        error.statusCode = 400;
        throw error;
      }

      const normalizedGoal = (goal || '').trim() || data.defaults.matchGoal;
      const prompt = buildMatchPrompt({
        goal: normalizedGoal,
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
            purpose: 'meetup match'
          });

          const normalized = normalizeMatchOutput(result.json, {
            attendees: data.attendees,
            sessions: data.sessions
          });

          return {
            ...normalized,
            model: result.model,
            source: 'openrouter'
          };
        } catch (error) {
          if (!config.allowFallbackAi) {
            throw createUnavailableMatchError(error);
          }
        }
      }

      if (!config.allowFallbackAi) {
        throw createUnavailableMatchError({ code: 'OPENROUTER_API_KEY_MISSING' });
      }

      const fallback = normalizeMatchOutput(
        fallbackImpl({
          goal: normalizedGoal,
          attendees: data.attendees,
          sessions: data.sessions
        }),
        {
          attendees: data.attendees,
          sessions: data.sessions
        }
      );

      return {
        ...fallback,
        source: 'fallback'
      };
    }
  };
}

module.exports = {
  createMatchService
};
