const express = require('express');
const { getConfig } = require('../config');

function createHealthRouter({ configProvider = getConfig } = {}) {
  const router = express.Router();

  router.get('/', (_req, res) => {
    const config = configProvider();
    res.json({
      status: 'ok',
      ok: true,
      service: 'boston-ai-tinkerers',
      fallbackEnabled: config.allowFallbackAi,
      openRouterConfigured: Boolean(config.openRouter.apiKey),
      model: config.openRouter.model,
      openRouterBaseUrl: config.openRouter.baseUrl
    });
  });

  return router;
}

module.exports = {
  createHealthRouter
};
