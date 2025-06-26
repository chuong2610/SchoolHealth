import React, { useState, useRef, useEffect } from 'react';
import { FaHeartbeat, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ParentMenu from './ParentMenu';
// Styles được import từ main.jsx

const Header = ({ onLogout }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const accountMenuItems = [
        { key: "profile", label: "Trang cá nhân" },
        { key: "settings", label: "Cài đặt" },
        { type: "divider" },
        { key: "logout", label: "Đăng xuất" },
    ];

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAccountDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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

    return (
        <header className="app-header">
            {/* Left: Logo (hiển thị cho tất cả role) */}
            {user?.role === 'parent' && (
                <div className="app-header-left">
                    <div className="app-header-logo">
                        <FaHeartbeat className="header-logo-icon" />
                        <span className="header-logo-text">School Health</span>
                    </div>
                </div>
            )}
            {/* Center: Parent menu (chỉ cho parent) */}
            <div className="app-header-center">
                {user?.role === 'parent' && <ParentMenu />}
            </div>

            {/* Right: Account user dropdown (Notification Bell is now integrated in ParentMenu) */}
            <div className="app-header-right">
                <div className="app-header-account" ref={dropdownRef}>
                    <div
                        className="account-trigger"
                        onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    >
                        <FaUserCircle className="account-avatar" />
                        <FaChevronDown
                            className={`account-arrow ${showAccountDropdown ? 'rotated' : ''}`}
                        />
                    </div>
                    {showAccountDropdown && (
                        <div className="account-dropdown">
                            {accountMenuItems.map((item, idx) =>
                                item.type === 'divider' ? (
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
