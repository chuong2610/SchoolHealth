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
            // Prevent multiple connections
            if (this.connection && this.isConnected) {
                return true;
            }

            // Stop existing connection if any
            if (this.connection) {
                await this.stopConnection();
            }

            const token = localStorage.getItem('token');
            if (!token) {
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

            // Join user group if available
            try {
                await this.connection.invoke('JoinUserGroup', userId);
            } catch (error) {
            }

            return true;
        } catch (error) {
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
            this.notifyListeners('messageReceived', data);
        });

        this.connection.on('MessageReceived', (data) => {
            // Don't notify again to avoid duplicates
            // this.notifyListeners('messageReceived', data);
        });

        // Message sent confirmation
        this.connection.on('MessageSent', (data) => {
            this.notifyListeners('messageSent', data);
        });

        // New unassigned message
        this.connection.on('NewUnassignedMessage', (data) => {
            this.notifyListeners('newUnassignedMessage', data);
        });

        // Message assigned
        this.connection.on('MessageAssigned', (data) => {
            this.notifyListeners('messageAssigned', data);
        });

        // Connection state events
        this.connection.onreconnecting(() => {
            this.isConnected = false;
            this.notifyListeners('reconnecting');
        });

        this.connection.onreconnected(() => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.notifyListeners('reconnected');
        });

        this.connection.onclose((error) => {
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
            return;
        }

        eventListeners.add(callback);
    }

    /**
     * Remove event listener
     */
    removeEventListener(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    /**
     * Notify listeners
     */
    notifyListeners(event, data = null) {
        if (this.listeners.has(event)) {
            const eventListeners = this.listeners.get(event);

            eventListeners.forEach((callback, index) => {
                try {
                    callback(data);
                } catch (error) {
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
            } catch (error) {
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