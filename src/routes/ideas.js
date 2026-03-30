const express = require('express');
const { createIdeasService } = require('../services/ideas-service');

function createIdeasRouter(options = {}) {
  const ideasService = options.ideasService || createIdeasService(options);
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      if (req.body !== undefined && req.body !== null && (Array.isArray(req.body) || typeof req.body !== 'object')) {
        res.status(400).json({
          error: 'Request body must be a JSON object.'
        });
        return;
      }

      const ideas = await ideasService.getIdeas({ theme: req.body && req.body.theme });
      res.json(ideas);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        error: error.message || 'Unable to generate meetup ideas.'
      });
    }
  });

  return router;
}

module.exports = {
  createIdeasRouter
};
