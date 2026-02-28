const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  question: {
    type: String,
    required: true, // The actual task, e.g., "Find all users older than 30."
  },
  // This is what we show the user on the frontend so they know the table structure
  sampleDataViewer: {
    type: String, 
    required: true, // Example: "Table: Users \n Columns: id (int), name (varchar), age (int)"
  },
  // This is the actual SQL script we run behind the scenes in PostgreSQL to set up their sandbox
  setupSql: {
    type: String,
    required: true, // Example: "CREATE TABLE users (id INT...); INSERT INTO users..."
  },
  // The expected solution query (useful for validation or the LLM prompt later)
  solutionSql: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);