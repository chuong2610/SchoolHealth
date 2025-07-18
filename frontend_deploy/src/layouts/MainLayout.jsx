import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import footerStyles from "./Footer.module.css";
// Styles được import từ main.jsx

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // Sidebar mở rộng mặc định cho nurse, collapse cho admin
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Default to expanded for nurse, collapsed for admin
    return user?.role === 'admin';
  });
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

  // Parent role có layout riêng - Header cố định
  if (user?.role === 'parent') {
    return (
      <div className="parent-layout">
        {/* Header cố định cho parent */}
        <div className="parent-fixed-header">
          <Header onLogout={() => setShowLogoutModal(true)} />
        </div>

        {/* Content với margin-top để cách header */}
        <div className="parent-main-content">
          <Outlet />
        </div>

        {/* Footer for parent */}
        <footer className={footerStyles.footer}>
          <div className={footerStyles.container}>
            <div className={footerStyles.topRow}>
              <div className={footerStyles.col}>
                <h5 className={footerStyles.title}>Hệ thống Quản lý Y tế Học đường</h5>
                <p className={footerStyles.desc}>
                  Giải pháp quản lý y tế học đường toàn diện, giúp theo dõi và chăm sóc sức khỏe học sinh hiệu quả.
                </p>
              </div>
              <div className={footerStyles.col}>
                <h5 className={footerStyles.title}>Liên kết nhanh</h5>
                <ul className={footerStyles.linkList}>
                  <li><Link to="/about" className={footerStyles.link}>Giới thiệu</Link></li>
                  <li><Link to="/faq" className={footerStyles.link}>Câu hỏi thường gặp</Link></li>
                  <li><Link to="/privacy" className={footerStyles.link}>Chính sách bảo mật</Link></li>
                </ul>
              </div>
              <div className={footerStyles.col}>
                <h5 className={footerStyles.title}>Liên hệ</h5>
                <ul className={footerStyles.contactList}>
                  <li><FaMapMarkerAlt className={footerStyles.icon} /> 123 Đường ABC, Quận XYZ, TP.HCM</li>
                  <li><FaPhoneAlt className={footerStyles.icon} /> (028) 1234 5678</li>
                  <li><FaEnvelope className={footerStyles.icon} /> contact@schoolhealth.com</li>
                </ul>
              </div>
            </div>
            <hr className={footerStyles.divider} />
            <div className={footerStyles.bottomRow}>
              <div className={footerStyles.copyright}>
                &copy; 2024 Hệ thống Quản lý Y tế Học đường. All rights reserved.
              </div>
              <div className={footerStyles.socials}>
                <a href="#" className={footerStyles.social} aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" className={footerStyles.social} aria-label="Twitter"><FaTwitter /></a>
                <a href="#" className={footerStyles.social} aria-label="LinkedIn"><FaLinkedinIn /></a>
                <a href="#" className={footerStyles.social} aria-label="YouTube"><FaYoutube /></a>
              </div>
            </div>
          </div>
        </footer>

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
  }

  // Admin/Nurse với sidebar layout - Header trong .main
  return (
    <div className={`wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
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
