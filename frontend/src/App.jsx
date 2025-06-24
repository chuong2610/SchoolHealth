import React from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

// Layouts
import MainLayout from "./layouts/MainLayout";
import LoginLayout from "./layouts/LoginLayout";

// Auth Pages
import Login from "./pages/login/Login";
import AuthCallback from "./pages/login/AuthCallback";
import Unauthorized from "./pages/login/Unauthorized";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

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

// Styles
import "react-toastify/dist/ReactToastify.css";
import BlogPostList from "./pages/admin/BlogPostList";
import CreateBlogPost from "./pages/admin/CreateBlogPost";
import EditBlogPost from "./pages/admin/EditBlogPost";
import EditProfile from "./pages/admin/EditProfile";

// Google OAuth Configuration
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1059017246677-b4j4rqlgqvog2dnssqcn41ch8741npet.apps.googleusercontent.com";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/login" element={<LoginLayout />}>
              <Route index element={<Login />} />
            </Route>

            {/* Google OAuth Callback */}
            <Route path="/auth/google/callback" element={<AuthCallback />} />

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes with MainLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Admin Routes */}
                <Route path="admin">
                  <Route index element={<AdminDashboard />} />
                  <Route path="accounts" element={<AdminAccounts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route
                    path="medicines/plan"
                    element={<AdminMedicinePlan />}
                  />
                  <Route
                    path="medicines/requests"
                    element={<AdminMedicineRequests />}
                  />
                  <Route
                    path="medicines/inventory"
                    element={<AdminMedicineInventory />}
                  />
                  <Route
                    path="notification/management"
                    element={<NotificationsManagement />}
                  />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="blog-posts" element={<BlogPostList />} />
                  <Route path="create-blog" element={<CreateBlogPost />} />
                  <Route path="edit-blog/:id" element={<EditBlogPost />} />
                  <Route path="edit-profile" element={<EditProfile />} />
                </Route>

                {/* Nurse Routes */}
                <Route path="nurse">
                  <Route index element={<NurseDashboard />} />
                  <Route
                    path="receive-medicine"
                    element={<NurseReceiveMedicine />}
                  />
                  <Route path="health-events" element={<NurseHealthEvents />} />
                  <Route path="profile" element={<NurseProfile />} />
                  <Route path="settings" element={<NurseSettings />} />
                </Route>

                {/* Parent Routes */}
                <Route path="parent">
                  <Route index element={<ParentDashboard />} />
                  <Route
                    path="health-declaration"
                    element={<ParentHealthDeclaration />}
                  />
                  <Route
                    path="notifications"
                    element={<ParentNotifications />}
                  />
                  <Route
                    path="health-history"
                    element={<ParentHealthHistory />}
                  />
                  <Route
                    path="send-medicine"
                    element={<ParentSendMedicine />}
                  />
                  <Route path="profile" element={<ParentProfile />} />
                  <Route path="settings" element={<ParentSettings />} />
                  <Route path="blog/:id" element={<BlogDetail />} />
                  <Route path="more-know" element={<MoreKnow />} />
                  <Route path="health-check" element={<StudentHealthCheck />} />
                </Route>

                {/* Public Pages (accessible when logged in) */}
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy" element={<Privacy />} />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
