import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    FaCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Không render sidebar cho parent
    if (!user?.role || user.role === 'parent') return null;

    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const collapsed = props.collapsed !== undefined ? props.collapsed : internalCollapsed;
    const setCollapsed = props.setCollapsed !== undefined ? props.setCollapsed : setInternalCollapsed;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Menu cho admin/nurse - Fixed paths to match App.jsx routes
    let menuItems = [];
    if (user.role === 'admin') {
        menuItems = [
            { path: '/admin', icon: <FaHome />, label: 'Dashboard' },
            { path: '/admin/accounts', icon: <FaUserShield />, label: 'Quản lý tài khoản' },
            { path: '/admin/categories', icon: <FaList />, label: 'Danh mục' },
            { path: '/admin/medicines/inventory', icon: <FaBoxes />, label: 'Kho thuốc' },
            { path: '/admin/medicines/plan', icon: <FaClipboardCheck />, label: 'Kế hoạch dùng thuốc' },
            { path: '/admin/medicines/requests', icon: <FaMedkit />, label: 'Yêu cầu cấp thuốc' },
            { path: '/admin/notification/management', icon: <FaBell />, label: 'Thông báo' },
            { path: '/admin/reports', icon: <FaFileAlt />, label: 'Báo cáo thống kê' },
            { path: '/admin/profile', icon: <FaUserCog />, label: 'Hồ sơ cá nhân' },
            { path: '/admin/settings', icon: <FaCog />, label: 'Cài đặt' },
        ];
    } else if (user.role === 'nurse') {
        menuItems = [
            { path: '/nurse', icon: <FaHome />, label: 'Dashboard' },

            { path: '/nurse/receive-medicine', icon: <FaPills />, label: 'Nhận thuốc' },
            { path: '/nurse/health-events', icon: <FaCalendarAlt />, label: 'Sự kiện sức khỏe' },
            { path: '/nurse/profile', icon: <FaUserCog />, label: 'Hồ sơ cá nhân' },
            { path: '/nurse/settings', icon: <FaCog />, label: 'Cài đặt' },
        ];
    }

    return (
        <>
            {/* Toggle button cho admin/nurse */}
            <button
                className={`app-sidebar-toggle-btn${collapsed ? '' : ' expanded'}`}
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
                <span style={{ fontSize: 22, color: user.role === 'nurse' ? '#ff6b6b' : '#1e3a5f', transition: 'transform 0.3s', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                    <FaChevronLeft />
                </span>
            </button>

            <div id="sidebar" className={`${user.role} ${collapsed ? '' : 'expand'}`.trim()}>
                {/* Logo */}
                <div className="app-sidebar-logo">
                    <FaHeartbeat style={{ fontSize: '2.2rem', color: '#fff' }} />
                    {!collapsed && (
                        <span className="sidebar-logo-text">School Health</span>
                    )}
                </div>

                {/* Menu Items */}
                <nav className="app-sidebar-nav">
                    <ul>
                        {menuItems.map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    to={item.path}
                                    className={`app-sidebar-link${location.pathname === item.path ? ' active' : ''}`}
                                >
                                    <i className="sidebar-link-icon">{item.icon}</i>
                                    <span className="sidebar-link-text">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="app-sidebar-footer">
                    <button
                        className="app-sidebar-link logout-btn"
                        onClick={handleLogout}
                    >
                        <i className="sidebar-link-icon"><FaSignOutAlt /></i>
                        <span className="sidebar-link-text">Đăng xuất</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar; 