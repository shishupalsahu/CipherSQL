const Assignment = require('../models/Assignment');

// @desc    Get all assignments (for the listing page)
// @route   GET /api/assignments
const getAllAssignments = async (req, res) => {
  try {
    // We only need to send the basic info for the list, not the whole setup SQL
    const assignments = await Assignment.find({}).select('title description difficulty');
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error while fetching assignments' });
  }
};

// @desc    Get a single assignment by ID (for the attempt interface)
// @route   GET /api/assignments/:id
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ message: 'Server error while fetching assignment' });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById
};