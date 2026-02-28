const express = require('express');
const router = express.Router();
const { executeQuery } = require('../controllers/queryController');

// Route to execute a SQL query
// This will map to: POST /api/query/execute
router.post('/execute', executeQuery);

module.exports = router;