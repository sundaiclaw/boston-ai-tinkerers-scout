function normalizeBoolean(value, defaultValue) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function normalizePort(value, defaultPort = 8080) {
  if (value === undefined || value === null || value === '') {
    return defaultPort;
  }

  const parsed = Number.parseInt(String(value), 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return defaultPort;
  }

  return parsed;
}

function getConfig() {
  return {
    port: normalizePort(process.env.PORT, 8080),
    openRouter: {
      baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      model: process.env.OPENROUTER_MODEL || 'google/gemma-3-27b-it:free',
      apiKey: process.env.OPENROUTER_API_KEY || '',
      siteName: process.env.OPENROUTER_SITE_NAME || 'Boston AI Tinkerers',
      siteUrl: process.env.OPENROUTER_SITE_URL || ''
    },
    allowFallbackAi: normalizeBoolean(process.env.ALLOW_FALLBACK_AI, true)
  };
}

module.exports = {
  normalizePort,
  getConfig
};
