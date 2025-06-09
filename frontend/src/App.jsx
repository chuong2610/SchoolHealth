import React from "react";
<<<<<<< HEAD
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
=======
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
>>>>>>> e38f409ca73831a352442104dd035d145999f16c
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
<<<<<<< HEAD
import MoreKnow from "./pages/parent/MoreKnow";
import About from "./pages/parent/About";
import Contact from "./pages/parent/Contact";
import FAQ from "./pages/parent/FAQ";
import Privacy from "./pages/parent/Privacy";
=======
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Login from "./pages/login/Login";
import Unauthorized from "./pages/login/Unauthorized";
>>>>>>> e38f409ca73831a352442104dd035d145999f16c

function App() {
  return (
    <AuthProvider>
    <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
        {/* Các route khác bọc MainLayout */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route index element={<Navigate to="/parent/" replace />} />
                {/* Bắt đầu Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/accounts" element={<Accounts />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route
                  path="/admin/medicines/plan"
                  element={<MedicinePlan />}
                />
                <Route
                  path="/admin/medicines/requests"
                  element={<MedicineRequests />}
                />
                <Route
                  path="/admin/medicines/inventory"
                  element={<MedicineInventory />}
                />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                {/* Kết thúc Admin Routes */}

                {/* Bắt đầu Nurse Routes */}
                <Route path="/nurse/*" element={<NurseDashboard />} />
                <Route
                  path="/nurse/health-declaration"
                  element={<NurseHealthDeclaration />}
                />
                <Route
                  path="/nurse/receive-medicine"
                  element={<NurseReceiveMedicine />}
                />
                <Route
                  path="/nurse/health-events"
                  element={<NurseHealthEvents />}
                />
                <Route path="/nurse/profile" element={<NurseProfile />} />
                <Route path="/nurse/settings" element={<NurseSettings />} />
                {/* Kết thúc Nurse Routes */}

                {/* Bắt đầu Parent Routes */}
                <Route path="/parent/*" element={<ParentDashboard />} />
                <Route
                  path="/parent/health-declaration"
                  element={<HealthDeclaration />}
                />
                <Route
                  path="/parent/notifications"
                  element={<Notifications />}
                />
                <Route
                  path="/parent/health-history"
                  element={<HealthHistory />}
                />
                <Route
                  path="/parent/send-medicine"
                  element={<SendMedicine />}
                />
                <Route path="/parent/profile" element={<Profile />} />
                <Route path="/parent/settings" element={<Settings />} />
                <Route path="/parent/blog/:id" element={<BlogDetail />} />
                <Route path="/parent/more-know" element={<MoreKnow />} />
                {/* Kết thúc Parent Routes */}

                {/* Bắt đầu Student Routes */}
                <Route path="/student/*" element={<StudentDashboard />} />
                <Route path="/student" element={<StudentHome />} />
                <Route path="/student/health-info" element={<HealthInfo />} />
                <Route
                  path="/student/vaccination-history"
                  element={<VaccinationHistory />}
                />
                <Route
                  path="/student/notifications"
                  element={<Notifications />}
                />
                <Route
                  path="/student/health-events"
                  element={<HealthEvents />}
                />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/settings" element={<StudentSettings />} />
                <Route
                  path="/student/blog/:id"
                  element={<StudentBlogDetail />}
                />
                {/* Kết thúc Student Routes */}

                {/* Common Routes */}
                <Route path="/logout" element={<Logout />} />

                {/* Bắt đầu Routes cho footer */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Kết thúc Routes cho footer */}
              </Routes>
            </MainLayout>
          }
        />
=======
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Main Layout Route */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="categories" element={<Categories />} />
              <Route path="medicines/plan" element={<MedicinePlan />} />
              <Route path="medicines/requests" element={<MedicineRequests />} />
              <Route path="medicines/inventory" element={<MedicineInventory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Nurse Routes */}
          <Route element={<ProtectedRoute allowedRoles={['nurse']} />}>
            <Route path="nurse">
              <Route index element={<NurseDashboard />} />
              <Route path="health-declaration" element={<NurseHealthDeclaration />} />
              <Route path="receive-medicine" element={<NurseReceiveMedicine />} />
              <Route path="health-events" element={<NurseHealthEvents />} />
              <Route path="profile" element={<NurseProfile />} />
              <Route path="settings" element={<NurseSettings />} />
            </Route>
          </Route>

          {/* Parent Routes */}
          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route path="parent">
              <Route index element={<ParentDashboard />} />
              <Route path="health-declaration" element={<HealthDeclaration />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="health-history" element={<HealthHistory />} />
              <Route path="send-medicine" element={<SendMedicine />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="blog/:id" element={<BlogDetail />} />
              <Route path="health-check" element={<StudentHealthCheck />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
>>>>>>> e38f409ca73831a352442104dd035d145999f16c
      </Routes>
    </AuthProvider>
  );
}

export default App;