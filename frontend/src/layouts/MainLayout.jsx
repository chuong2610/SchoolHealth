import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
// Styles được import từ main.jsx

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  function CustomModal({ open, onCancel, title, children, footer }) {
    if (!open) return null;
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 2000, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 12, minWidth: 320, maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 24, position: 'relative' }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>{title}</div>
          <div>{children}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>{footer}</div>
          <button onClick={onCancel} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>&times;</button>
        </div>
      </div>
    );
  }

  // Parent role có layout riêng - Header full-width
  if (user?.role === 'parent') {
    return (
      <>
        {/* Header full-width cho parent */}
        <Header onLogout={() => setShowLogoutModal(true)} />

        {/* Content trực tiếp không wrapper */}
        <Outlet />

        {/* Logout Modal */}
        <CustomModal
          open={showLogoutModal}
          onCancel={() => setShowLogoutModal(false)}
          title="Xác nhận đăng xuất"
          footer={[
            <button key="cancel" onClick={() => setShowLogoutModal(false)} style={{ borderRadius: 6, padding: '6px 18px', background: '#eee', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Ở lại</button>,
            <button key="logout" onClick={handleLogout} style={{ borderRadius: 6, padding: '6px 18px', background: '#ff4d4f', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Có</button>
          ]}
        >
          <p>Bạn có muốn đăng xuất không?</p>
        </CustomModal>
      </>
    );
  }

  // Admin/Nurse với sidebar layout - Header trong .main
  return (
    <div className="wrapper">
      {/* Sidebar cho admin/nurse */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main container */}
      <div className="main">
        {/* Header bên trong .main để đồng bộ với sidebar */}
        <Header onLogout={() => setShowLogoutModal(true)} />

        {/* Main Content */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      {/* Logout Modal */}
      <CustomModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        title="Xác nhận đăng xuất"
        footer={[
          <button key="cancel" onClick={() => setShowLogoutModal(false)} style={{ borderRadius: 6, padding: '6px 18px', background: '#eee', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Ở lại</button>,
          <button key="logout" onClick={handleLogout} style={{ borderRadius: 6, padding: '6px 18px', background: '#ff4d4f', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Có</button>
        ]}
      >
        <p>Bạn có muốn đăng xuất không?</p>
      </CustomModal>
    </div>
  );
};

export default MainLayout;
