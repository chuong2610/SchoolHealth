import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Common styles
import './styles/common/index.css';
import './styles/common/main.css';
import './styles/common/dashboard.css';
import './styles/common/themes.css';
import './styles/common/sidebar.css';
import './styles/common/header.css';
import './styles/common/layout-fix.css';
import './styles/common/animations.css';

// Admin styles - Only keeping CSS for existing pages
import './styles/admin/accounts.css';


// Nurse styles - Clean modern design
import './styles/nurse/index.css';
import './styles/nurse/nurse-dashboard.css';
import './styles/nurse/nurse-profile.css';
import './styles/nurse/health-events-redesigned.css';
import './styles/nurse/nurse-receive-medicine-redesigned.css';

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
import './components/CustomTable.css';

import './fontawesome.js';

// Animation utilities
import './utils/animationUtils.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

