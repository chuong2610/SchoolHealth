import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import NurseDashboard from "./pages/nurse/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import HealthDeclaration from "./pages/parent/HealthDeclaration";
import Notifications from "./pages/parent/Notifications";
import HealthHistory from "./pages/parent/HealthHistory";
import SendMedicine from "./pages/parent/SendMedicine";
import Profile from "./pages/parent/Profile";
import Settings from "./pages/parent/Settings";
import BlogDetail from "./pages/parent/BlogDetail";
import { useNavigate } from "react-router-dom";
import StudentHome from "./pages/student/Home";
import HealthInfo from "./pages/student/HealthInfo";
import VaccinationHistory from "./pages/student/VaccinationHistory";
import HealthEvents from "./pages/student/HealthEvents";
import StudentProfile from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";
import StudentBlogDetail from "./pages/student/BlogDetail";
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
import Login from "./pages/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Route login KHÔNG bọc MainLayout */}
        <Route path="/login" element={<Login />} />
        {/* Các route khác bọc MainLayout */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route index element={<Navigate to="/parent/" replace />} />
                {/* Admin Routes */}
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

                {/* Nurse Routes */}
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

                {/* Parent Routes */}
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

                {/* Student Routes */}
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

                {/* Common Routes */}
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

function Logout() {
  const navigate = useNavigate();
  React.useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  }, [navigate]);
  return null;
}

export default App;
