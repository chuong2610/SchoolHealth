import axiosInstance from './axiosInstance';

/**
 * Simple Chat API Service - REST API Only
 * Following the new flow requirements for nurse contact
 */
class SimpleChatAPI {

    /**
     * 1. Check unread messages on login
     * GET /api/Node/has-unread-message/{userId}
     */
    async checkUnreadMessages(userId) {
        try {
            console.log('🔔 Checking unread messages for:', userId);
            const response = await axiosInstance.get(`/Node/has-unread-message/${userId}`);
            return response.data?.hasUnreadMessage || false;
        } catch (error) {
            console.error('❌ Error checking unread messages:', error);
            return false;
        }
    }

    /**
     * 2. Load conversation list
     * GET /api/Chat/conversations?userId
     */
    async getConversations(userId) {
        try {
            console.log('📋 Loading conversations for:', userId);
            const response = await axiosInstance.get(`/Chat/conversations?userId=${userId}`);
            return response.data || [];
        } catch (error) {
            console.error('❌ Error loading conversations:', error);
            return [];
        }
    }

    /**
     * 3. Load unassigned messages (Nurse only)
     * GET /api/Chat/unassigned
     */
    async getUnassignedMessages() {
        try {
            console.log('📥 Loading unassigned messages...');
            const response = await axiosInstance.get('/Chat/unassigned');
            return response.data || [];
        } catch (error) {
            console.error('❌ Error loading unassigned messages:', error);
            return [];
        }
    }

    /**
     * 4. Assign message to nurse
     * POST /api/Chat/assign
     */
    async assignMessage(parentId, nurseId) {
        try {
            console.log('👩‍⚕️ Assigning message:', JSON.stringify({ parentId, nurseId }, null, 2));
            const response = await axiosInstance.post('/Chat/assign', {
                ParentId: parentId,
                NurseId: nurseId
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error assigning message:', error);
            throw error;
        }
    }

    /**
     * 5. Load chat history between two users
     * GET /api/Chat/history?userA&userB&skip&take
     * This is the main API for loading chat history when user opens "Liên hệ y tá"
     */
    async getChatHistory(userId, nurseId, skip = 0, take = 50) {
        try {
            console.log('📜 Loading chat history:', JSON.stringify({ userId, nurseId, skip, take }, null, 2));
            const response = await axiosInstance.get('/Chat/history', {
                params: {
                    userA: userId,      // Current user ID
                    userB: nurseId,     // Nurse ID
                    skip,
                    take
                }
            });
            return response.data || [];
        } catch (error) {
            console.error('❌ Error loading chat history:', error);
            return [];
        }
    }

    /**
     * 6. Send message
     * POST /api/Chat/send
     * This is the main API for sending new messages
     */
    async sendMessage(fromUserId, toUserId, message) {
        try {
            const isNewChat = toUserId === null || toUserId === undefined;
            console.log('📤 Sending message:', JSON.stringify({
                fromUserId,
                toUserId,
                isNewChat,
                message: message
            }, null, 2));

            const payload = {
                FromUserId: fromUserId,
                Message: message
            };

            // Only add ToUserId if it's not null (for existing conversations)
            if (!isNewChat) {
                payload.ToUserId = toUserId;
            }

            const response = await axiosInstance.post('/Chat/send', payload);
            return response.data;
        } catch (error) {
            console.error('❌ Error sending message:', error);
            throw error;
        }
    }
}

// Create singleton instance
const simpleChatAPI = new SimpleChatAPI();

export default simpleChatAPI; 