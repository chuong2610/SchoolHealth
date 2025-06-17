import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login/Login";
import Unauthorized from "./pages/login/Unauthorized";
import CreateBlogPost from "./pages/admin/CreateBlogPost";
import BlogPostList from "./pages/admin/BlogPostList";
import EditBlogPost from "./pages/admin/EditBlogPost";

// import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.snow.css";
import EditProfile from "./pages/admin/EditProfile";
// import "quill/dist/quill.snow.css";

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Main Layout Route */}
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
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="settings" element={<AdminSettings />} />
              {/**Tạo blog post */}
              <Route path="createBlogPost" element={<CreateBlogPost />} />
              <Route path="/admin/blog-posts" element={<BlogPostList />} />
              <Route
                path="/admin/editBlogPost/:id"
                element={<EditBlogPost />}
              />
              {/**Kết thúc việc tạo blog post */}
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
              <Route path="health-check" element={<StudentHealthCheck />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
