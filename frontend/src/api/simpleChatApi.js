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
            const response = await axiosInstance.get(`/Node/has-unread-message/${userId}`);
            return response.data?.hasUnreadMessage || false;
        } catch (error) {
            return false;
        }
    }

    /**
     * 2. Load conversation list
     * GET /api/Chat/conversations?userId
     */
    async getConversations(userId) {
        try {
            const response = await axiosInstance.get(`/Chat/conversations?userId=${userId}`);
            return response.data || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * 3. Load unassigned messages (Nurse only)
     * GET /api/Chat/unassigned
     */
    async getUnassignedMessages() {
        try {
            const response = await axiosInstance.get('/Chat/unassigned');
            return response.data || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * 4. Assign message to nurse
     * POST /api/Chat/assign
     */
    async assignMessage(parentId, nurseId) {
        try {
            const response = await axiosInstance.post('/Chat/assign', {
                ParentId: parentId,
                NurseId: nurseId
            });
            return response.data;
        } catch (error) {
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
            const response = await axiosInstance.get('/Chat/history', {
                params: {
                    userA: userId,
                    userB: nurseId,
                    skip,
                    take
                }
            });
            return response.data || [];
        } catch (error) {
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
            const payload = {
                FromUserId: fromUserId,
                Message: message
            };
            if (!isNewChat) {
                payload.ToUserId = toUserId;
            }
            const response = await axiosInstance.post('/Chat/send', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

// Create singleton instance
const simpleChatAPI = new SimpleChatAPI();

export default simpleChatAPI; 