import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFileAlt, FaPills, FaBell, FaHistory, FaBars, FaTimes, FaComments } from 'react-icons/fa';
import NotificationIcon from './NotificationIcon';
import ChatNotificationBadge from './ChatNotificationBadge';

const ParentMenu = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    ];

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

export default ParentMenu; 
