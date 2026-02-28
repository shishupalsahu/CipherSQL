const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectMongo, pgPool } = require('./config/db');

// Import Routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const queryRoutes = require('./routes/queryRoutes');
const hintRoutes = require('./routes/hintRoutes'); // <-- NEW: Import hint routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectMongo();

app.get('/api/health', async (req, res) => {
  try {
    const pgResult = await pgPool.query('SELECT NOW()');
    res.json({ status: 'Server is healthy! 🚀', postgres_time: pgResult.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database connection issue', details: err.message });
  }
});

// Use Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/hint', hintRoutes); // <-- NEW: Use hint routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});