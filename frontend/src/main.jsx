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

// Admin styles
import './styles/admin/index.css';
import './styles/admin/admin-core.css';
import './styles/admin/admin-theme-redesign.css';
import './styles/admin/admin-accounts-redesign.css';
import './styles/admin/admin-medicine-inventory-redesign.css';
import './styles/admin/admin-categories-redesign.css';
import './styles/admin/admin-medicine-plans-redesign.css';
import './styles/admin/admin-notifications-redesign.css';
import './styles/admin/admin-profile-redesign.css';
import './styles/admin/admin-reports-redesign.css';
import './styles/admin/admin-medicine-requests-redesign.css';
import './styles/admin/accounts-table.css';
import './styles/admin/accounts-modal.css';
import './styles/admin/accounts-modal-override.css';
import './styles/admin/category-table.css';
import './styles/admin/medicine-table.css';
import './styles/admin/plan-table.css';
import './styles/admin/notification-table.css';

// Nurse styles - Enhanced functionality
import './styles/nurse/index.css';
import './styles/nurse/nurse-core.css';
import './styles/nurse/nurse-dashboard.css';
import './styles/nurse/nurse-health-events.css';
import './styles/nurse/nurse-receive-medicine.css';
import './styles/nurse/nurse-pages.css';
import './styles/nurse/nurse-action-buttons-fix.css';

// Parent styles - White to Sea Blue Professional Theme
import './styles/parent/index.css';
import './styles/parent/parent-theme-redesign.css';
import './styles/parent/parent-dashboard-redesign.css';
import './styles/parent/parent-profile-redesign.css';
import './styles/parent/parent-notifications-redesign.css';
import './styles/parent/parent-health-redesign.css';

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

