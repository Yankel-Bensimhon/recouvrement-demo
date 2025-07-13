const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/google-api-key', (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_PLACES_API_KEY });
});

module.exports = router;
