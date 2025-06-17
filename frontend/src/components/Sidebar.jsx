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
                {
                    path: '/nurse/health-declaration',
                    icon: <FaFileAlt />,
                    label: 'Khai báo sức khỏe'
                },
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

    return (
        <div
            className="position-fixed h-100 d-flex flex-column"
            style={{
                width: collapsed ? '60px' : '250px',
                left: 0,
                top: 0,
                background: styles.gradient,
                boxShadow: styles.shadow,
                zIndex: 1000,
                transition: 'all 0.3s ease'
            }}
        >
            {/* Logo (không còn nút 3 gạch ở đây) */}
            <div className="border-bottom d-flex align-items-center justify-content-center"
                style={{ borderColor: 'rgba(255,255,255,0.3)', height: '56px', padding: 0, margin: 0 }}>
                <FaHeartbeat className="text-white" style={{ fontSize: '3.2rem', display: 'block' }} />
                {!collapsed && (
                    <span className="ms-3 text-white fw-bold" style={{ fontSize: '1.25rem' }}>School Health</span>
                )}
            </div>

            {/* Menu Items */}
            <ul className="nav flex-column mt-3">
                {menuItems.map((item, idx) => (
                    <li key={idx} className="nav-item mb-2">
                        <Link
                            to={item.path}
                            className={`nav-link d-flex align-items-center rounded-3 ${location.pathname === item.path ? 'active bg-white text-dark fw-bold' : 'text-white'}`}
                            style={{
                                fontSize: '1.1rem',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                textAlign: collapsed ? 'center' : 'left',
                                padding: collapsed ? '12px 0' : '12px 16px',
                                minWidth: 0
                            }}
                        >
                            <span style={{
                                fontSize: '1.3rem',
                                minWidth: 28,
                                width: 28,
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: collapsed ? 0 : 12
                            }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Logout Button */}
            <div className="mt-auto p-4 border-top">
                <button
                    className="btn btn-link text-white d-flex align-items-center w-100 justify-content-center"
                    onClick={handleLogout}
                    style={{ fontSize: '1.2rem', padding: collapsed ? '12px 0' : '12px 16px' }}
                >
                    <span style={{ fontSize: '1.3rem', minWidth: 32, width: 32, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginRight: collapsed ? 0 : 12 }}><FaSignOutAlt /></span>
                    {!collapsed && <span style={{ fontSize: '1rem' }}>Đăng xuất</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 