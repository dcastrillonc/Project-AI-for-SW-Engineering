const express = require('express');
const router = express.Router();
const { getLiveScores } = require('../utils/sportmonks');

router.get('/live-scores', async (req, res) => {
  try {
    const data = await getLiveScores();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live scores', error: error.toString() });
  }
});

module.exports = router;
