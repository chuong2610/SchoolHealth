import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

const NotificationContext = createContext(null);

// Demo mode flag - set to true for testing without backend
const DEMO_MODE = false;

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [connection, setConnection] = useState(null);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const [connecting, setConnecting] = useState(false);

    // Demo mode - simulate unread notifications
    useEffect(() => {
        if (DEMO_MODE && user?.role === 'parent') {
            // Simulate having unread notifications after 2 seconds
            setTimeout(() => {
                setHasUnreadNotifications(true);
            }, 2000);

            // Simulate receiving a new notification after 10 seconds
            setTimeout(() => {
                const demoNotification = {
                    title: 'Thông báo khám sức khỏe',
                    message: 'Lớp 10A1 sẽ có buổi khám sức khỏe định kỳ vào thứ 2 tuần tới.',
                    type: 'HealthCheck'
                };

                // In demo mode, simulate checking notification status
                // (for demo purposes, we'll keep showing unread notifications)
                setHasUnreadNotifications(true);

                // Show toast if not on notifications page
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/notifications')) {
                    toast.info(`📢 ${demoNotification.title}`, {
                        position: "top-right",
                        autoClose: 5000,
                        onClick: () => {
                            window.location.href = '/parent/notifications';
                        }
                    });
                } else {
                    window.dispatchEvent(new CustomEvent('refreshNotifications'));
                }

            }, 10000);
        }
    }, [user]);

    // Helper function to validate user ID
    const isValidUserId = (id) => {
        if (!id) return false;
        const numId = typeof id === 'string' ? parseInt(id) : id;
        return !isNaN(numId) && numId > 0;
    };

    // Check for unread notifications (only pending notifications)
    const checkUnreadNotifications = useCallback(async () => {
        // More flexible validation for user.id (accept string or number)
        if (!user?.id || user?.role !== 'parent' || !isValidUserId(user.id)) {
            setHasUnreadNotifications(false);
            return;
        }

        if (DEMO_MODE) {
            // In demo mode, simulate checking for pending notifications
            // You could make this more dynamic for demo purposes
            setHasUnreadNotifications(true);
            return;
        }

        try {
            const response = await axiosInstance.get(`/Node/has-notification/${user.id}`);
            setHasUnreadNotifications(response.data.hasNotification === true);
        } catch (error) {
            // Gracefully fallback - no notifications
            setHasUnreadNotifications(false);
        }
    }, [user?.id, user?.role]);

    // Get student classes for joining groups
    const getStudentClasses = useCallback(async () => {
        // More flexible validation for user.id (accept string or number)
        if (!user?.id || user?.role !== 'parent' || !isValidUserId(user.id)) {
            return [];
        }

        if (DEMO_MODE) {
            return ['10A1', '9B2']; // Mock class names
        }

        try {
            const response = await axiosInstance.get(`/Students/by-parent/${user.id}`);

            // Handle different response formats
            let students = [];
            if (response.data?.data) {
                students = Array.isArray(response.data.data) ? response.data.data : [];
            } else if (Array.isArray(response.data)) {
                students = response.data;
            }

            // Extract unique class names
            const classNames = [...new Set(students
                .map(student => student.className || student.class?.className || student.ClassName)
                .filter(Boolean)
            )];


            return classNames;
        } catch (error) {

            // Gracefully fallback - no class groups
            return [];
        }
    }, [user?.id, user?.role]);

    // Initialize SignalR connection
    const initializeConnection = useCallback(async () => {
        // More flexible validation for user.id (accept string or number)
        if (!user?.id || user?.role !== 'parent' || connecting || !isValidUserId(user.id)) {
            return;
        }

        if (DEMO_MODE) {
            setConnecting(false);
            return;
        }

        try {
            setConnecting(true);

            // Create connection with better configuration
            // SignalR Hub doesn't use /api prefix
            const serverUrl = import.meta.env.VITE_SERVER_URL;
            const hubUrl = `${serverUrl}/notificationHub`;

            const newConnection = new HubConnectionBuilder()
                .withUrl(hubUrl, {
                    withCredentials: false,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals
                .configureLogging(LogLevel.Information)
                .build();

            // Event handlers
            newConnection.onreconnecting((error) => {
                setConnecting(true);
            });

            newConnection.onreconnected((connectionId) => {
                setConnecting(false);
                joinClassGroups(newConnection);
            });

            newConnection.onclose((error) => {
                setConnection(null);
                setConnecting(false);
            });

            // Handle incoming notifications
            newConnection.on('ReceiveNotification', (notification) => {

                // Check actual notification status instead of just setting to true
                checkUnreadNotifications();

                // Show toast if not on notifications page
                const currentPath = window.location.pathname;
                if (!currentPath.includes('/notifications')) {
                    toast.info(`📢 ${notification.title || 'Thông báo mới'}`, {
                        position: "top-right",
                        autoClose: 5000,
                        onClick: () => {
                            // Navigate to notifications page
                            window.location.href = '/parent/notifications';
                        }
                    });
                } else {
                    // If on notifications page, trigger refresh
                    window.dispatchEvent(new CustomEvent('refreshNotifications'));
                }
            });

            // Start connection
            await newConnection.start();

            setConnection(newConnection);

            // Join class groups after connection is established
            await joinClassGroups(newConnection);

        } catch (error) {
            // Gracefully fallback - no realtime notifications
            setConnection(null);
        } finally {
            setConnecting(false);
        }
    }, [user?.id, user?.role, connecting]);

    // Join class groups
    const joinClassGroups = useCallback(async (connectionToUse = null) => {
        const activeConnection = connectionToUse || connection;
        if (!activeConnection) {
            return;
        }

        if (activeConnection.state !== 'Connected') {
            return;
        }

        try {
            const classNames = await getStudentClasses();

            if (!classNames || classNames.length === 0) {
                return;
            }

            for (const className of classNames) {
                if (className && typeof className === 'string') {
                    try {
                        await activeConnection.invoke('JoinClassGroup', className);
                    } catch (error) {
                        // Silently handle group join errors
                    }
                }
            }
        } catch (error) {
            // Silently handle group join errors
        }
    }, [connection, getStudentClasses]);

    // Initialize when user logs in
    useEffect(() => {
        // Only initialize when user is properly loaded with valid id
        if (user?.id && user?.role === 'parent' && isValidUserId(user.id)) {
            checkUnreadNotifications();
            initializeConnection();

            // Set up periodic checking (every 30 seconds) to keep bell status in sync
            const interval = setInterval(() => {
                checkUnreadNotifications();
            }, 30000);

            return () => {
                clearInterval(interval);
                if (connection) {
                    connection.stop();
                }
            };
        } else {
            // Clean up connection when user logs out or is invalid
            if (connection) {
                connection.stop();
                setConnection(null);
            }
            setHasUnreadNotifications(false);
        }
    }, [user?.id, user?.role]);

    // Mark notifications as read (deprecated for bell logic - bell now depends on actual status)
    const markAsRead = useCallback(async () => {
        // More flexible validation for user.id (accept string or number)
        if (!user?.id || user?.role !== 'parent' || !isValidUserId(user.id)) {
            return;
        }

        if (DEMO_MODE) {
            // In demo mode, don't auto-clear notifications for bell
            // Bell status should depend on actual notification status
            return;
        }

        try {
            await axiosInstance.post(`/Node/mark-read/${user.id}`);
            // Don't automatically set hasUnreadNotifications to false
            // Let checkUnreadNotifications() determine the actual status
            await checkUnreadNotifications();
        } catch (error) {
            // Gracefully fallback - check actual status
            await checkUnreadNotifications();
        }
    }, [user?.id, user?.role, checkUnreadNotifications]);

    // Debug log for user object
    useEffect(() => {
        console.log('🔍 NotificationContext - User object:', {
            id: user?.id,
            role: user?.role,
            idType: typeof user?.id,
            fullUser: user
        });
    }, [user]);

    const contextValue = {
        connection,
        hasUnreadNotifications,
        setHasUnreadNotifications,
        checkUnreadNotifications,
        markAsRead,
        connecting,
        demoMode: DEMO_MODE,
        // Add refresh function for external components to trigger status update
        refreshNotificationStatus: checkUnreadNotifications
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook to use notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};