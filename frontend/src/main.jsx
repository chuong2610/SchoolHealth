import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Common styles
import './styles/common/index.css';
import './styles/common/main.css';


import './styles/common/sidebar.css';
import './styles/common/header.css';

import './styles/common/animations.css';

// Admin styles - Only keeping CSS for existing pages
import './styles/admin/accounts.css';


// Nurse styles - Clean modern design





// Parent styles - White to Sea Blue Professional Theme
import './styles/parent/index.css';
import './styles/parent/parent-theme-redesign.css';
import './styles/parent/parent-healthhistory-redesign.css';
import './styles/parent/parent-notifications-redesign.css';
import './styles/parent/parent-sendmedicine-redesign.css';
import './styles/parent/parent-dashboard-redesign.css';
import './styles/parent/parent-profile-redesign.css';
import './styles/parent/parent-health-redesign.css';
import './styles/parent/parent-healthdeclaration-redesign.css';

// Login & Component specific styles
import './pages/login/Login.css';


import './fontawesome.js';

// Animation utilities
import './utils/animationUtils.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

