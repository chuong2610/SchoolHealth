import axiosInstance from './axiosInstance';

class ChatAPI {
    // 📤 Gửi & Lịch sử tin nhắn

    /**
     * Gửi tin nhắn giữa 2 user
     * @param {Object} messageData - {fromUserId, toUserId, message}
     * @returns {Promise}
     */
    async sendMessage(messageData) {
        const response = await axiosInstance.post('/Chat/send', messageData);
        return response.data;
    }

    /**
     * Lấy lịch sử tin nhắn giữa 2 người với pagination
     * @param {string} userA - ID của user A
     * @param {string} userB - ID của user B
     * @param {number} skip - Số tin nhắn bỏ qua (mặc định 0)
     * @param {number} take - Số tin nhắn lấy (mặc định 50)
     * @returns {Promise}
     */
    async getChatHistory(userA, userB, skip = 0, take = 50) {
        const response = await axiosInstance.get(`/Chat/history?userA=${userA}&userB=${userB}&skip=${skip}&take=${take}`);
        return response.data;
    }

    /**
     * Lấy tất cả cuộc hội thoại của user
     * @param {string} userId - ID của user
     * @returns {Promise}
     */
    async getUserConversations(userId) {
        const response = await axiosInstance.get(`/Chat/conversations?userId=${userId}`);
        return response.data;
    }

    /**
     * Lấy tất cả tin nhắn chờ của PARENT
     * @param {string} userId - ID của parent
     * @returns {Promise}
     */
    async getPendingRequests(userId) {
        const response = await axiosInstance.get(`/Chat/requests?userId=${userId}`);
        return response.data;
    }

    // 👩‍⚕️ Dành riêng cho NURSE

    /**
     * Lấy tất cả tin nhắn chưa có NURSE nhận
     * @returns {Promise}
     */
    async getUnassignedMessages() {
        const response = await axiosInstance.get('/Chat/unassigned');
        return response.data;
    }

    /**
     * NURSE nhận tin nhắn chờ
     * @param {Object} assignData - {parentId, nurseId}
     * @returns {Promise}
     */
    async assignMessage(assignData) {
        const response = await axiosInstance.post('/Chat/assign', assignData);
        return response.data;
    }

    // 🔔 Thông báo realtime

    /**
     * Kiểm tra user có tin nhắn chưa đọc
     * @param {string} userId - ID của user
     * @returns {Promise}
     */
    async hasUnreadMessages(userId) {
        const response = await axiosInstance.get(`/Node/has-unread-message/${userId}`);
        return response.data;
    }

    /**
     * Đánh dấu đã đọc tất cả tin nhắn
     * @param {string} userId - ID của user
     * @returns {Promise}
     */
    async markAsRead(userId) {
        const response = await axiosInstance.post(`/Node/mark-read/${userId}`);
        return response.data;
    }
}

const chatAPI = new ChatAPI();

export default chatAPI; 