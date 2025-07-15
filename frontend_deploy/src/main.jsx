import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Common styles





// Admin styles - Only keeping CSS for existing pages



// Nurse styles - Clean modern design





// Parent styles - White to Sea Blue Professional Theme


// Login & Component specific styles
import './pages/login/Login.css';

// Sidebar CSS - Import last for highest priority
import './styles/common/sidebar.css';

import './fontawesome.js';

// Animation utilities
import './utils/animationUtils.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

