import React, { useEffect, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeartbeat, FaBars, FaUserCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { Dropdown, Button, Modal } from "antd";
import '../styles/parent-theme.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getMenuItems = (roleName) => {
    switch (roleName) {
      case "admin":
        return [
          { path: "/admin", label: "Dashboard", icon: "fas fa-chart-line" },
          { path: "/admin/accounts", label: "Người dùng", icon: "fas fa-users" },
          { path: "/admin/categories", label: "Danh mục", icon: "fas fa-list" },
          { path: "/admin/medicines/plan", label: "Kế hoạch thuốc", icon: "fas fa-calendar-check" },
          { path: "/admin/medicines/requests", label: "Yêu cầu thuốc", icon: "fas fa-shopping-cart" },
          { path: "/admin/medicines/inventory", label: "Kho thuốc", icon: "fas fa-boxes" },
          { path: "/admin/notification/management", label: "Thông báo", icon: "fa-solid fa-bell" },
          { path: "/admin/reports", label: "Báo cáo", icon: "fas fa-file-alt" },
        ];
      case "parent":
        return [
          { path: "/parent", label: "Trang chủ", icon: "fas fa-home" },
          { path: "/parent/health-declaration", label: "Khai báo y tế", icon: "fas fa-file-medical" },
          { path: "/parent/send-medicine", label: "Gửi thuốc", icon: "fas fa-pills" },
          { path: "/parent/notifications", label: "Thông báo", icon: "fas fa-bell" },
          { path: "/parent/health-history", label: "Lịch sử sức khỏe", icon: "fas fa-history" },
        ];
      case "student":
        return [
          { path: "/student", label: "Trang chủ", icon: "fas fa-home" },
          { path: "/student/health-info", label: "Thông tin sức khỏe", icon: "fas fa-user-friends" },
          { path: "/student/health-events", label: "Lịch sử sự kiện", icon: "fas fa-clipboard-list" },
          { path: "/student/vaccination-history", label: "Tiêm chủng & Khám sức khỏe", icon: "fas fa-syringe" },
          { path: "/student/notifications", label: "Thông báo", icon: "fas fa-bell" },
        ];
      case "nurse":
        return [
          { path: "/nurse", label: "Trang chủ", icon: "fas fa-home" },
          { path: "/nurse/receive-medicine", label: "Nhận thuốc", icon: "fas fa-pills" },
          { path: "/nurse/health-declaration", label: "Khai báo y tế", icon: "fas fa-file-medical" },
          { path: "/nurse/health-events", label: "Sự kiện y tế", icon: "fas fa-calendar-check" },
        ];
      default:
        return [{ path: "/", label: "Trang chủ", icon: "fas fa-home" }];
    }
  };

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);

  // Xác định className cho layout
  const isAdmin = user?.role === 'admin';
  const isParent = user?.role === 'parent';
  const layoutClass = isAdmin ? 'd-flex admin-theme admin-gradient-background' : 'd-flex';

  // Menu cho parent
  const parentMenu = [
    { path: '/parent', label: 'Trang chủ', icon: 'fas fa-home' },
    { path: '/parent/health-declaration', label: 'Khai báo y tế', icon: 'fas fa-file-medical' },
    { path: '/parent/send-medicine', label: 'Gửi thuốc', icon: 'fas fa-pills' },
    { path: '/parent/notifications', label: 'Thông báo', icon: 'fas fa-bell' },
    { path: '/parent/health-history', label: 'Lịch sử sức khỏe', icon: 'fas fa-history' },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate(`/${user.role}/profile`);
    } else if (key === "settings") {
      navigate(`/${user.role}/settings`);
    } else if (key === "logout") {
      setShowLogoutModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu cho account user (bỏ Đăng xuất nếu là parent)
  const accountMenuItems = isParent ? [
    { key: "profile", label: "Trang cá nhân" },
    { key: "settings", label: "Cài đặt" },
    { type: "divider" }
  ] : [
    { key: "profile", label: "Trang cá nhân" },
    { key: "settings", label: "Cài đặt" },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất" },
  ];

  return (
    <div className={isParent ? `parent-theme ${layoutClass}` : layoutClass}>
      {/* Sidebar */}
      {!isParent && (
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      )}

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: !isParent ? (sidebarCollapsed ? '80px' : '250px') : 0,
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <header
          className="header w-100 bg-white border-bottom"
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}
        >
          {/* Left: Logo + tên hệ thống */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 70 }}>
            <FaHeartbeat style={{ color: '#2563eb', fontSize: 40 }} />
            <span className="fw-bold fs-5" style={{ color: '#2563eb' }}>School Health</span>
          </div>
          {/* Right: Navigation menu + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {isParent && (
              <nav style={{ display: 'flex', gap: '24px' }}>
                {parentMenu.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={
                      location.pathname === item.path
                        ? 'fw-bold text-primary'
                        : 'text-dark'
                    }
                    style={{ textDecoration: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <i className={item.icon} style={{ marginRight: 4 }}></i>
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
            {/* Nút Đăng xuất cho parent */}
            {isParent && (
              <Button type="primary" danger onClick={() => setShowLogoutModal(true)}>
                Đăng xuất
              </Button>
            )}
            <Dropdown
              menu={{ items: accountMenuItems, onClick: handleMenuClick }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <FaUserCircle style={{ fontSize: '2rem', color: '#888', cursor: 'pointer' }} />
            </Dropdown>
          </div>
          <Modal
            open={showLogoutModal}
            onCancel={() => setShowLogoutModal(false)}
            title="Xác nhận đăng xuất"
            footer={[
              <Button key="cancel" onClick={() => setShowLogoutModal(false)}>
                Ở lại
              </Button>,
              <Button key="logout" type="primary" danger onClick={handleLogout}>
                Có
              </Button>
            ]}
            centered
          >
            <p>Bạn có muốn đăng xuất không?</p>
          </Modal>
        </header>

        {/* Main Content Wrapper */}
        <div style={{ marginTop: '80px', padding: '20px' }}>
          <main
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '30px',
              minHeight: 'calc(100vh - 150px)', // Adjust for header/footer
            }}
          >
            <Outlet />
          </main>
        </div>

        {/* Footer */}
        {user?.role === 'parent' && (
          <footer className="footer bg-white border-top">
            <div className="container">
              <div className="row py-4">
                <div className="col-md-4">
                  <h5 className="mb-3">Hệ thống Quản lý Y tế Học đường</h5>
                  <p className="text-muted mb-0">
                    Giải pháp quản lý y tế học đường toàn diện, giúp theo dõi và
                    chăm sóc sức khỏe học sinh hiệu quả.
                  </p>
                </div>
                <div className="col-md-4">
                  <h5 className="mb-3">Liên kết nhanh</h5>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/about" className="text-muted">
                        Giới thiệu
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-muted">
                        Liên hệ
                      </Link>
                    </li>
                    <li>
                      <Link to="/faq" className="text-muted">
                        Câu hỏi thường gặp
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="text-muted">
                        Chính sách bảo mật
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h5 className="mb-3">Liên hệ</h5>
                  <ul className="list-unstyled text-muted">
                    <li>
                      <i className="fas fa-map-marker-alt me-2"></i> 123 Đường ABC,
                      Quận XYZ, TP.HCM
                    </li>
                    <li>
                      <i className="fas fa-phone me-2"></i> (028) 1234 5678
                    </li>
                    <li>
                      <i className="fas fa-envelope me-2"></i>{" "}
                      contact@schoolhealth.com
                    </li>
                  </ul>
                </div>
              </div>
              <hr />
              <div className="row py-3">
                <div className="col-md-6 text-center text-md-start">
                  <p className="text-muted mb-0">
                    &copy; 2024 Hệ thống Quản lý Y tế Học đường. All rights
                    reserved.
                  </p>
                </div>
                <div className="col-md-6 text-center text-md-end">
                  <a href="#" className="text-muted me-3">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="text-muted me-3">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-muted me-3">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="text-muted">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
