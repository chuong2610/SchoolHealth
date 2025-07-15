import React, { useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import styles from './NotificationBell.module.css';

const NotificationBell = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { hasUnreadNotifications, markAsRead, connecting, demoMode } = useNotification();

    useEffect(() => {
        const handleRefreshNotifications = () => {
        };

        window.addEventListener('refreshNotifications', handleRefreshNotifications);
        return () => {
            window.removeEventListener('refreshNotifications', handleRefreshNotifications);
        };
    }, []);

    if (user?.role !== 'parent') {
        return null;
    }

    const handleBellClick = async () => {
        navigate('/parent/notifications');
    };

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
      `;
            document.head.appendChild(styleSheet);
        }
    }, []);

    return (
        <div className={styles.bellWrapper}>
            <button
                className={styles.bellButton}
                onClick={handleBellClick}
                title={demoMode ? "🎭 Demo Mode - Notification Bell" : (hasUnreadNotifications ? "Bạn có thông báo mới" : "Thông báo")}
                disabled={connecting}
            >
                <span className={hasUnreadNotifications ? styles.bellIconShake : styles.bellIcon}>
                    <FaBell />
                </span>
                {hasUnreadNotifications && (
                    <span className={styles.dotWrapper}>
                        <span className={styles.dot}></span>
                        <span className={styles.dotPing}></span>
                    </span>
                )}
                {connecting && (
                    <span className={styles.loadingSpinner}>
                        <span className={styles.spinner}></span>
                    </span>
                )}
                {demoMode && (
                    <span className={styles.demoBadge}>DEMO</span>
                )}
            </button>
        </div>
    );
};

export default NotificationBell;