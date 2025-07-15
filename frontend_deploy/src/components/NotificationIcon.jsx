import React, { useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const NotificationIcon = ({ className = '' }) => {
    const { user } = useAuth();
    const { hasUnreadNotifications, connecting, demoMode } = useNotification();

    // Only show for parent role
    if (user?.role !== 'parent') {
        return <FaBell className={className} />;
    }

    // Create CSS for animations if not exists
    useEffect(() => {
        if (!document.getElementById('notification-icon-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-icon-styles';
            styleSheet.innerHTML = `
                @keyframes bellShakeMenu {
                    0%, 50%, 100% { transform: rotate(0deg); }
                    10%, 30% { transform: rotate(-8deg); }
                    20%, 40% { transform: rotate(8deg); }
                }

                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }

                .notification-icon-active {
                    color: #ef4444 !important;
                    animation: bellShakeMenu 1.5s ease-in-out infinite;
                    filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5));
                    transform-origin: center top;
                }

                .notification-icon-normal {
                    transition: all 0.3s ease;
                    color: inherit;
                }

                .notification-icon-connecting {
                    opacity: 0.7;
                    color: #6b7280 !important;
                }

                /* Menu link hover effects when notification is active */
                .parent-menu-link:hover .notification-icon-active,
                .mobile-dropdown-item:hover .notification-icon-active {
                    color: #dc2626 !important;
                    filter: drop-shadow(0 0 6px rgba(220, 38, 38, 0.7));
                }

                /* Mobile responsive styles */
                @media (max-width: 768px) {
                    .notification-icon-active {
                        animation: bellShakeMenu 1.2s ease-in-out infinite;
                    }
                    
                    .notification-red-dot-mobile {
                        top: -2px !important;
                        right: -2px !important;
                        width: 8px !important;
                        height: 8px !important;
                        border: 1.5px solid white !important;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }, []);

    const iconClass = `${className} ${connecting
        ? 'notification-icon-connecting'
        : hasUnreadNotifications
            ? 'notification-icon-active'
            : 'notification-icon-normal'
        }`;

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <FaBell className={iconClass} />

            {/* Red dot indicator */}
            {hasUnreadNotifications && (
                <span
                    className={window.innerWidth <= 768 ? 'notification-red-dot-mobile' : ''}
                    style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        width: '10px',
                        height: '10px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: '0 0 8px rgba(239, 68, 68, 0.8), 0 0 12px rgba(239, 68, 68, 0.4)',
                        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                        zIndex: 10
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                        }}
                    />
                </span>
            )}

            {/* Demo mode indicator */}
            {demoMode && (
                <span
                    style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        fontSize: '8px',
                        background: '#f59e0b',
                        color: 'white',
                        borderRadius: '2px',
                        padding: '1px 2px',
                        lineHeight: '1',
                        fontWeight: 'bold',
                        zIndex: 10,
                        border: '1px solid white'
                    }}
                >
                    D
                </span>
            )}
        </span>
    );
};

export default NotificationIcon; 