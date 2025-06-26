import * as signalR from '@microsoft/signalr';
import axiosInstance from '../api/axiosInstance';

class ChatSignalRService {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.isConnecting = false;
        this.listeners = new Map();
        this.connectionAttempts = 0;
        this.lastConnectionAttempt = 0;
        this.connectionTimeoutId = null;
        this.maxConnectionAttempts = 3;
        this.connectionCooldown = 5000; // 5 seconds

        // Cache for data to avoid repeated calls
        this.cache = {
            conversations: new Map(),
            chatHistory: new Map(),
            pendingRequests: new Map(),
            unassignedMessages: [],
            lastUpdate: 0
        };

        // Track which SignalR methods are available
        this.availableMethods = {
            GetUserConversations: null,
            GetChatHistory: null,
            GetPendingRequests: null,
            GetUnassignedMessages: null,
            AssignMessage: null,
            HasUnreadMessages: null,
            MarkAsRead: null,
            SendMessage: null
        };
    }

    async startConnection(userId) {
        const now = Date.now();

        // Prevent too frequent connection attempts
        if (now - this.lastConnectionAttempt < this.connectionCooldown) {
            console.log('⏳ Connection attempt too frequent, waiting for cooldown...');
            return this.isConnected;
        }

        // Prevent multiple simultaneous connections
        if (this.isConnecting) {
            console.log('🔄 Connection already in progress, waiting...');
            return await this.waitForConnection();
        }

        // If already connected and healthy, return success
        if (this.isConnected && this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            console.log('✅ Already connected to SignalR');
            return true;
        }

        // Limit connection attempts
        if (this.connectionAttempts >= this.maxConnectionAttempts) {
            console.log('❌ Max connection attempts reached');
            throw new Error('SignalR connection failed after maximum attempts');
        }

        this.isConnecting = true;
        this.lastConnectionAttempt = now;
        this.connectionAttempts++;

        try {
            // Clean up existing connection properly
            await this.cleanupConnection();

            // Add delay to prevent rapid reconnection attempts
            if (this.connectionAttempts > 1) {
                const delay = Math.min(1000 * this.connectionAttempts, 5000);
                console.log(`⏳ Waiting ${delay}ms before connection attempt ${this.connectionAttempts}...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Create new connection with timeout
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5182'}/chatHub`, {
                    accessTokenFactory: () => localStorage.getItem('token'),
                    skipNegotiation: false,
                    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
                })
                .withAutomaticReconnect([0, 2000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Error)
                .build();

            // Set up event handlers before connecting
            this.setupEventHandlers();

            // Start connection with timeout
            const connectionPromise = this.connection.start();
            const timeoutPromise = new Promise((_, reject) => {
                this.connectionTimeoutId = setTimeout(() => {
                    reject(new Error('Connection timeout'));
                }, 10000);
            });

            await Promise.race([connectionPromise, timeoutPromise]);

            if (this.connectionTimeoutId) {
                clearTimeout(this.connectionTimeoutId);
                this.connectionTimeoutId = null;
            }

            this.isConnected = true;
            this.connectionAttempts = 0;

            console.log('✅ SignalR Chat Connected successfully');

            // Join user group for targeted messaging (optional - don't fail if not available)
            try {
                await this.joinUserGroup(userId);
            } catch (groupError) {
                console.warn('⚠️ Group join failed, continuing without it:', groupError.message);
                // Continue anyway - this is not critical for basic chat functionality
            }

            return true;

        } catch (error) {
            console.error(`❌ SignalR Connection attempt ${this.connectionAttempts} failed:`, error.message);
            await this.cleanupConnection();
            throw error;
        } finally {
            this.isConnecting = false;

            if (this.connectionTimeoutId) {
                clearTimeout(this.connectionTimeoutId);
                this.connectionTimeoutId = null;
            }
        }
    }

    async waitForConnection(maxWait = 15000) {
        const startTime = Date.now();

        while (this.isConnecting && (Date.now() - startTime) < maxWait) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return this.isConnected;
    }

    async cleanupConnection() {
        if (this.connection) {
            try {
                this.connection.off('ReceiveMessage');
                this.connection.off('MessageSent');
                this.connection.off('NewUnassignedMessage');
                this.connection.off('NewMessage');
                this.connection.off('MessageAssigned');
                this.connection.off('AssignmentNotification');
                this.connection.off('ConversationsUpdate');
                this.connection.off('ChatHistoryUpdate');
                this.connection.off('PendingRequestsUpdate');
                this.connection.off('UnassignedMessagesUpdate');

                if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
                    await this.connection.stop();
                }
            } catch (error) {
                console.warn('Error during connection cleanup:', error.message);
            }
            this.connection = null;
        }
        this.isConnected = false;
    }

    setupEventHandlers() {
        if (!this.connection) return;

        // Real-time message events
        this.connection.on('ReceiveMessage', (data) => {
            console.log('📨 Real-time message received:', data);

            // Transform backend message data to frontend expected format
            const transformedMessage = {
                id: data.id || Date.now() + Math.random(),
                fromUserId: data.fromUserId || data.from || data.FromUserId,
                toUserId: data.toUserId || data.to || data.ToUserId,
                message: data.message || data.Message,
                timestamp: data.timestamp || data.Timestamp || new Date().toISOString(),
                isFromCurrentUser: false // Will be determined by component
            };

            this.notifyListeners('messageReceived', transformedMessage);
        });

        this.connection.on('MessageSent', (data) => {
            console.log('📤 Message sent confirmation received:', data);

            // Transform and notify for sent message confirmation
            const transformedMessage = {
                id: data.id || Date.now() + Math.random(),
                fromUserId: data.fromUserId || data.from || data.FromUserId,
                toUserId: data.toUserId || data.to || data.ToUserId,
                message: data.message || data.Message,
                timestamp: data.timestamp || data.Timestamp || new Date().toISOString(),
                isFromCurrentUser: true // This is always from current user
            };

            this.notifyListeners('messageSent', transformedMessage);
        });

        this.connection.on('NewUnassignedMessage', (data) => {
            console.log('📥 New unassigned message received:', data);

            // Transform backend message data to frontend expected format
            const transformedMessage = {
                id: data.id || Date.now() + Math.random(),
                fromUserId: data.fromUserId || data.from || data.FromUserId,
                toUserId: data.toUserId || data.to || data.ToUserId,
                message: data.message || data.Message,
                timestamp: data.timestamp || data.Timestamp || new Date().toISOString(),
                priority: data.priority || 'Thường'
            };

            this.notifyListeners('newUnassignedMessage', transformedMessage);
        });

        this.connection.on('NewMessage', (data) => {
            console.log('📨 Real-time message received (NewMessage - legacy):', data);

            // Transform backend message data to frontend expected format
            const transformedMessage = {
                id: data.id || Date.now() + Math.random(),
                fromUserId: data.fromUserId || data.from || data.FromUserId,
                toUserId: data.toUserId || data.to || data.ToUserId,
                message: data.message || data.Message,
                timestamp: data.timestamp || data.Timestamp || new Date().toISOString(),
                isFromCurrentUser: false // Will be determined by component
            };

            this.notifyListeners('messageReceived', transformedMessage);
        });

        // Assignment events
        this.connection.on('MessageAssigned', (data) => {
            console.log('👩‍⚕️ Message assigned:', data);
            this.notifyListeners('messageAssigned', data);
        });

        this.connection.on('AssignmentNotification', (data) => {
            console.log('👩‍⚕️ Assignment notification:', data);
            this.notifyListeners('messageAssigned', data);
        });

        // Data update events
        this.connection.on('ConversationsUpdate', (data) => {
            console.log('💬 Conversations updated:', data);
            this.cache.conversations.set(data.userId, data.conversations);
            this.notifyListeners('conversationsUpdate', data);
        });

        this.connection.on('ChatHistoryUpdate', (data) => {
            console.log('📜 Chat history updated:', data);
            this.cache.chatHistory.set(`${data.userA}-${data.userB}`, data.messages);
            this.notifyListeners('chatHistoryUpdate', data);
        });

        this.connection.on('PendingRequestsUpdate', (data) => {
            console.log('⏳ Pending requests updated:', data);
            this.cache.pendingRequests.set(data.userId, data.requests);
            this.notifyListeners('pendingRequestsUpdate', data);
        });

        this.connection.on('UnassignedMessagesUpdate', (data) => {
            console.log('📥 Unassigned messages updated:', data);
            this.cache.unassignedMessages = data.messages;
            this.notifyListeners('unassignedMessagesUpdate', data);
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
            this.connectionAttempts = 0;
            this.notifyListeners('reconnected');
        });

        this.connection.onclose((error) => {
            console.log('❌ SignalR connection closed:', error?.message || 'No error details');
            this.isConnected = false;
            this.notifyListeners('disconnected');
        });
    }

    // ========== HYBRID SIGNALR + REST API OPERATIONS ==========

    async trySignalRMethod(methodName, ...args) {
        if (!this.isConnected || !this.connection) {
            throw new Error('SignalR not connected');
        }

        // If we already know this method doesn't exist, skip it
        if (this.availableMethods[methodName] === false) {
            throw new Error(`Method ${methodName} not available on server`);
        }

        try {
            const result = await this.connection.invoke(methodName, ...args);
            // Mark method as available
            this.availableMethods[methodName] = true;
            return result;
        } catch (error) {
            if (error.message.includes('Method does not exist') ||
                error.message.includes('Invocation canceled') ||
                error.message.includes('connection being closed')) {
                console.warn(`📋 SignalR method '${methodName}' not available on server, will use REST API`);
                // Mark method as unavailable
                this.availableMethods[methodName] = false;
            }
            throw error;
        }
    }

    async joinUserGroup(userId) {
        if (!this.isConnected || !this.connection) {
            return; // Don't throw error, this is optional
        }

        try {
            await this.connection.invoke('JoinUserGroup', userId);
            console.log('👤 Joined user group:', userId);
        } catch (error) {
            console.warn('⚠️ JoinUserGroup method not available on server:', error.message);
            // Don't treat this as a critical error - continue without joining group
            // Backend might not have this method implemented yet
        }
    }

    async sendMessage(fromUserId, toUserId, message) {
        try {
            const messageData = {
                FromUserId: fromUserId,
                ToUserId: toUserId,
                Message: message
            };

            // Try SignalR first (if backend supports it)
            if (this.isConnected && this.availableMethods.SendMessage !== false) {
                try {
                    await this.trySignalRMethod('SendMessage', messageData);
                    return {
                        id: Date.now(), // Generate temporary ID for UI
                        fromUserId: fromUserId,
                        toUserId: toUserId,
                        message: message,
                        timestamp: new Date().toISOString()
                    };
                } catch (signalRError) {
                    console.log('📡 SignalR SendMessage not available, using REST API');
                    // Continue to REST API fallback
                }
            }

            // Fallback to REST API (this is the main backend implementation)
            console.log('📡 Using REST API for sending message');
            const response = await axiosInstance.post('/Chat/send', messageData);

            return {
                id: Date.now(), // Generate temporary ID for UI
                fromUserId: fromUserId,
                toUserId: toUserId,
                message: message,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async getUserConversations(userId) {
        try {
            // Check cache first
            if (this.cache.conversations.has(userId)) {
                return this.cache.conversations.get(userId);
            }

            // Try SignalR first only if method is known to be available
            if (this.isConnected && this.availableMethods.GetUserConversations !== false) {
                try {
                    const conversations = await this.trySignalRMethod('GetUserConversations', userId);
                    const transformedConversations = this.transformConversationsData(conversations);
                    this.cache.conversations.set(userId, transformedConversations);
                    return transformedConversations;
                } catch (signalRError) {
                    console.log('📡 SignalR failed, falling back to REST API:', signalRError.message);
                    // Continue to REST API fallback
                }
            }

            // Fallback to REST API
            console.log('📡 Using REST API for getUserConversations');
            const response = await axiosInstance.get(`/Chat/conversations?userId=${userId}`);
            const conversations = this.transformConversationsData(response.data);
            this.cache.conversations.set(userId, conversations);
            return conversations;
        } catch (error) {
            console.error('Error getting conversations:', error);
            // Return empty array instead of throwing to prevent app crash
            return [];
        }
    }

    // Transform backend ChatPreviewDto to frontend expected format
    transformConversationsData(backendData) {
        if (!Array.isArray(backendData)) {
            return [];
        }

        return backendData.map(item => ({
            id: item.User || item.user || item.id,
            parentId: item.User || item.user,
            User: item.User || item.user, // Keep original field for backend compatibility
            parentName: item.ParentName || item.parentName || 'Phụ huynh',
            lastMessage: item.LastMessage || item.lastMessage || '',
            lastMessageTime: item.Timestamp || item.timestamp,
            unreadCount: item.HasUnread ? 1 : 0,
            HasUnread: item.HasUnread || false,
            hasUnread: item.HasUnread || false
        }));
    }

    async getChatHistory(userA, userB, skip = 0, take = 50) {
        try {
            // Try SignalR first
            if (this.isConnected && this.availableMethods.GetChatHistory !== false) {
                try {
                    const history = await this.trySignalRMethod('GetChatHistory', userA, userB, skip, take);
                    return this.transformChatHistoryData(history);
                } catch (signalRError) {
                    if (this.availableMethods.GetChatHistory !== false) {
                        throw signalRError;
                    }
                }
            }

            // Fallback to REST API
            console.log(`📡 Using REST API for getChatHistory (skip: ${skip}, take: ${take})`);
            const response = await axiosInstance.get(`/Chat/history?userA=${userA}&userB=${userB}&skip=${skip}&take=${take}`);
            return this.transformChatHistoryData(response.data);
        } catch (error) {
            console.error('Error getting chat history:', error);
            throw error;
        }
    }

    // Transform backend ChatMessageDTO to frontend expected format
    transformChatHistoryData(backendData) {
        if (!Array.isArray(backendData)) {
            return [];
        }

        return backendData.map((item, index) => ({
            id: item.Id || item.id || Date.now() + index,
            fromUserId: item.FromUserId || item.fromUserId,
            toUserId: item.ToUserId || item.toUserId,
            message: item.Message || item.message,
            timestamp: item.Timestamp || item.timestamp,
            isRead: item.IsRead || item.isRead || false
        }));
    }

    async getPendingRequests(userId) {
        try {
            // Check cache first
            if (this.cache.pendingRequests.has(userId)) {
                return this.cache.pendingRequests.get(userId);
            }

            // Try SignalR first only if method is known to be available
            if (this.isConnected && this.availableMethods.GetPendingRequests !== false) {
                try {
                    const requests = await this.trySignalRMethod('GetPendingRequests', userId);
                    this.cache.pendingRequests.set(userId, requests);
                    return requests;
                } catch (signalRError) {
                    console.log('📡 SignalR failed, falling back to REST API:', signalRError.message);
                    // Continue to REST API fallback
                }
            }

            // Fallback to REST API
            console.log('📡 Using REST API for getPendingRequests');
            const response = await axiosInstance.get(`/Chat/requests?userId=${userId}`);
            const requests = response.data;
            this.cache.pendingRequests.set(userId, requests);
            return requests;
        } catch (error) {
            console.error('Error getting pending requests:', error);
            // Return empty array instead of throwing to prevent app crash
            return [];
        }
    }

    async getUnassignedMessages() {
        try {
            // Check cache first
            if (this.cache.unassignedMessages.length > 0 &&
                (Date.now() - this.cache.lastUpdate) < 30000) { // 30s cache
                return this.cache.unassignedMessages;
            }

            // Try SignalR first
            if (this.isConnected && this.availableMethods.GetUnassignedMessages !== false) {
                try {
                    const messages = await this.trySignalRMethod('GetUnassignedMessages');
                    const transformedMessages = this.transformUnassignedMessagesData(messages);
                    this.cache.unassignedMessages = transformedMessages;
                    this.cache.lastUpdate = Date.now();
                    return transformedMessages;
                } catch (signalRError) {
                    if (this.availableMethods.GetUnassignedMessages !== false) {
                        throw signalRError;
                    }
                }
            }

            // Fallback to REST API
            console.log('📡 Using REST API for getUnassignedMessages');
            const response = await axiosInstance.get('/Chat/unassigned');
            const messages = this.transformUnassignedMessagesData(response.data);
            this.cache.unassignedMessages = messages;
            this.cache.lastUpdate = Date.now();
            return messages;
        } catch (error) {
            console.error('Error getting unassigned messages:', error);
            throw error;
        }
    }

    // Transform backend unassigned messages to frontend expected format
    transformUnassignedMessagesData(backendData) {
        if (!Array.isArray(backendData)) {
            return [];
        }

        return backendData.map(item => ({
            id: item.User || item.user || Date.now() + Math.random(),
            parentId: item.User || item.user,
            parentName: item.ParentName || item.parentName || 'Phụ huynh',
            studentName: item.StudentName || item.studentName || '',
            message: item.LastMessage || item.lastMessage || item.Message || item.message || '',
            timestamp: item.Timestamp || item.timestamp || new Date().toISOString(),
            priority: item.Priority || item.priority || 'Thường'
        }));
    }

    async assignMessage(parentId, nurseId) {
        try {
            // Backend expects ParentId and NurseId (capitalized)
            const assignmentData = {
                ParentId: parentId,
                NurseId: nurseId
            };

            // Try SignalR first
            if (this.isConnected && this.availableMethods.AssignMessage !== false) {
                try {
                    await this.trySignalRMethod('AssignMessage', assignmentData);

                    // Clear relevant cache
                    this.cache.unassignedMessages = [];
                    this.cache.conversations.delete(nurseId);

                    return assignmentData;
                } catch (signalRError) {
                    if (this.availableMethods.AssignMessage !== false) {
                        throw signalRError;
                    }
                }
            }

            // Fallback to REST API
            console.log('📡 Using REST API for assignMessage');
            const response = await axiosInstance.post('/Chat/assign', assignmentData);

            // Clear relevant cache
            this.cache.unassignedMessages = [];
            this.cache.conversations.delete(nurseId);

            return response.data;
        } catch (error) {
            console.error('Error assigning message:', error);
            throw error;
        }
    }

    async hasUnreadMessages(userId) {
        try {
            // Try SignalR first only if method is known to be available
            if (this.isConnected && this.availableMethods.HasUnreadMessages !== false) {
                try {
                    const result = await this.trySignalRMethod('HasUnreadMessages', userId);
                    return result;
                } catch (signalRError) {
                    console.log('📡 SignalR failed, falling back to REST API:', signalRError.message);
                    // Continue to REST API fallback
                }
            }

            // Use NodeController endpoint for hasUnreadMessages
            console.log('📡 Using REST API for hasUnreadMessages');
            const response = await axiosInstance.get(`/Node/has-unread-message/${userId}`);

            // Backend returns { hasUnreadMessage: boolean }
            // Transform to expected format { hasUnread: boolean }
            return {
                hasUnread: response.data.hasUnreadMessage || false
            };
        } catch (error) {
            console.error('Error checking unread messages:', error);
            // Return default false instead of throwing to prevent app crash
            return { hasUnread: false };
        }
    }

    async markAsRead(userId) {
        try {
            // Backend handles mark as read automatically in getChatHistory endpoint
            // So we don't need a separate markAsRead call
            console.log('📡 markAsRead handled automatically by backend in getChatHistory');
            return;
        } catch (error) {
            console.error('Error marking as read:', error);
            // Don't throw error as this is not critical
        }
    }

    // ========== EVENT MANAGEMENT ==========

    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }

    async stopConnection() {
        this.connectionAttempts = 0;
        this.lastConnectionAttempt = 0;

        await this.cleanupConnection();
        this.listeners.clear();

        // Clear cache
        this.cache.conversations.clear();
        this.cache.chatHistory.clear();
        this.cache.pendingRequests.clear();
        this.cache.unassignedMessages = [];

        console.log('🛑 SignalR connection stopped and cleaned up');
    }

    resetConnectionAttempts() {
        this.connectionAttempts = 0;
        this.lastConnectionAttempt = 0;
        console.log('🔄 Connection attempts reset');
    }

    clearCache() {
        this.cache.conversations.clear();
        this.cache.chatHistory.clear();
        this.cache.pendingRequests.clear();
        this.cache.unassignedMessages = [];
        this.cache.lastUpdate = 0;
        console.log('🗑️ Cache cleared');
    }

    getConnectionState() {
        return {
            isConnected: this.isConnected,
            isConnecting: this.isConnecting,
            connectionAttempts: this.connectionAttempts,
            state: this.connection?.state || 'Disconnected',
            canRetry: this.connectionAttempts < this.maxConnectionAttempts,
            availableMethods: this.availableMethods
        };
    }
}

// Create singleton instance
const chatSignalR = new ChatSignalRService();

export default chatSignalR; 