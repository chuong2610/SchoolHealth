import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { FaWifi, FaWifiSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import chatSignalR from '../services/chatSignalR';

const ChatConnectionStatus = ({ showText = true, size = 'sm' }) => {
    const { user } = useAuth();
    const [connectionState, setConnectionState] = useState({
        isConnected: false,
        state: 'Disconnected'
    });

    useEffect(() => {
        if (user?.id) {
            updateConnectionState();

            chatSignalR.addEventListener('reconnecting', () => {
                setConnectionState({ isConnected: false, state: 'Reconnecting' });
            });

            chatSignalR.addEventListener('reconnected', () => {
                setConnectionState({ isConnected: true, state: 'Connected' });
            });

            chatSignalR.addEventListener('disconnected', () => {
                setConnectionState({ isConnected: false, state: 'Disconnected' });
            });

            const interval = setInterval(updateConnectionState, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const updateConnectionState = () => {
        const state = chatSignalR.getConnectionState();
        setConnectionState(state);
    };

    const getStatusColor = () => {
        switch (connectionState.state) {
            case 'Connected': return 'success';
            case 'Reconnecting': return 'warning';
            case 'Disconnected': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusText = () => {
        switch (connectionState.state) {
            case 'Connected': return 'Trực tuyến';
            case 'Reconnecting': return 'Đang kết nối';
            case 'Disconnected': return 'Ngoại tuyến';
            default: return 'Không rõ';
        }
    };

    if (!user?.id) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {connectionState.isConnected ? (
                <FaWifi style={{ color: '#28a745', fontSize: size === 'sm' ? '14px' : '16px' }} />
            ) : (
                <FaWifiSlash style={{ color: '#dc3545', fontSize: size === 'sm' ? '14px' : '16px' }} />
            )}

            {showText && (
                <Badge bg={getStatusColor()} style={{ fontSize: '0.75rem' }}>
                    {getStatusText()}
                </Badge>
            )}
        </div>
    );
};

export default ChatConnectionStatus; 