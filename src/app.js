const express = require('express');
const path = require('path');
const { createDataRouter } = require('./routes/data');
const { createHealthRouter } = require('./routes/health');
const { createMatchRouter } = require('./routes/match');
const { createIdeasRouter } = require('./routes/ideas');

function createApp(options = {}) {
  const app = express();
  const publicDir = options.publicDir || path.join(__dirname, '..', 'public');

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  app.use(express.static(publicDir));

  app.use('/healthz', createHealthRouter(options));
  app.use('/api/data', createDataRouter(options));
  app.use('/api/match', createMatchRouter(options));
  app.use('/api/ideas', createIdeasRouter(options));

  app.use((error, req, res, next) => {
    if (error && error.type === 'entity.parse.failed') {
      res.status(400).json({
        error: 'Invalid JSON body.'
      });
      return;
    }

    next(error);
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({
      error: 'API route not found.'
    });
  });

  app.use((error, req, res, next) => {
    if (!error) {
      next();
      return;
    }

    if (req.path.startsWith('/api') || req.path === '/healthz') {
      res.status(error.statusCode || 500).json({
        error: error.message || 'Unexpected server error.'
      });
      return;
    }

    next(error);
  });

  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  return app;
}

module.exports = {
  createApp
};
