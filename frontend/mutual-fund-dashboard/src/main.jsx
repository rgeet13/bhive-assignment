// Import necessary dependencies
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import App from './App';
import Dashboard from './components/Dashboard';

// Render the application
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
      <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
