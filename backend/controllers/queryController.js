const { pgPool } = require('../config/db');
const Assignment = require('../models/Assignment');

// @desc    Execute user SQL query against the sandbox database
// @route   POST /api/query/execute
const executeQuery = async (req, res) => {
  const { assignmentId, userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: "SQL query cannot be empty" });
  }

  // 1. Basic Security/Sanitization
  const upperQuery = userQuery.toUpperCase();
  if (upperQuery.includes('DROP DATABASE') || upperQuery.includes('ALTER ROLE')) {
    return res.status(403).json({ error: "Action not permitted for security reasons." });
  }

  try {
    // 2. Fetch the assignment to get the setup SQL
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // 3. Get a dedicated connection from the pool
    const client = await pgPool.connect();

    try {
      // 4. Run the setup SQL first (creates tables and inserts sample data)
      await client.query(assignment.setupSql);

      // 5. Run the user's query
      const result = await client.query(userQuery);

      // 6. Send the successful results back to the frontend
      res.json({
        success: true,
        columns: result.fields.map(field => field.name), // Gets column headers
        rows: result.rows, // Gets the actual data
        rowCount: result.rowCount
      });
    } catch (dbError) {
      // If the user's SQL has a syntax error, we catch it and send it back safely
      res.status(400).json({ error: dbError.message });
    } finally {
      // 7. ALWAYS release the client back to the pool, even if there's an error
      client.release();
    }

  } catch (error) {
    console.error('Execution Engine Error:', error);
    res.status(500).json({ error: "Server error during execution" });
  }
};

module.exports = { executeQuery };