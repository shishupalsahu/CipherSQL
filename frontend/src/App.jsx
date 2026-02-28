import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt'; // <-- NEW IMPORT

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header" style={{ padding: '1rem', backgroundColor: '#1e293b', color: 'white' }}>
          <div className="app-header__logo">
            <h1>CipherSQL</h1>
          </div>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            {/* Replace the placeholder with our real component! */}
            <Route path="/attempt/:id" element={<AssignmentAttempt />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;