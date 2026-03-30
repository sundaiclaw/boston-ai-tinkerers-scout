const express = require('express');
const { createMatchService } = require('../services/match-service');

function createMatchRouter(options = {}) {
  const matchService = options.matchService || createMatchService(options);
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      if (req.body !== undefined && req.body !== null && (Array.isArray(req.body) || typeof req.body !== 'object')) {
        res.status(400).json({
          error: 'Request body must be a JSON object.'
        });
        return;
      }

      const match = await matchService.getMatch({ goal: req.body && req.body.goal });
      res.json(match);
    } catch (error) {
      res.status(error.statusCode || 500).json({
        error: error.message || 'Unable to generate meetup match.'
      });
    }
  });

  return router;
}

module.exports = {
  createMatchRouter
};
