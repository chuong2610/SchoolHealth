import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
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

// Admin styles
import './styles/admin/index.css';
import './styles/admin/admin-core.css';
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

// Parent styles
import './styles/parent/index.css';
import './styles/parent/parent-theme.css';

// Login & Component specific styles
import './pages/login/Login.css';
import './components/CustomTable.css';

import './fontawesome.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

