import React from 'react';
import { FaComments } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ChatNotificationBadge = ({
    showIcon = true,
    iconSize = 'lg',
    style = {},
    className = ''
}) => {
    const { user, hasUnreadMessages, hasUnassignedMessages } = useAuth();

    // Determine if badge should be shown
    const shouldShowBadge = () => {
        // Get current role to avoid stale closure
        const currentRole = localStorage.getItem('role');

        if (currentRole?.toLowerCase() === 'nurse') {
            // Nurses: show badge if there are unread messages OR unassigned messages
            return hasUnreadMessages || hasUnassignedMessages;
        } else {
            // Parents/Admins: show badge only for unread messages
            return hasUnreadMessages;
        }
    };

    const showBadge = shouldShowBadge();

    // Debug logging for nurses
    const currentRole = localStorage.getItem('role');
    if (currentRole?.toLowerCase() === 'nurse') {
        console.log('👩‍⚕️ [NurseBadge] State:', {
            hasUnreadMessages,
            hasUnassignedMessages,
            showBadge,
            timestamp: new Date().toISOString()
        });

        // Extra debug: Check why hasUnassignedMessages might be false
        if (!hasUnassignedMessages) {
            console.log('❓ [NurseBadge] hasUnassignedMessages is FALSE - checking reasons...');
            console.log('❓ [NurseBadge] AuthContext state:', {
                'user exists': !!user,
                'user role': user?.role,
                'hasUnreadMessages': hasUnreadMessages,
                'hasUnassignedMessages': hasUnassignedMessages
            });
        }
    }

    // Get role-specific colors
    const getRoleColors = () => {
        const role = user?.role?.toLowerCase();

        switch (role) {
            case 'parent':
                return {
                    primary: '#2563eb',    // Parent primary blue
                    gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                };
            case 'nurse':
                return {
                    primary: '#667eea',    // Nurse primary purple
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                };
            case 'admin':
                return {
                    primary: '#059669',    // Admin primary emerald
                    gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                };
            default:
                return {
                    primary: '#6b7280',    // Default gray
                    gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
                };
        }
    };

    const roleColors = getRoleColors();

    return (
        <div
            className={`chat-icon-container ${showBadge ? 'has-unread' : ''} ${className}`}
            style={{
                position: 'relative',
                display: 'inline-block',
                ...style
            }}
        >
            {showIcon && (
                <FaComments
                    size={iconSize}
                    className={showBadge ? 'has-unread' : ''}
                    style={{
                        color: showBadge ? roleColors.primary : 'inherit',
                        transition: 'all 0.3s ease',
                        filter: showBadge ? `drop-shadow(0 0 8px ${roleColors.primary}60)` : 'none',
                        animation: showBadge ? 'pulse 2s infinite' : 'none'
                    }}
                />
            )}

            {/* Show red dot badge when there are unread messages */}
            {showBadge && (
                <div
                    className="chat-notification-badge"
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: roleColors.gradient,
                        color: 'white',
                        borderRadius: '50%',
                        minWidth: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '2px solid white',
                        boxShadow: `0 2px 8px ${roleColors.primary}50`,
                        animation: 'pulse 2s infinite',
                        zIndex: 10
                    }}
                >
                    •
                </div>
            )}
        </div>
    );
};

export default ChatNotificationBadge; 