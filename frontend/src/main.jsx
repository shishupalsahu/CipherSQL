import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import our master SCSS file!
import './styles/main.scss'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);