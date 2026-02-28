const express = require('express');
const router = express.Router();
const { generateHint } = require('../controllers/hintController');

// Route to generate a hint
// This will map to: POST /api/hint/generate
router.post('/generate', generateHint);

module.exports = router;