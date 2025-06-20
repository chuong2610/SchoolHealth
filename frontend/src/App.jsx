import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
  Outlet,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginLayout from "./layouts/LoginLayout";
import Login from "./pages/login/Login";
import { useAuth } from "./context/AuthContext";
import AuthCallback from "./pages/login/AuthCallback";


// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAccounts from "./pages/admin/Accounts";
import AdminCategories from "./pages/admin/Categories";
import AdminMedicineInventory from "./pages/admin/MedicineInventory";
import AdminMedicinePlan from "./pages/admin/MedicinePlan";
import AdminMedicineRequests from "./pages/admin/MedicineRequests";
import AdminReports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/Profile";
import AdminSettings from "./pages/admin/Settings";
import NotificationsManagement from "./pages/admin/NotificationsManagement";

// Nurse Pages
import NurseDashboard from "./pages/nurse/Dashboard";

import NurseReceiveMedicine from "./pages/nurse/ReceiveMedicine";
import NurseHealthEvents from "./pages/nurse/HealthEvents";
import NurseProfile from "./pages/nurse/Profile";
import NurseSettings from "./pages/nurse/Settings";

// Parent Pages
import ParentDashboard from "./pages/parent/Dashboard";
import ParentHealthDeclaration from "./pages/parent/HealthDeclaration";
import ParentSendMedicine from "./pages/parent/SendMedicine";
import ParentHealthHistory from "./pages/parent/HealthHistory";
import ParentNotifications from "./pages/parent/Notifications";
import ParentProfile from "./pages/parent/Profile";
import ParentSettings from "./pages/parent/Settings";
import BlogDetail from "./pages/parent/BlogDetail";
import MoreKnow from "./pages/parent/MoreKnow";
import StudentHealthCheck from "./pages/parent/StudentHealthCheck";

// Public Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

// Styles
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/auth/google/callback" element={<AuthCallback />} />
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />} />
        <Route index element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="medicines/plan" element={<AdminMedicinePlan />} />
              <Route path="medicines/requests" element={<AdminMedicineRequests />} />
              <Route path="medicines/inventory" element={<AdminMedicineInventory />} />
              <Route path="notification/management" element={<NotificationsManagement />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Nurse Routes */}
          <Route element={<ProtectedRoute allowedRoles={["nurse"]} />}>
            <Route path="nurse">
              <Route index element={<NurseDashboard />} />

              <Route path="receive-medicine" element={<NurseReceiveMedicine />} />
              <Route path="health-events" element={<NurseHealthEvents />} />
              <Route path="profile" element={<NurseProfile />} />
              <Route path="settings" element={<NurseSettings />} />
            </Route>
          </Route>

          {/* Parent Routes */}
          <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
            <Route path="parent">
              <Route index element={<ParentDashboard />} />
              <Route path="health-declaration" element={<ParentHealthDeclaration />} />
              <Route path="notifications" element={<ParentNotifications />} />
              <Route path="health-history" element={<ParentHealthHistory />} />
              <Route path="send-medicine" element={<ParentSendMedicine />} />
              <Route path="profile" element={<ParentProfile />} />
              <Route path="settings" element={<ParentSettings />} />
              <Route path="blog/:id" element={<BlogDetail />} />
              <Route path="more-know" element={<MoreKnow />} />
              <Route path="health-check" element={<StudentHealthCheck />} />
            </Route>
          </Route>

          {/* Common Routes */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy" element={<Privacy />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
