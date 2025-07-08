import React, { useState, useEffect } from 'react';
import { Badge, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import simpleSignalR from '../services/simpleSignalR';

const ChatConnectionStatus = ({ showText = true, size = 'sm' }) => {
    const { user, signalRConnected, hasUnreadMessages, hasUnassignedMessages, checkUnreadMessages, checkUnassignedMessages, clearUnreadMessages } = useAuth();
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState({
        token: false,
        userId: null,
        attempts: 0
    });

    useEffect(() => {
        if (!user?.id) return;

        // Update debug info
        const token = localStorage.getItem('token');
        setDebugInfo({
            token: !!token,
            userId: user.id,
            attempts: 0
        });

        // Use the global SignalR connection status from AuthContext
        setConnectionStatus(signalRConnected ? 'Connected' : 'Disconnected');

        // Setup event listeners for connection state changes
        const handleReconnecting = () => {
            setConnectionStatus('Reconnecting');
        };

        const handleReconnected = () => {
            setConnectionStatus('Connected');
            setError('');
        };

        const handleDisconnected = () => {
            setConnectionStatus('Disconnected');
        };

        simpleSignalR.addEventListener('reconnecting', handleReconnecting);
        simpleSignalR.addEventListener('reconnected', handleReconnected);
        simpleSignalR.addEventListener('disconnected', handleDisconnected);

        // Cleanup
        return () => {
            simpleSignalR.removeEventListener('reconnecting', handleReconnecting);
            simpleSignalR.removeEventListener('reconnected', handleReconnected);
            simpleSignalR.removeEventListener('disconnected', handleDisconnected);
        };
    }, [user, signalRConnected]);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'Connected': return 'success';
            case 'Connecting':
            case 'Reconnecting': return 'warning';
            case 'Failed':
            case 'Disconnected': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'Connected': return '✅ Chat thời gian thực';
            case 'Connecting': return '🔄 Đang kết nối...';
            case 'Reconnecting': return '🔄 Đang kết nối lại...';
            case 'Failed': return '⚠️ Dùng REST API';
            case 'Disconnected': return '❌ Ngoại tuyến';
            default: return '❓ Không xác định';
        }
    };

    const retryConnection = async () => {
        if (!user?.id) return;

        setConnectionStatus('Connecting');
        try {
            const connected = await simpleSignalR.startConnection(user.id);
            setConnectionStatus(connected ? 'Connected' : 'Failed');
            if (!connected) {
                setError('Không thể kết nối SignalR. Sử dụng REST API fallback.');
            }
        } catch (error) {
            setConnectionStatus('Failed');
            setError(`Lỗi kết nối: ${error.message}`);
        }
    };

    if (!user?.id) {
        return null;
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(248, 249, 250, 0.8)',
                borderRadius: '8px',
                fontSize: '0.875rem'
            }}>
                <Badge bg={getStatusColor()} style={{ fontSize: '0.75rem' }}>
                    {getStatusText()}
                </Badge>

                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                    User: {debugInfo.userId} | Token: {debugInfo.token ? '✓' : '✗'} |
                    HasUnread: {hasUnreadMessages ? '🔴' : '⚪'} |
                    HasUnassigned: {hasUnassignedMessages ? '🔴' : '⚪'}
                </div>

                {connectionStatus === 'Failed' && (
                    <button
                        onClick={retryConnection}
                        style={{
                            background: 'none',
                            border: '1px solid #007bff',
                            color: '#007bff',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Thử lại
                    </button>
                )}
            </div>

            {error && (
                <Alert variant="warning" style={{ marginTop: '0.5rem', padding: '0.5rem', fontSize: '0.875rem' }}>
                    {error}
                </Alert>
            )}
        </div>
    );
};

export default ChatConnectionStatus; 