const { GoogleGenerativeAI } = require('@google/generative-ai');
const Assignment = require('../models/Assignment');

// Initialize the Gemini API with your key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate an intelligent hint based on the user's current query
// @route   POST /api/hint/generate
const generateHint = async (req, res) => {
  const { assignmentId, userQuery } = req.body;

  try {
    // 1. Fetch the assignment details so the AI knows what the user is trying to solve
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // 2. Select the Gemini model (Flash is fast and perfect for text tasks)
     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // 3. PROMPT ENGINEERING: This is where we strictly guide the AI's behavior
    const prompt = `
      You are an expert SQL tutor helping a student. 
      
      The student is trying to solve this problem: "${assignment.question}"
      The database schema is:
      ${assignment.sampleDataViewer}
      
      The student's current SQL query is: "${userQuery || 'They have not written any code yet.'}"
      
      Task: Provide a short, encouraging hint to help them figure out the next step.
      
      CRITICAL RULE: DO NOT provide the complete SQL solution. DO NOT write the final SELECT statement for them. Just point them in the right direction or explain a concept they might be missing.
    `;

    // 4. Send the prompt to Gemini and get the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send the hint back to the frontend
    res.json({ hint: text });

  } catch (error) {
    console.error('LLM Integration Error:', error);
    res.status(500).json({ error: "Server error while generating hint" });
  }
};

module.exports = { generateHint };