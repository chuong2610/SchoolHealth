import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Styles được import từ main.jsx
import {
  FaHome,
  FaUserShield,
  FaMedkit,
  FaHeartbeat,
  FaFileAlt,
  FaCog,
  FaChevronLeft,
  FaSignOutAlt,
  FaBell,
  FaClipboardCheck,
  FaUserCog,
  FaList,
  FaPills,
  FaBoxes,
  FaCalendarAlt,
  FaComments,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ChatNotificationBadge from "./ChatNotificationBadge";

const Sidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Không render sidebar cho parent
  if (!user?.role || user.role === "parent") return null;

  // Responsive state management - Sidebar expanded by default for nurse
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const collapsed =
    props.collapsed !== undefined ? props.collapsed : internalCollapsed;
  const setCollapsed =
    props.setCollapsed !== undefined
      ? props.setCollapsed
      : setInternalCollapsed;

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);
      // On mobile, sidebar should be collapsed by default
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [collapsed, setCollapsed]);

  // Debug: Log state changes (commented out for production)
  // useEffect(() => {
  //     console.log('Sidebar state changed:', {
  //         collapsed,
  //         isMobile,
  //         userRole: user?.role,
  //         windowWidth: window.innerWidth
  //     });
  // }, [collapsed, isMobile, user?.role]);

  // Auto-close sidebar on mobile when clicking overlay
  const handleOverlayClick = useCallback(() => {
    if (isMobile && !collapsed) {
      setCollapsed(true);
    }
  }, [isMobile, collapsed, setCollapsed]);

  // Keyboard support for toggle
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isMobile && !collapsed) {
        setCollapsed(true);
      }
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed(!collapsed);
      }
    },
    [isMobile, collapsed, setCollapsed]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu cho admin/nurse - Fixed paths to match App.jsx routes
  let menuItems = [];
  if (user.role === "admin") {
    menuItems = [
      { path: "/admin", icon: <FaHome />, label: "Dashboard" },
      {
        path: "/admin/accounts",
        icon: <FaUserShield />,
        label: "Quản lý tài khoản",
      },

      {
        path: "/admin/medicines/inventory",
        icon: <FaBoxes />,
        label: "Kho thuốc",
      },

      // { path: '/admin/medicines/requests', icon: <FaMedkit />, label: 'Yêu cầu cấp thuốc' },
      {
        path: "/admin/notification/management",
        icon: <FaBell />,
        label: "Thông báo",
      },

      { path: "/admin/profile", icon: <FaUserCog />, label: "Hồ sơ cá nhân" },
      { path: "/admin/blog-posts", icon: <FaUserCog />, label: "Quản lý Blog" },
    ];
  } else if (user.role === "nurse") {
    menuItems = [
      { path: "/nurse", icon: <FaHome />, label: "Dashboard" },
      {
        path: "/nurse/receive-medicine",
        icon: <FaPills />,
        label: "Nhận thuốc",
      },
      {
        path: "/nurse/health-events",
        icon: <FaCalendarAlt />,
        label: "Sự kiện y tế",
      },
      {
        path: "/nurse/notification/management",
        icon: <FaBell />,
        label: "Lịch khám sức khỏe",
      },
      {
        path: "/nurse/consultation",
        icon: <FaCalendarAlt />,
        label: "Lịch tư vấn",
      },
      {
        path: "/nurse/chat",
        icon: (
          <div className="chat-icon-container">
            <ChatNotificationBadge showIcon={true} iconSize="lg" />
          </div>
        ),
        label: "Tư vấn sức khỏe",
      },
      { path: "/nurse/profile", icon: <FaUserCog />, label: "Hồ sơ cá nhân" },
    ];
  }

  return (
    <>
      {/* Overlay for mobile - Click to close sidebar */}
      {isMobile && !collapsed && (
        <div
          className="sidebar-mobile-overlay"
          onClick={handleOverlayClick}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 999,
            cursor: "pointer",
          }}
        />
      )}

      <div
        id="sidebar"
        className={`sidebar ${user.role} ${collapsed ? "" : "expand"}`.trim()}
        role="navigation"
        aria-label="Navigation chính"
      >
        {/* Header with Logo and Toggle */}
        <div className="app-sidebar-header">
          <div className="app-sidebar-logo">
            <FaHeartbeat style={{ fontSize: "2.2rem", color: "#fff" }} />
            {!collapsed && (
              <span className="sidebar-logo-text">School Health</span>
            )}
          </div>

          {/* Toggle button inside sidebar */}
          <button
            className="app-sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            type="button"
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Menu Items với improved accessibility */}
        <nav className="app-sidebar-nav" role="menu">
          <ul role="none">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none">
                <Link
                  to={item.path}
                  className={`app-sidebar-link menu-item${
                    location.pathname === item.path ? " active" : ""
                  }`}
                  role="menuitem"
                  aria-current={
                    location.pathname === item.path ? "page" : undefined
                  }
                  onClick={isMobile ? () => setCollapsed(true) : undefined}
                  title={item.label}
                  data-tooltip={item.label}
                >
                  <i className="sidebar-link-icon" aria-hidden="true">
                    {item.icon}
                  </i>
                  <span className="sidebar-link-text">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Enhanced Logout Button */}
        <div className="app-sidebar-footer">
          <button
            className="app-sidebar-link logout-btn"
            onClick={handleLogout}
            aria-label="Đăng xuất khỏi hệ thống"
            title="Đăng xuất"
            data-tooltip="Đăng xuất"
            type="button"
          >
            <i className="sidebar-link-icon" aria-hidden="true">
              <FaSignOutAlt />
            </i>
            <span className="sidebar-link-text">Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
