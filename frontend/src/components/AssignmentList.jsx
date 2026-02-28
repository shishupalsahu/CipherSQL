import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AssignmentList.scss';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch assignments from our Node.js backend
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/assignments');
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setError("Failed to load assignments. Is your backend server running?");
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <div className="assignment-list__message">Loading assignments...</div>;
  if (error) return <div className="assignment-list__message assignment-list__message--error">{error}</div>;

  return (
    <div className="assignment-list">
      <h2 className="assignment-list__title">Available Assignments</h2>
      <div className="assignment-list__grid">
        {assignments.map((assignment) => (
          // BEM Methodology: Block is 'assignment-card'
          <div key={assignment._id} className="assignment-card">
            <div className="assignment-card__header">
              <h3 className="assignment-card__title">{assignment.title}</h3>
              {/* BEM Modifier for difficulty colors */}
              <span className={`assignment-card__badge assignment-card__badge--${assignment.difficulty.toLowerCase()}`}>
                {assignment.difficulty}
              </span>
            </div>
            <p className="assignment-card__description">{assignment.description}</p>
            <Link to={`/attempt/${assignment._id}`} className="assignment-card__button">
              Attempt Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;