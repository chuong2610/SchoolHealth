import React, { useState, useRef, useEffect } from "react";
import { FaHeartbeat, FaUserCircle, FaChevronDown, FaHome, FaFileAlt, FaPills, FaBell, FaHistory, FaBars, FaTimes, FaComments } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getParentInfo } from "../api/parent/ProfileApi";
import { useAvatar } from "../context/AvatarContext";
import NotificationIcon from "./NotificationIcon";
import ChatNotificationBadge from "./ChatNotificationBadge";
// Styles được import từ main.jsx

const Header = ({ onLogout }) => {
  const { user } = useAuth();
  const { avatarVersion } = useAvatar(); // lấy avatarVersion
  const navigate = useNavigate();
  const location = useLocation();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [parentInfo, setParentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    imageUrl: "",
    dateOfBirth: "",
    roleName: "Parent",
  });

  const accountMenuItems = [
    { key: "profile", label: "Trang cá nhân" },
    // { key: "settings", label: "Cài đặt" },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất" },
  ];

  // Parent navigation items
  const parentMenuItems = [
    { path: '/parent', icon: <FaHome />, label: 'Trang chủ' },
    { path: '/parent/health-declaration', icon: <FaFileAlt />, label: 'Khai báo sức khỏe' },
    { path: '/parent/send-medicine', icon: <FaPills />, label: 'Gửi thuốc' },
    {
      path: '/parent/chat',
      icon: <div className="chat-icon-container">
        <ChatNotificationBadge showIcon={true} iconSize="lg" />
      </div>,
      label: 'Tin nhắn tư vấn'
    },
    { path: '/parent/notifications', icon: <NotificationIcon />, label: 'Thông báo' },
    { path: '/parent/health-history', icon: <FaHistory />, label: 'Lịch sử sức khỏe' },
    {
      path: '/parent/consultation-appointments',
      icon: <FaComments />,
      label: 'Lịch hẹn tư vấn'
    },
  ];

  const fetchParentInfo = async () => {
    try {
      const res = await getParentInfo(user.id);
      if (res) {
        setParentInfo(res);
      } else {
        setParentInfo(parentInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchParentInfo(); // gọi lại khi avatarVersion thay đổi
  }, [avatarVersion]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate(`/${user.role}/profile`);
    } else if (key === "settings") {
      navigate(`/${user.role}/settings`);
    } else if (key === "logout") {
      onLogout();
    }
    setShowAccountDropdown(false);
  };

  // Render parent navigation
  const renderParentNavigation = () => {
    if (user?.role !== "parent") return null;

    return (
      <div className="parent-menu">
        {/* Desktop menu - menu ngang */}
        <nav className="parent-menu-desktop d-none d-md-flex">
          {parentMenuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`parent-menu-link menu-item${location.pathname === item.path ? ' active' : ''}`}
            >
              <i className="parent-menu-icon">{item.icon}</i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <div className="parent-menu-mobile d-md-none">
          <button
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="mobile-dropdown">
              {parentMenuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`mobile-dropdown-item menu-item${location.pathname === item.path ? ' active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="mobile-menu-icon">{item.icon}</i>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <header className="app-header">
      {/* Left: Logo (hiển thị cho tất cả role) */}
      {user?.role === "parent" && (
        <div className="app-header-left">
          <div className="app-header-logo">
            <FaHeartbeat className="header-logo-icon" />
            <span className="header-logo-text">School Health</span>
          </div>
        </div>
      )}
      {/* Center: Navigation (chỉ cho parent) */}
      <div className="app-header-center">
        {renderParentNavigation()}
      </div>

      {/* Right: Account user dropdown */}
      <div className="app-header-right">
        <div className="app-header-account" ref={dropdownRef}>
          <div
            className="account-trigger"
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            {/* <FaUserCircle className="account-avatar" /> */}
            <img
              src={parentInfo.imageUrl}
              alt="Avatar"
              className="account-avatar"
              style={{
                width: "30px",
                height: "30px",
                objectFit: "cover",
                overflow: "hidden",
              }}
            />
            <FaChevronDown
              className={`account-arrow ${showAccountDropdown ? "rotated" : ""
                }`}
            />
          </div>
          {showAccountDropdown && (
            <div className="account-dropdown">
              {accountMenuItems.map((item, idx) =>
                item.type === "divider" ? (
                  <hr key={idx} className="dropdown-divider" />
                ) : (
                  <div
                    key={item.key}
                    className="account-dropdown-item"
                    onClick={() => handleMenuClick({ key: item.key })}
                  >
                    {item.label}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
