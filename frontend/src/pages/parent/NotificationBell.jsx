import React, { useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { hasUnreadNotifications, markAsRead, connecting, demoMode } = useNotification();

    // Listen for refresh notifications event (when on notifications page)
    useEffect(() => {
        const handleRefreshNotifications = () => {
            // This will be handled by the Notifications component
        };

        window.addEventListener('refreshNotifications', handleRefreshNotifications);
        return () => {
            window.removeEventListener('refreshNotifications', handleRefreshNotifications);
        };
    }, []);

    // Only show for parent role
    if (user?.role !== 'parent') {
        return null;
    }

    const handleBellClick = async () => {
        // Navigate to notifications page without marking as read
        // Bell will only turn off when all notifications are confirmed/rejected
        navigate('/parent/notifications');
    };

    // Styles
    const styles = {
        container: {
            position: 'relative',
            marginRight: '1rem',
        },
        bell: {
            position: 'relative',
            background: 'transparent',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '50%',
            cursor: connecting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            color: hasUnreadNotifications ? '#f59e0b' : '#374151',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            opacity: connecting ? 0.7 : 1,
        },
        bellHover: {
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#3b82f6',
            transform: 'scale(1.05)',
        },
        bellIcon: {
            animation: hasUnreadNotifications ? 'bellShake 2s ease-in-out infinite' : 'none',
        },
        badge: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '12px',
            height: '12px',
            background: '#ef4444',
            borderRadius: '50%',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        badgePing: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: '#ef4444',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        },
        connectingIndicator: {
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '16px',
            height: '16px',
        },
        connectingSpinner: {
            width: '100%',
            height: '100%',
            border: '2px solid #e5e7eb',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
    };

    // Create CSS for animations
    useEffect(() => {
        if (!document.getElementById('notification-bell-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-bell-styles';
            styleSheet.innerHTML = `
        @keyframes bellShake {
          0%, 50%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-10deg); }
          20%, 40% { transform: rotate(10deg); }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .notification-bell-hover:hover {
          background: rgba(59, 130, 246, 0.1) !important;
          color: #3b82f6 !important;
          transform: scale(1.05) !important;
        }

        .notification-bell-hover:active {
          transform: scale(0.95) !important;
        }

        @media (max-width: 768px) {
          .notification-bell-mobile {
            width: 44px !important;
            height: 44px !important;
            font-size: 1.1rem !important;
            padding: 0.625rem !important;
          }
          
          .notification-badge-mobile {
            top: 6px !important;
            right: 6px !important;
            width: 10px !important;
            height: 10px !important;
          }
        }
      `;
            document.head.appendChild(styleSheet);
        }
    }, []);

    return (
        <div style={styles.container}>
            <button
                style={styles.bell}
                className={`notification-bell-hover ${window.innerWidth <= 768 ? 'notification-bell-mobile' : ''}`}
                onClick={handleBellClick}
                title={demoMode ? "🎭 Demo Mode - Notification Bell" : (hasUnreadNotifications ? "Bạn có thông báo mới" : "Thông báo")}
                disabled={connecting}
            >
                <FaBell
                    style={styles.bellIcon}
                    className="bell-icon"
                />

                {hasUnreadNotifications && (
                    <span
                        style={styles.badge}
                        className={window.innerWidth <= 768 ? 'notification-badge-mobile' : ''}
                    >
                        <span style={styles.badgePing}></span>
                    </span>
                )}

                {connecting && (
                    <div style={styles.connectingIndicator}>
                        <div style={styles.connectingSpinner}></div>
                    </div>
                )}

                {demoMode && (
                    <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '-8px',
                        fontSize: '10px',
                        background: '#f59e0b',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        lineHeight: '1',
                        fontWeight: 'bold',
                        zIndex: 10,
                        border: '1px solid white'
                    }}>
                        DEMO
                    </div>
                )}
            </button>
        </div>
    );
};

export default NotificationBell;