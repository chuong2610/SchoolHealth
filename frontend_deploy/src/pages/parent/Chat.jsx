import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Button, Spinner, Alert, Row, Container } from 'react-bootstrap';
import { FaComments, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import simpleChatAPI from '../../api/simpleChatApi';
import simpleSignalR from '../../services/simpleSignalR';
import { useLocation } from 'react-router-dom';
import styles from './Chat.module.css';

const ParentChat = () => {
    const { user, clearUnreadMessages } = useAuth();
    const userId = user?.id;
    const location = useLocation();

    // States
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [isNewChatMode, setIsNewChatMode] = useState(false);

    // Pagination states for chat history
    const [skip, setSkip] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const messagesContainerRef = useRef(null);
    const loadConversationsTimeoutRef = useRef(null);
    const handlersRef = useRef({});

    // ===== STEP 2: DEFINE FUNCTIONS FIRST =====

    // Auto-hide error
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000); // 3s
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Auto-hide success
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000); // 3s
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Load conversation list (debounced to prevent multiple calls)
    const loadConversations = useCallback(async () => {
        // Clear existing timeout
        if (loadConversationsTimeoutRef.current) {
            clearTimeout(loadConversationsTimeoutRef.current);
        }

        // Debounce the actual API call
        loadConversationsTimeoutRef.current = setTimeout(async () => {
            try {
                const data = await simpleChatAPI.getConversations(userId);

                setConversations(data || []);
                setError('');
            } catch (error) {
                setError('Không thể tải danh sách cuộc trò chuyện');
            }
        }, 300); // Reduced debounce time
    }, [userId]);

    // Load chat history when clicking a conversation
    const loadChatHistory = useCallback(async (conversation) => {
        try {
            // Get partner ID (nurse ID) from conversation
            const nurseId = conversation.User ||
                conversation.nurseId ||
                conversation.otherUserId ||
                conversation.userId ||
                conversation.user ||
                conversation.NurseId ||
                conversation.UserId;

            if (!nurseId) {
                setError('Không thể xác định y tá. Vui lòng thử lại.');
                return;
            }

            // Reset pagination and load latest messages (skip: 0, take: 50)
            const history = await simpleChatAPI.getChatHistory(userId, nurseId, 0, 50);

            // Set messages (API returns newest first, so reverse to show oldest at top)
            setMessages(history.reverse());
            setSelectedConversation(conversation);
            setIsNewChatMode(false);

            // Reset pagination states
            setSkip(history.length);
            setHasMoreMessages(history.length === 50); // If we got 50 messages, there might be more

            if (isMobile) {
                setShowMobileChat(true);
            }

            // Auto scroll to bottom (latest message) - immediate scroll
            scrollToBottom();

            // Refresh conversation list after a short delay
            setTimeout(async () => {
                await loadConversations();
            }, 500);

        } catch (error) {
            setError('Không thể tải lịch sử chat');
        }
    }, [userId, loadConversations, isMobile]);

    // Load more older messages (pagination)
    const loadMoreMessages = useCallback(async () => {
        if (!selectedConversation || loadingMore || !hasMoreMessages || isNewChatMode) return;

        try {
            setLoadingMore(true);

            // Get nurse ID from selected conversation
            const nurseId = selectedConversation.User ||
                selectedConversation.nurseId ||
                selectedConversation.otherUserId ||
                selectedConversation.userId ||
                selectedConversation.user ||
                selectedConversation.NurseId ||
                selectedConversation.UserId;

            // Load older messages (skip current amount, take 50 more)
            const olderMessages = await simpleChatAPI.getChatHistory(userId, nurseId, skip, 50);

            if (olderMessages.length > 0) {
                // Prepend older messages to the beginning (reverse them first since API returns newest first)
                setMessages(prevMessages => [...olderMessages.reverse(), ...prevMessages]);

                // Update pagination state
                setSkip(prevSkip => prevSkip + olderMessages.length);
                setHasMoreMessages(olderMessages.length === 50); // If we got 50, there might be more

            } else {
                // No more messages
                setHasMoreMessages(false);
            }

        } catch (error) {
            setError('Không thể tải thêm tin nhắn');
        } finally {
            setLoadingMore(false);
        }
    }, [selectedConversation, loadingMore, hasMoreMessages, skip, userId, messages.length, isNewChatMode]);

    // ===== STEP 1: INITIALIZE AND LOAD DATA =====
    useEffect(() => {
        if (!userId) return;

        const init = async () => {
            // Clear unread messages since user is now on chat page
            clearUnreadMessages();

            // Load conversations
            await loadConversations();

            setLoading(false);
        };

        init();

        // Cleanup
        return () => {
            // Clear any pending timeout
            if (loadConversationsTimeoutRef.current) {
                clearTimeout(loadConversationsTimeoutRef.current);
            }
        };
    }, [userId, clearUnreadMessages, loadConversations]);

    // ===== AUTO-START CHAT WITH SPECIFIC NURSE (from navigation state) =====
    useEffect(() => {
        if (!userId || loading || !location.state?.autoStartChat || !location.state?.nurseName) return;

        // Wait for conversations to load, then try to find the nurse
        const timer = setTimeout(async () => {
            // Helper function to get nurse ID from conversation
            const getNurseIdFromConversation = (conv) => {
                return conv?.User || conv?.user || conv?.nurseId || conv?.otherUserId ||
                    conv?.userId || conv?.NurseId || conv?.UserId;
            };

            // Helper function to get nurse name from conversation
            const getNurseNameFromConversation = (conv) => {
                return conv?.userName || conv?.nurseName || conv?.UserName || conv?.NurseName;
            };

            // Try to find existing conversation with the nurse
            const nurseConversation = conversations.find(conv => {
                const convNurseId = getNurseIdFromConversation(conv);
                const convNurseName = getNurseNameFromConversation(conv);

                // Match by nurseId if available, otherwise match by name
                if (location.state.nurseId) {
                    return convNurseId === location.state.nurseId;
                } else {
                    return convNurseName === location.state.nurseName;
                }
            });

            if (nurseConversation) {
                await loadChatHistory(nurseConversation);
            } else {
                startNewChat(location.state.nurseName, location.state.nurseId);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [userId, loading, conversations, location.state, loadChatHistory]);

    // ===== STEP 3: SETUP SIGNALR EVENT LISTENERS FOR AUTO-REFRESH =====
    useEffect(() => {
        if (!userId) return;

        // Handler for new messages received via SignalR
        const handleMessageReceived = async (messageData) => {
            const { fromUserId, toUserId } = messageData;
            const currentUserId = parseInt(userId);

            // Check if this message is for current conversation
            if (selectedConversation && !isNewChatMode) {
                // Get current conversation partner ID
                const partnerId = selectedConversation.user || selectedConversation.User ||
                    selectedConversation.nurseId || selectedConversation.otherUserId ||
                    selectedConversation.userId || selectedConversation.NurseId ||
                    selectedConversation.UserId;

                // Check if message is part of current conversation
                const isCurrentConversation =
                    (fromUserId === partnerId && toUserId === currentUserId) ||  // Partner → Me
                    (fromUserId === currentUserId && toUserId === partnerId);     // Me → Partner

                if (isCurrentConversation) {
                    setTimeout(async () => {
                        await loadChatHistory(selectedConversation);
                    }, 500);
                }
            }

            // Always refresh conversation list to update last message
            setTimeout(async () => {
                await loadConversations();
            }, 1000);
        };

        // Add SignalR event listener
        simpleSignalR.addEventListener('messageReceived', handleMessageReceived);
        handlersRef.current.messageReceived = handleMessageReceived;

        // Cleanup
        return () => {
            if (handlersRef.current.messageReceived) {
                simpleSignalR.removeEventListener('messageReceived', handlersRef.current.messageReceived);
                delete handlersRef.current.messageReceived;
            }
        };
    }, [userId, selectedConversation, isNewChatMode, loadConversations, loadChatHistory]);

    // ===== STEP 4: OTHER FUNCTIONS =====

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            setError('');

            // Nếu là chat mới và chưa có nurseId, gửi với toUserId: null
            if ((isNewChatMode || selectedConversation?.isNewChat) && !selectedConversation?.nurseId) {
                await simpleChatAPI.sendMessage(userId, null, newMessage);
                setNewMessage('');
                setIsNewChatMode(false);
                setSuccess('Tin nhắn của bạn đã được gửi đến y tá. Y tá sẽ phản hồi sớm nhất.');
                // Sau khi gửi thành công, quay lại giao diện chat bình thường (không cần fetch lại danh sách chờ xử lý)
                setSelectedConversation(null);
                setMessages([]);
                return;
            }

            // Nếu là chat mới với nurse cụ thể
            if ((isNewChatMode || selectedConversation?.isNewChat) && selectedConversation?.nurseId) {
                await simpleChatAPI.sendMessage(userId, selectedConversation.nurseId, newMessage);
                setNewMessage('');
                setIsNewChatMode(false);
                await loadConversations();
                setSuccess('Tin nhắn đã được gửi! Y tá sẽ sớm phản hồi.');
                return;
            }

            // Existing conversation - send to specific nurse
            const nurseId = selectedConversation?.user ||
                selectedConversation?.User ||
                selectedConversation?.nurseId ||
                selectedConversation?.otherUserId ||
                selectedConversation?.userId ||
                selectedConversation?.NurseId ||
                selectedConversation?.UserId;
            if (!nurseId) {
                throw new Error('Không xác định được y tá. Cấu trúc dữ liệu không đúng.');
            }
            await simpleChatAPI.sendMessage(userId, nurseId, newMessage);
            setNewMessage('');
            await loadChatHistory(selectedConversation);
        } catch (error) {
            setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    // Start new chat
    const startNewChat = (nurseName = null, nurseId = null) => {
        // Create a temporary conversation object for new chat
        const tempConversation = {
            id: 'new-chat-temp',
            nurseId: nurseId,
            nurseName: nurseName || 'Hệ thống tư vấn',
            userName: nurseName || 'Hệ thống tư vấn',
            lastMessage: '',
            lastMessageTime: null,
            unreadCount: 0,
            isNewChat: true
        };

        setIsNewChatMode(true);
        setSelectedConversation(tempConversation);
        setMessages([]);

        // Reset pagination states for new chat
        setSkip(0);
        setHasMoreMessages(false);
        setLoadingMore(false);

        if (isMobile) {
            setShowMobileChat(true);
        }
    };

    // Back to conversation list
    const handleBackToList = () => {
        setShowMobileChat(false);
        setSelectedConversation(null);
        setIsNewChatMode(false);
        setMessages([]);

        // Reset pagination states
        setSkip(0);
        setHasMoreMessages(false);
        setLoadingMore(false);
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    // Auto scroll to bottom when new messages are added
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ===== RENDERING =====

    // Format time
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render conversation item
    const renderConversationItem = (conversation, index) => {
        // API returns hasUnread (boolean) or unreadCount (number)  
        const hasUnread = conversation.hasUnread || conversation.HasUnread || conversation.unreadCount > 0;

        return (
            <div
                key={index}
                className={`${styles.conversationItem} ${hasUnread ? styles.hasUnread : ''} ${(() => {
                    // Helper function to get partner ID
                    const getPartnerId = (conv) => {
                        return conv?.user ||     // ← PRIMARY FIELD FROM API (lowercase)
                            conv?.User ||        // ← Fallback to uppercase
                            conv?.nurseId ||
                            conv?.otherUserId ||
                            conv?.userId ||
                            conv?.NurseId ||
                            conv?.UserId;
                    };

                    const isActive = selectedConversation &&
                        getPartnerId(selectedConversation) === getPartnerId(conversation);
                    return isActive ? styles.active : '';
                })()}`}
                onClick={() => loadChatHistory(conversation)}
            >
                <div className={styles.conversationContent}>
                    <div className={styles.conversationLeft}>
                        <div className={styles.conversationName}>
                            {conversation.userName || 'Unknown'}
                        </div>
                        <div className={styles.conversationLastMessage}>
                            {conversation.lastMessage || conversation.LastMessage || 'Chưa có tin nhắn'}
                        </div>
                    </div>
                    <div className={styles.conversationRight}>
                        <div className={styles.conversationTime}>
                            {(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) ?
                                formatTime(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) : ''}
                        </div>
                        {hasUnread && (
                            <div className={styles.unreadBadge}>
                                {/* If HasUnread is boolean, show dot. If unreadCount is number, show count */}
                                {conversation.unreadCount > 0 ?
                                    (conversation.unreadCount > 9 ? '9+' : conversation.unreadCount) :
                                    '•'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Render conversation list
    const renderConversationsList = () => (
        <div className={`${styles.conversationsList} ${!isMobile || !showMobileChat ? styles.show : ''}`}>
            <div className={styles.conversationsHeader}>
                <h5 className={styles.conversationsTitle}>
                    <FaComments />
                    Liên hệ y tá
                </h5>
            </div>

            <div className={styles.conversationsBody}>
                <Button
                    className={styles.newChatButton}
                    onClick={startNewChat}
                >
                    + Trò chuyện mới
                </Button>

                {loading ? (
                    <div className={styles.conversationsLoading}>
                        <Spinner animation="border" size="sm" />
                        <div>Đang tải...</div>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className={styles.emptyConversations}>
                        <FaComments size={48} />
                        <div>Chưa có cuộc trò chuyện nào</div>
                    </div>
                ) : (
                    conversations.map(renderConversationItem)
                )}
            </div>
        </div>
    );

    // Render chat area
    const renderChatArea = () => {
        if (isNewChatMode) {
            return (
                <div className={styles.newChatContainer}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        {isMobile && (
                            <Button
                                variant="link"
                                className={styles.backButton}
                                onClick={handleBackToList}
                            >
                                <FaArrowLeft />
                            </Button>
                        )}
                        <h6 className={styles.chatTitle}>
                            <span className={styles.statusIndicator}></span>
                            {selectedConversation?.nurseName !== 'Hệ thống tư vấn'
                                ? 'Cuộc trò chuyện mới'
                                : `Liên hệ với ${selectedConversation?.nurseName}`}
                        </h6>
                    </div>

                    {/* New chat instructions */}
                    <div className={styles.newChatContent}>
                        <div>
                            <FaComments size={48} className={styles.newChatIcon} />
                            <div className={styles.newChatTitle}>
                                {selectedConversation?.nurseName !== 'Hệ thống tư vấn'
                                    ? 'Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện với y tá'
                                    : `Gửi tin nhắn tới ${selectedConversation?.nurseName}`}
                            </div>
                            <div className={styles.newChatSubtitle}>
                                Y tá sẽ phản hồi sớm nhất có thể
                            </div>
                        </div>
                    </div>

                    {/* Message input */}
                    <div className={styles.messageInput}>
                        <Form onSubmit={sendMessage}>
                            <div className={styles.messageForm}>
                                <Form.Control
                                    className={styles.messageTextInput}
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={sending}
                                />
                                <Button
                                    type="submit"
                                    className={styles.sendButton}
                                    disabled={!newMessage.trim() || sending}
                                >
                                    {sending ? <Spinner size="sm" /> : <FaPaperPlane />}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            );
        }

        if (!selectedConversation) {
            return (
                <div className={styles.emptyChatState}>
                    <div>
                        <FaComments size={48} />
                        <div>Chọn một cuộc trò chuyện để bắt đầu</div>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.chatArea}>
                {/* Header */}
                <div className={styles.chatHeader}>
                    {isMobile && (
                        <Button
                            variant="link"
                            className={styles.backButton}
                            onClick={handleBackToList}
                        >
                            <FaArrowLeft />
                        </Button>
                    )}
                    <h6 className={styles.chatTitle}>
                        <span className={styles.statusIndicator}></span>
                        {selectedConversation.userName || 'Y tá'}
                    </h6>
                </div>

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    className={styles.messagesContainer}
                >
                    {/* Load More Button */}
                    {hasMoreMessages && !isNewChatMode && (
                        <div className={styles.loadMoreContainer}>
                            <Button
                                className={styles.loadMoreButton}
                                onClick={loadMoreMessages}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <Spinner size="sm" />
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        ⬆️ Tải thêm tin nhắn cũ hơn
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <div className={styles.emptyMessages}>
                            Chưa có tin nhắn
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`${styles.messageGroup} ${message.fromUserId === userId ? styles.sent : styles.received}`}
                            >
                                <div
                                    className={`${styles.messageBubble} ${message.fromUserId === userId ? styles.sent : styles.received}`}
                                >
                                    <div className={styles.messageText}>{message.message || message.Message || message.content}</div>
                                    <div className={styles.messageTime}>
                                        {formatTime(message.timestamp || message.Timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message input */}
                <div className={styles.messageInput}>
                    <Form onSubmit={sendMessage}>
                        <div className={styles.messageForm}>
                            <Form.Control
                                className={styles.messageTextInput}
                                type="text"
                                placeholder="Nhập tin nhắn..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sending}
                            />
                            <Button
                                type="submit"
                                className={styles.sendButton}
                                disabled={!newMessage.trim() || sending}
                            >
                                {sending ? <Spinner size="sm" /> : <FaPaperPlane />}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    };

    // Main render
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spinner animation="border" />
                <div>Đang tải tin nhắn...</div>
            </div>
        );
    }

    return (
        <div className={styles.chatContainer}>
            <Container>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}

                <div className={styles.chatLayout}>
                    {/* Conversation List */}
                    {renderConversationsList()}

                    {/* Chat Area */}
                    <div className={`${styles.chatArea} ${showMobileChat ? styles.showMobileChat : ''}`}>
                        {renderChatArea()}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ParentChat; 