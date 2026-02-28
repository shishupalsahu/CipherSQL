require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');

// Our dummy assignments
const seedAssignments = [
  {
    title: "Basic Select: Employee Directory",
    description: "Learn how to retrieve all data from a table.",
    difficulty: "Easy",
    question: "Write a query to fetch all columns for all employees in the company.",
    sampleDataViewer: "Table: employees\nColumns: id (INT), name (VARCHAR), department (VARCHAR), salary (INT)",
    setupSql: "DROP TABLE IF EXISTS employees; CREATE TABLE employees (id SERIAL PRIMARY KEY, name VARCHAR(100), department VARCHAR(50), salary INT); INSERT INTO employees (name, department, salary) VALUES ('Alice', 'HR', 60000), ('Bob', 'Engineering', 80000), ('Charlie', 'Sales', 50000);",
    solutionSql: "SELECT * FROM employees;"
  },
  {
    title: "Filtering: High Earners",
    description: "Practice filtering data using the WHERE clause.",
    difficulty: "Medium",
    question: "Write a query to find the names and salaries of employees who make strictly more than 60,000.",
    sampleDataViewer: "Table: employees\nColumns: id (INT), name (VARCHAR), department (VARCHAR), salary (INT)",
    setupSql: "DROP TABLE IF EXISTS employees; CREATE TABLE employees (id SERIAL PRIMARY KEY, name VARCHAR(100), department VARCHAR(50), salary INT); INSERT INTO employees (name, department, salary) VALUES ('Alice', 'HR', 60000), ('Bob', 'Engineering', 80000), ('Charlie', 'Sales', 50000), ('David', 'Engineering', 90000);",
    solutionSql: "SELECT name, salary FROM employees WHERE salary > 60000;"
  }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear out any existing assignments so we don't get duplicates if we run this twice
    await Assignment.deleteMany({}); 
    console.log('🗑️  Cleared old assignments');

    // Insert the new assignments
    await Assignment.insertMany(seedAssignments);
    console.log('🌱 Successfully seeded database with assignments!');

    // Close the connection so the script finishes
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();