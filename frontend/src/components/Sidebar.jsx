import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaUserGraduate,
    FaUserFriends,
    FaUserNurse,
    FaUserShield,
    FaMedkit,
    FaHeartbeat,
    FaFileAlt,
    FaCog,
    FaBars,
    FaChevronLeft,
    FaSignOutAlt,
    FaBell,
    FaEnvelope,
    FaSearch,
    FaClipboardList,
    FaCalendarAlt,
    FaChartLine,
    FaBoxes,
    FaClipboardCheck,
    FaUserCog,
    FaList,
    FaHistory,
    FaPills
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getRoleStyles = () => {
        switch (user?.role) {
            case 'nurse':
                return {
                    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
                    textColor: '#000000',
                    shadow: '0 4px 20px rgba(255, 105, 180, 0.4)',
                    logoColor: '#000000'
                };
            case 'admin':
                return {
                    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5253 25%, #c44569 50%, #a03b5f 75%, #7f3254 100%)',
                    textColor: '#fff',
                    shadow: '0 4px 20px rgba(0, 0, 128, 0.4)',
                    logoColor: '#fff'
                };
            case 'parent':
                return {
                    gradient: 'linear-gradient(135deg, #006400 0%, #008000 100%)',
                    textColor: '#000000',
                    shadow: '0 4px 20px rgba(0, 100, 0, 0.4)',
                    logoColor: '#000000'
                };
            default:
                return {
                    gradient: 'linear-gradient(135deg, #000080 0%, #0000CD 100%)',
                    textColor: '#000000',
                    shadow: '0 4px 20px rgba(0, 0, 128, 0.4)',
                    logoColor: '#000000'
                };
        }
    };

    const styles = getRoleStyles();

    const getMenuItems = () => {
        const commonItems = [
            {
                path: `/${user?.role}/dashboard`,
                icon: <FaHome />,
                label: 'Dashboard'
            },
            {
                path: `/${user?.role}/profile`,
                icon: <FaUserCog />,
                label: 'Hồ sơ cá nhân'
            },
            {
                path: `/${user?.role}/settings`,
                icon: <FaCog />,
                label: 'Cài đặt'
            }
        ];

        const roleSpecificItems = {
            admin: [
                {
                    path: '/admin/accounts',
                    icon: <FaUserShield />,
                    label: 'Quản lý tài khoản'
                },
                {
                    path: '/admin/categories',
                    icon: <FaList />,
                    label: 'Danh mục'
                },
                {
                    path: '/admin/medicine-inventory',
                    icon: <FaBoxes />,
                    label: 'Kho thuốc'
                },
                {
                    path: '/admin/medicine-plan',
                    icon: <FaClipboardCheck />,
                    label: 'Kế hoạch dùng thuốc'
                },
                {
                    path: '/admin/medicine-requests',
                    icon: <FaMedkit />,
                    label: 'Yêu cầu cấp thuốc'
                },
                {
                    path: '/admin/notification/management',
                    icon: <FaBell />,
                    label: 'Thông báo'
                },
                {
                    path: '/admin/reports',
                    icon: <FaFileAlt />,
                    label: 'Báo cáo thống kê'
                }
            ],
            nurse: [
                // {
                //     path: '/nurse/health-declaration',
                //     icon: <FaFileAlt />,
                //     label: 'Khai báo sức khỏe'
                // },
                {
                    path: '/nurse/receive-medicine',
                    icon: <FaPills />,
                    label: 'Nhận thuốc'
                },
                {
                    path: '/nurse/health-events',
                    icon: <FaCalendarAlt />,
                    label: 'Sự kiện sức khỏe'
                }
            ],
            parent: [
                {
                    path: '/parent/health-declaration',
                    icon: <FaFileAlt />,
                    label: 'Khai báo sức khỏe'
                },
                {
                    path: '/parent/send-medicine',
                    icon: <FaPills />,
                    label: 'Gửi thuốc'
                },
                {
                    path: '/parent/health-history',
                    icon: <FaHistory />,
                    label: 'Lịch sử sức khỏe'
                },
                {
                    path: '/parent/notifications',
                    icon: <FaBell />,
                    label: 'Thông báo'
                }
            ]
        };

        return [...commonItems, ...(roleSpecificItems[user?.role] || [])];
    };

    const menuItems = getMenuItems();

    const isNurse = user?.role === 'nurse';

    // Xác định class cho sidebar theo role
    const roleClass = user?.role ? user.role : '';

    return (
        <>
            {isNurse && (
                <button
                    className={`sidebar-toggle-btn-nurse${collapsed ? '' : ' expanded'}`}
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                >
                    <span style={{ fontSize: 22, color: '#ff6b6b', transition: 'transform 0.3s', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                        {collapsed ? <FaChevronLeft /> : <FaChevronLeft />}
                    </span>
                </button>
            )}
            <div id="sidebar" className={`${roleClass}${collapsed ? '' : ' expand'}`}>
                {/* Logo */}
                <div className="sidebar-logo d-flex align-items-center justify-content-center">
                    <FaHeartbeat className="text-white" style={{ fontSize: '2.2rem', display: 'block' }} />
                    {!collapsed && (
                        <span className="ms-2 fw-bold">School Health</span>
                    )}
                </div>
                {/* Menu Items */}
                <nav className="sidebar-nav">
                    <ul>
                        {menuItems.map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    to={item.path}
                                    className={`sidebar-link${location.pathname === item.path ? ' active' : ''}`}
                                >
                                    <span style={{ fontSize: '1.3rem', minWidth: 28, width: 28, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginRight: 0 }}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* Logout Button */}
                <div className="sidebar-footer mt-auto">
                    <button
                        className="sidebar-link d-flex align-items-center w-100"
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                    >
                        <span style={{ fontSize: '1.3rem', minWidth: 32, width: 32, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginRight: 0 }}><FaSignOutAlt /></span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar; 