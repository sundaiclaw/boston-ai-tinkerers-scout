const { getConfig } = require('../config');
const { parseJsonResponse } = require('../utils/parse-json');

function extractContent(payload) {
  const content = payload && payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (!part) {
          return '';
        }

        if (typeof part === 'string') {
          return part;
        }

        if (typeof part.text === 'string') {
          return part.text;
        }

        return '';
      })
      .join('');
  }

  return content;
}

async function completeJson({ systemPrompt, userPrompt, purpose }) {
  const config = getConfig();

  if (!config.openRouter.apiKey) {
    const error = new Error('OPENROUTER_API_KEY is not configured.');
    error.code = 'OPENROUTER_API_KEY_MISSING';
    throw error;
  }

  const headers = {
    Authorization: `Bearer ${config.openRouter.apiKey}`,
    'Content-Type': 'application/json'
  };

  if (config.openRouter.siteUrl) {
    headers['HTTP-Referer'] = config.openRouter.siteUrl;
  }

  if (config.openRouter.siteName) {
    headers['X-Title'] = config.openRouter.siteName;
  }

  const response = await fetch(`${config.openRouter.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.openRouter.model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`OpenRouter request failed (${response.status}): ${details}`);
    error.code = 'OPENROUTER_HTTP_ERROR';
    error.statusCode = 502;
    throw error;
  }

  const payload = await response.json();
  const rawContent = extractContent(payload);
  const json = parseJsonResponse(rawContent, purpose || 'OpenRouter response');

  return {
    json,
    model: payload.model || config.openRouter.model
  };
}

module.exports = {
  completeJson
};
