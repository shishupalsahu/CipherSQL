const express = require('express');
const router = express.Router();
const { getAllAssignments, getAssignmentById } = require('../controllers/assignmentController');

// Route to get all assignments
// This will map to: GET /api/assignments/
router.get('/', getAllAssignments);

// Route to get a specific assignment by ID
// This will map to: GET /api/assignments/:id
router.get('/:id', getAssignmentById);

module.exports = router;