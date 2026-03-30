function stripJsonFences(value) {
  return value.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
}

function parseJsonResponse(rawValue, purpose = 'response') {
  if (rawValue === null || rawValue === undefined) {
    const error = new Error(`Missing ${purpose} payload.`);
    error.code = 'JSON_PARSE_EMPTY';
    throw error;
  }

  if (typeof rawValue === 'object') {
    return rawValue;
  }

  if (typeof rawValue !== 'string') {
    const error = new Error(`Unexpected ${purpose} payload type: ${typeof rawValue}.`);
    error.code = 'JSON_PARSE_TYPE';
    throw error;
  }

  const normalized = stripJsonFences(rawValue);

  if (!normalized) {
    const error = new Error(`Empty ${purpose} payload.`);
    error.code = 'JSON_PARSE_EMPTY';
    throw error;
  }

  try {
    return JSON.parse(normalized);
  } catch (parseError) {
    const error = new Error(`Invalid ${purpose} JSON: ${parseError.message}`);
    error.code = 'JSON_PARSE_INVALID';
    throw error;
  }
}

module.exports = {
  parseJsonResponse
};
