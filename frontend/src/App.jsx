import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Accounts from "./pages/admin/Accounts";
import Categories from "./pages/admin/Categories";
import MedicinePlan from "./pages/admin/MedicinePlan";
import MedicineRequests from "./pages/admin/MedicineRequests";
import MedicineInventory from "./pages/admin/MedicineInventory";
import NotificationsManagement from "./pages/admin/NotificationsManagement";
import Reports from "./pages/admin/Reports";
import Notifications from "./pages/parent/Notifications";
import HealthHistory from "./pages/parent/HealthHistory";
import SendMedicine from "./pages/parent/SendMedicine";
import Profile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";
import BlogDetail from "./pages/parent/BlogDetail";
import MoreKnow from "./pages/parent/MoreKnow";
import StudentHealthCheck from "./pages/parent/StudentHealthCheck";
import HealthDeclaration from "./pages/parent/HealthDeclaration";

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
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

        <Route path="/" element={<MainLayout />}/>
          <Route index element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="categories" element={<Categories />} />
              <Route path="medicines/plan" element={<MedicinePlan />} />
              <Route path="medicines/requests" element={<MedicineRequests />} />
              <Route
                path="medicines/inventory"
                element={<MedicineInventory />}
              />
              <Route path="notification/management" element={<NotificationsManagement/>}/>
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Nurse Routes */}
          <Route element={<ProtectedRoute allowedRoles={["nurse"]} />}>
            <Route path="nurse">
              <Route index element={<NurseDashboard />} />
              <Route
                path="health-declaration"
                element={<NurseHealthDeclaration />}
              />
              <Route
                path="receive-medicine"
                element={<NurseReceiveMedicine />}
              />
              <Route path="health-events" element={<NurseHealthEvents />} />
              <Route path="profile" element={<NurseProfile />} />
              <Route path="settings" element={<NurseSettings />} />
            </Route>
          </Route>

          {/* Parent Routes */}
          <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
            <Route path="parent">
              <Route index element={<ParentDashboard />} />
              <Route
                path="health-declaration"
                element={<HealthDeclaration />}
              />
              <Route path="notifications" element={<Notifications />} />
              <Route path="health-history" element={<HealthHistory />} />
              <Route path="send-medicine" element={<SendMedicine />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="blog/:id" element={<BlogDetail />} />
              <Route path="more-know" element={<MoreKnow />} />
              <Route path="health-check" element={<StudentHealthCheck />} />
            </Route>
          </Route>

          {/* Student Routes
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="student">
              <Route index element={<StudentDashboard />} />
              <Route path="" element={<StudentHome />} />
              <Route path="health-info" element={<HealthInfo />} />
              <Route
                path="vaccination-history"
                element={<VaccinationHistory />}
              />
              <Route path="notifications" element={<Notifications />} />
              <Route path="health-events" element={<HealthEvents />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="settings" element={<StudentSettings />} />
              <Route path="blog/:id" element={<StudentBlogDetail />} />
            </Route>
          </Route> */}

          {/* Common Routes */}
          {/* <Route path="logout" element={<Logout />} /> */}
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
