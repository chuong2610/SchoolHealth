import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { FaComments, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import chatAPI from '../api/chatApi';
import chatSignalR from '../services/chatSignalR';

const ChatNotificationBadge = ({
    showIcon = true,
    iconSize = 'lg',
    badgeVariant = 'danger',
    style = {},
    className = '',
    refreshInterval = 30000 // 30 seconds
}) => {
    const { user } = useAuth();
    const [hasUnread, setHasUnread] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            checkUnreadMessages();
            setupRealTimeUpdates();

            // Reduced auto-refresh as backup (real-time is primary)
            const interval = setInterval(() => {
                checkUnreadMessages();
            }, refreshInterval * 2); // Doubled interval since we have real-time

            return () => {
                clearInterval(interval);
                cleanup();
            };
        }
    }, [user, refreshInterval]);

    const setupRealTimeUpdates = () => {
        // Listen for real-time message events to update notification badge
        chatSignalR.addEventListener('messageReceived', () => {
            checkUnreadMessages();
        });

        chatSignalR.addEventListener('messageAssigned', () => {
            checkUnreadMessages();
        });
    };

    const cleanup = () => {
        chatSignalR.removeEventListener('messageReceived', checkUnreadMessages);
        chatSignalR.removeEventListener('messageAssigned', checkUnreadMessages);
    };

    const checkUnreadMessages = async () => {
        if (!user?.id || isLoading) return;

        setIsLoading(true);
        try {
            const response = await chatAPI.hasUnreadMessages(user.id);
            setHasUnread(response?.hasUnread || false);
            setUnreadCount(response?.count || 0);
        } catch (error) {
            console.error('Error checking unread messages:', error);
            setHasUnread(false);
            setUnreadCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if no unread messages
    if (!hasUnread || unreadCount === 0) {
        return showIcon ? (
            <div className={`chat-notification-container ${className}`} style={style}>
                <FaComments size={iconSize} />
            </div>
        ) : null;
    }

    return (
        <div
            className={`chat-notification-container ${className}`}
            style={{
                position: 'relative',
                display: 'inline-block',
                ...style
            }}
        >
            {showIcon && <FaComments size={iconSize} />}

            <Badge
                bg={badgeVariant}
                style={{
                    position: 'absolute',
                    top: showIcon ? '-8px' : '0',
                    right: showIcon ? '-8px' : '0',
                    borderRadius: '50%',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    animation: 'pulse-notification 2s ease-in-out infinite',
                    boxShadow: '0 2px 8px rgba(220, 53, 69, 0.4)'
                }}
            >
                {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>

            <style>{`
        @keyframes pulse-notification {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.4);
          }
          50% { 
            transform: scale(1.1); 
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.6);
          }
        }
        
        .chat-notification-container:hover .badge {
          animation-play-state: paused;
          transform: scale(1.05);
        }
      `}</style>
        </div>
    );
};

export default ChatNotificationBadge; 