import React, { useState, useRef, useEffect } from "react";
import { FaHeartbeat, FaUserCircle, FaChevronDown, FaHome, FaFileAlt, FaPills, FaBell, FaHistory, FaBars, FaTimes, FaComments } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getParentInfo } from "../api/parent/ProfileApi";
import { useAvatar } from "../context/AvatarContext";
import NotificationIcon from "./NotificationIcon";
import ChatNotificationBadge from "./ChatNotificationBadge";
import styles from "./Header.module.css";

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
      icon: <div className={styles.chatIconContainer}>
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
      <div className={styles.parentMenu}>
        {/* Desktop menu - menu ngang */}
        <nav className={`${styles.parentMenuDesktop} d-none d-md-flex`}>
          {parentMenuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`${styles.parentMenuLink}${location.pathname === item.path ? ` ${styles.active}` : ''}`}
            >
              <i className={styles.parentMenuIcon}>{item.icon}</i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button */}
        <div className={`${styles.parentMenuMobile} d-md-none`}>
          <button
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className={styles.mobileDropdown}>
              {parentMenuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  className={`${styles.mobileDropdownItem}${location.pathname === item.path ? ` ${styles.active}` : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={styles.mobileMenuIcon}>{item.icon}</i>
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
    <header className={styles.appHeader}>
      {/* Left: Logo (hiển thị cho tất cả role) */}
      {user?.role === "parent" && (
        <div className={styles.appHeaderLeft}>
          <div className={styles.appHeaderLogo}>
            <FaHeartbeat className={styles.headerLogoIcon} />
            <span className={styles.headerLogoText}>School Health</span>
          </div>
        </div>
      )}
      {/* Center: Navigation (chỉ cho parent) */}
      <div className={styles.appHeaderCenter}>
        {renderParentNavigation()}
      </div>

      {/* Right: Account user dropdown */}
      <div className={styles.appHeaderRight}>
        <div className={styles.appHeaderAccount} ref={dropdownRef}>
          <div
            className={styles.accountTrigger}
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            <img
              src={parentInfo.imageUrl}
              alt="Avatar"
              className={styles.accountAvatar}
            />
            <FaChevronDown
              className={`${styles.accountArrow} ${showAccountDropdown ? styles.rotated : ""}`}
            />
          </div>
          {showAccountDropdown && (
            <div className={styles.accountDropdown}>
              {accountMenuItems.map((item, idx) =>
                item.type === "divider" ? (
                  <hr key={idx} className={styles.dropdownDivider} />
                ) : (
                  <div
                    key={item.key}
                    className={styles.accountDropdownItem}
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
