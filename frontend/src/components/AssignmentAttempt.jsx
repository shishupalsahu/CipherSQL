import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './AssignmentAttempt.scss';

const AssignmentAttempt = () => {
  const { id } = useParams(); // Gets the assignment ID from the URL
  const [assignment, setAssignment] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  
  // States for Execution and Results
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // States for AI Hints
  const [hint, setHint] = useState('');
  const [isFetchingHint, setIsFetchingHint] = useState(false);

  // 1. Fetch the specific assignment details on load
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/assignments/${id}`);
        setAssignment(response.data);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };
    fetchAssignment();
  }, [id]);

  // 2. Handle executing the SQL query
  const handleExecute = async () => {
    setIsExecuting(true);
    setQueryError(null);
    setQueryResult(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/query/execute', {
        assignmentId: id,
        userQuery: userQuery
      });
      setQueryResult(response.data);
    } catch (error) {
      // Display the SQL error returned from PostgreSQL
      setQueryError(error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsExecuting(false);
    }
  };

  // 3. Handle getting a hint from Gemini AI
  const handleGetHint = async () => {
    setIsFetchingHint(true);
    setHint('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/hint/generate', {
        assignmentId: id,
        userQuery: userQuery
      });
      setHint(response.data.hint);
    } catch (error) {
      setHint("Sorry, couldn't generate a hint right now. Try again!");
    } finally {
      setIsFetchingHint(false);
    }
  };

  if (!assignment) return <div className="attempt-layout__loading">Loading workspace...</div>;

  return (
    <div className="attempt-layout">
      {/* Top Navigation Bar */}
      <div className="attempt-layout__nav">
        <Link to="/" className="btn-back">← Back to Assignments</Link>
        <h2 className="attempt-layout__title">{assignment.title}</h2>
      </div>

      <div className="attempt-layout__grid">
        {/* LEFT COLUMN: Instructions and Data */}
        <div className="panel question-panel">
          <div className="panel__section">
            <h3>Task Details</h3>
            <p className="question-panel__text">{assignment.question}</p>
          </div>
          
          <div className="panel__section">
            <h3>Database Schema</h3>
            <pre className="schema-viewer">{assignment.sampleDataViewer}</pre>
          </div>
        </div>

        {/* RIGHT COLUMN: Editor and Results */}
        <div className="panel workspace-panel">
          <div className="workspace-panel__editor">
            {/* Monaco Editor Component */}
            <Editor 
              height="300px" 
              defaultLanguage="sql" 
              theme="vs-dark"
              value={userQuery}
              onChange={(value) => setUserQuery(value)}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          <div className="workspace-panel__actions">
            <button 
              className="btn btn--primary" 
              onClick={handleExecute} 
              disabled={isExecuting || !userQuery.trim()}
            >
              {isExecuting ? 'Running...' : '▶ Execute Query'}
            </button>
            <button 
              className="btn btn--secondary" 
              onClick={handleGetHint}
              disabled={isFetchingHint}
            >
              {isFetchingHint ? 'Thinking...' : '💡 Get Hint'}
            </button>
          </div>

          {/* AI Hint Display */}
          {hint && (
            <div className="hint-box">
              <h4>AI Tutor Hint:</h4>
              <p>{hint}</p>
            </div>
          )}

          {/* Error Display */}
          {queryError && (
            <div className="result-box result-box--error">
              <strong>Error:</strong> {queryError}
            </div>
          )}

          {/* Success Results Display */}
          {queryResult && (
            <div className="result-box result-box--success">
              <h4>Results ({queryResult.rowCount} rows returned)</h4>
              <div className="table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      {queryResult.columns.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {queryResult.columns.map((col, colIndex) => (
                          <td key={colIndex}>{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttempt;