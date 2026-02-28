const dns = require('dns');
// Yeh line aapke Wi-Fi ke block ko bypass karke seedha Google se address nikalegi
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();

// 1. PostgreSQL Connection (The SQL Sandbox)
const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pgPool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL (Sandbox DB)');
});

pgPool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// 2. MongoDB Connection (The Persistence DB)
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas (Persistence DB)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { pgPool, connectMongo };