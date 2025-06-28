import * as signalR from '@microsoft/signalr';

/**
 * Simple SignalR Service - Event Listener Only
 * Following the new flow: SignalR only for detecting events, not sending
 */
class SimpleSignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
    }

    /**
     * Start SignalR connection
     */
    async startConnection(userId) {
        try {
            console.log('🔧 Starting SignalR connection for userId:', userId);

            // Prevent multiple connections
            if (this.connection && this.isConnected) {
                console.log('📌 SignalR already connected, skipping...');
                return true;
            }

            // Stop existing connection if any
            if (this.connection) {
                await this.stopConnection();
            }

            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('⚠️ No token found for SignalR connection');
                return false;
            }

            // Create connection
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5182'}/chatHub`, {
                    accessTokenFactory: () => localStorage.getItem('token'),
                    skipNegotiation: false,
                    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
                })
                .withAutomaticReconnect([0, 2000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Error)
                .build();

            // Setup event handlers
            this.setupEventHandlers();

            // Start connection
            await this.connection.start();
            this.isConnected = true;
            this.reconnectAttempts = 0;

            console.log('✅ SignalR connected successfully');

            // Join user group if available
            try {
                await this.connection.invoke('JoinUserGroup', userId);
                console.log('👤 Joined user group:', userId);

                // Debug: Check token and user role
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        console.log('🔍 Token payload:', {
                            role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                            userId: payload.sub || payload.userId,
                            exp: new Date(payload.exp * 1000)
                        });
                    } catch (e) {
                        console.warn('⚠️ Could not parse token:', e);
                    }
                }
            } catch (error) {
                console.warn('⚠️ JoinUserGroup not available:', error.message);
            }

            return true;
        } catch (error) {
            console.error('❌ SignalR connection failed:', error);
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Setup event handlers for real-time events
     */
    setupEventHandlers() {
        if (!this.connection) return;

        // Message received event (deduplicated)
        this.connection.on('ReceiveMessage', (data) => {
            console.log('📨 SignalR: Message received', JSON.stringify(data, null, 2));
            this.notifyListeners('messageReceived', data);
        });

        this.connection.on('MessageReceived', (data) => {
            console.log('📨 SignalR: Message received (MessageReceived event)', JSON.stringify(data, null, 2));
            // Don't notify again to avoid duplicates
            // this.notifyListeners('messageReceived', data);
        });

        // Message sent confirmation
        this.connection.on('MessageSent', (data) => {
            console.log('📤 SignalR: Message sent confirmation', JSON.stringify(data, null, 2));
            this.notifyListeners('messageSent', data);
        });

        // New unassigned message
        this.connection.on('NewUnassignedMessage', (data) => {
            console.log('📥 SignalR: New unassigned message', data);
            this.notifyListeners('newUnassignedMessage', data);
        });

        // Message assigned
        this.connection.on('MessageAssigned', (data) => {
            console.log('👩‍⚕️ SignalR: Message assigned', data);
            this.notifyListeners('messageAssigned', data);
        });

        // Connection state events
        this.connection.onreconnecting(() => {
            console.log('🔄 SignalR reconnecting...');
            this.isConnected = false;
            this.notifyListeners('reconnecting');
        });

        this.connection.onreconnected(() => {
            console.log('✅ SignalR reconnected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.notifyListeners('reconnected');
        });

        this.connection.onclose((error) => {
            console.log('❌ SignalR connection closed:', error?.message || 'No error details');
            this.isConnected = false;
            this.notifyListeners('disconnected', error);
        });
    }

    /**
     * Add event listener
     */
    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        // Check if callback already exists to prevent duplicates
        const eventListeners = this.listeners.get(event);
        if (eventListeners.has(callback)) {
            console.log(`⚠️ Listener for '${event}' already exists, skipping...`);
            return;
        }

        eventListeners.add(callback);
        console.log(`🎧 Added listener for '${event}', total: ${eventListeners.size}`);
    }

    /**
     * Remove event listener
     */
    removeEventListener(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
            console.log(`🧹 Removed listener for '${event}', remaining: ${this.listeners.get(event).size}`);
        }
    }

    /**
     * Notify listeners
     */
    notifyListeners(event, data = null) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event);
            console.log(`📢 Notifying ${eventListeners.size} listeners for '${event}'`);

            eventListeners.forEach((callback, index) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener ${index + 1}:`, error);
                }
            });
        }
    }

    /**
     * Stop connection
     */
    async stopConnection() {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('🛑 SignalR connection stopped');
            } catch (error) {
                console.error('Error stopping SignalR:', error);
            }
            this.connection = null;
        }
        this.isConnected = false;
        this.listeners.clear();
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            state: this.connection?.state || 'Disconnected',
            reconnectAttempts: this.reconnectAttempts
        };
    }
}

// Create singleton instance
const simpleSignalR = new SimpleSignalRService();

export default simpleSignalR; 