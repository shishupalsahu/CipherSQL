# 🚀 CipherSQL: AI-Powered SQL Tutor Platform

CipherSQL is a full-stack, full-stack educational platform designed to help students learn and practice SQL. It provides a secure sandbox to execute real PostgreSQL queries, complete with an integrated AI tutor that offers contextual hints without giving away the final answer.

## ✨ Key Features
* **Interactive Code Editor:** Features the Monaco Editor (the engine behind VS Code) for a professional SQL coding experience.
* **Live Query Execution Engine:** Securely connects to a PostgreSQL sandbox to execute student queries and return live data tables.
* **AI-Powered Tutor Hints:** Integrates the Google Gemini AI to analyze the student's current code and the database schema to provide targeted, encouraging hints using prompt engineering.
* **Dual-Database Architecture:** Uses MongoDB to persist assignment details/metadata and PostgreSQL as the active coding sandbox.
* **Responsive Mobile-First UI:** Built with React and Vanilla SCSS utilizing BEM naming conventions for a clean, scalable design across all devices.

## 🛠️ Tech Stack
* **Frontend:** React (Vite), React Router, Vanilla SCSS, Axios, `@monaco-editor/react`.
* **Backend:** Node.js, Express.js.
* **Databases:** MongoDB (Mongoose) for assignments, PostgreSQL (`pg`) for query execution.
* **AI Integration:** Google Gemini API (`@google/generative-ai`).

---

## ⚙️ Local Setup & Installation

To run this project locally, you will need **Node.js**, **PostgreSQL** installed on your machine, and a **MongoDB** cluster (or local instance).

### 1. Clone the Repository
\`\`\`bash
git clone : https://github.com/shishupalsahu/CipherSQL
cd CipherSQL
\`\`\`

### 2. Backend Setup
Navigate to the backend folder and install the dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

**Environment Variables:**
Create a `.env` file in the `backend` directory and add the following keys. *(Note: You must provide your own API keys and database credentials)*:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
PG_USER=postgres
PG_PASSWORD=your_postgres_password
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=postgres
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

**Seed the Database & Run Server:**
To automatically load the assignments into MongoDB, run:
\`\`\`bash
node seedAssignments.js
\`\`\`
Then, start the backend development server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

**Run the React App:**
\`\`\`bash
npm run dev
\`\`\`
The application will be available at `http://localhost:5173`.

---

## 🏛️ Architecture & Data Flow
1. **Frontend Request:** The React app fetches assignments from the Node.js API (MongoDB).
2. **Execution:** When a user executes a query, the backend `queryController` intercepts it, connects to the PostgreSQL pool, provisions the sandbox tables based on the assignment's setup SQL, and executes the user's code, returning the parsed rows.
3. **AI Hint Generation:** When a user requests a hint, the backend sends the assignment question, database schema, and the user's *current* SQL draft to the Gemini API with strict instructions to guide—not solve—the problem.
