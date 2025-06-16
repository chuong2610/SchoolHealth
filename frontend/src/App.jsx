import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import LoginLayout from "./layouts/LoginLayout";
import Login from "./pages/login/Login";
import { useAuth } from "./context/AuthContext";

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

// Nurse Pages
import NurseDashboard from "./pages/nurse/Dashboard";
import NurseHealthDeclaration from "./pages/nurse/HealthDeclaration";
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

// Public Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";

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
      <Routes>
        {/* Public Routes */}
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/accounts" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminAccounts />
            </PrivateRoute>
          } />
          <Route path="/admin/categories" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminCategories />
            </PrivateRoute>
          } />
          <Route path="/admin/medicine-inventory" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminMedicineInventory />
            </PrivateRoute>
          } />
          <Route path="/admin/medicine-plan" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminMedicinePlan />
            </PrivateRoute>
          } />
          <Route path="/admin/medicine-requests" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminMedicineRequests />
            </PrivateRoute>
          } />
          <Route path="/admin/reports" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminReports />
            </PrivateRoute>
          } />
          <Route path="/admin/profile" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminProfile />
            </PrivateRoute>
          } />
          <Route path="/admin/settings" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminSettings />
            </PrivateRoute>
          } />

          {/* Nurse Routes */}
          <Route path="/nurse/dashboard" element={
            <PrivateRoute allowedRoles={['nurse']}>
              <NurseDashboard />
            </PrivateRoute>
          } />
          <Route path="/nurse/health-declaration" element={
            <PrivateRoute allowedRoles={['nurse']}>
              <NurseHealthDeclaration />
            </PrivateRoute>
          } />
          <Route path="/nurse/receive-medicine" element={
            <PrivateRoute allowedRoles={['nurse']}>
              <NurseReceiveMedicine />
            </PrivateRoute>
          } />
          <Route path="/nurse/health-events" element={
            <PrivateRoute allowedRoles={['nurse']}>
              <NurseHealthEvents />
            </PrivateRoute>
          } />
          <Route path="/nurse/profile" element={
            <PrivateRoute allowedRoles={['nurse']}>
              <NurseProfile />
            </PrivateRoute>
          } />
          <Route path="/nurse/settings" element={
            <PrivateRoute allowedRoles={['nurse']}>
              <NurseSettings />
            </PrivateRoute>
          } />

          {/* Parent Routes */}
          <Route path="/parent/dashboard" element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </PrivateRoute>
          } />
          <Route path="/parent/health-declaration" element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentHealthDeclaration />
            </PrivateRoute>
          } />
          <Route path="/parent/send-medicine" element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentSendMedicine />
            </PrivateRoute>
          } />
          <Route path="/parent/health-history" element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentHealthHistory />
            </PrivateRoute>
          } />
          <Route path="/parent/notifications" element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentNotifications />
            </PrivateRoute>
          } />
          <Route path="/parent/profile" element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentProfile />
            </PrivateRoute>
          } />
          <Route path="/parent/settings" element={
            <PrivateRoute allowedRoles={['parent']}>
              <ParentSettings />
            </PrivateRoute>
          } />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Redirect root to appropriate dashboard */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;