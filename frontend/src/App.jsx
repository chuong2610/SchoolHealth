import React from "react";

import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
  Outlet,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import NurseDashboard from "./pages/nurse/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";
import HealthDeclaration from "./pages/parent/HealthDeclaration";
import Notifications from "./pages/parent/Notifications";
import HealthHistory from "./pages/parent/HealthHistory";
import SendMedicine from "./pages/parent/SendMedicine";
import Profile from "./pages/parent/Profile";
import Settings from "./pages/parent/Settings";
import BlogDetail from "./pages/parent/BlogDetail";
import { useNavigate } from "react-router-dom";
import NurseHealthDeclaration from "./pages/nurse/HealthDeclaration";
import NurseReceiveMedicine from "./pages/nurse/ReceiveMedicine";
import NurseHealthEvents from "./pages/nurse/HealthEvents";
import NurseProfile from "./pages/nurse/Profile";
import NurseSettings from "./pages/nurse/Settings";
import Categories from "./pages/admin/Categories";
import MedicinePlan from "./pages/admin/MedicinePlan";
import MedicineRequests from "./pages/admin/MedicineRequests";
import MedicineInventory from "./pages/admin/MedicineInventory";
import Reports from "./pages/admin/Reports";
import User from "./pages/admin/User";
import Accounts from "./pages/admin/Accounts";
import AdminProfile from "./pages/admin/Profile";
import AdminSettings from "./pages/admin/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import StudentHealthCheck from "./pages/parent/StudentHealthCheck";
import "bootstrap/dist/css/bootstrap.min.css";

import MoreKnow from "./pages/parent/MoreKnow";
import About from "./pages/parent/About";
import Contact from "./pages/parent/Contact";
import FAQ from "./pages/parent/FAQ";
import Privacy from "./pages/parent/Privacy";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login/Login";
import Unauthorized from "./pages/login/Unauthorized";
import NotificationsManagement from "./pages/admin/NotificationsManagement";

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/login" replace />} />

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
}

export default App;
