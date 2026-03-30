const express = require('express');
const meetupData = require('../data/meetup-data');

function createDataRouter({ data = meetupData } = {}) {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json(data);
  });

  return router;
}

module.exports = {
  createDataRouter
};
