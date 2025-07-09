import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, Tab, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaComments, FaPaperPlane, FaArrowLeft, FaClock, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import simpleChatAPI from '../../api/simpleChatApi';
import simpleSignalR from '../../services/simpleSignalR';
import '../../styles/nurse/chat/index.css';

const NurseChat = () => {
    const { user, clearUnreadMessages } = useAuth();
    const userId = user?.id;

    // States
    const [activeTab, setActiveTab] = useState('conversations');
    const [conversations, setConversations] = useState([]);
    const [unassignedMessages, setUnassignedMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showMobileChat, setShowMobileChat] = useState(false);

    // Pagination states for chat history
    const [skip, setSkip] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const messagesContainerRef = useRef(null);
    const loadConversationsTimeoutRef = useRef(null);
    const loadUnassignedTimeoutRef = useRef(null);
    const handlersRef = useRef({});

    // ===== STEP 2: DEFINE FUNCTIONS FIRST =====

    // Load conversation list
    const loadConversations = useCallback(async () => {
        try {
            const data = await simpleChatAPI.getConversations(userId);

            setConversations(data);
        } catch (error) {
            if (activeTab === 'conversations') {
                setError('Không thể tải danh sách cuộc trò chuyện');
            }
        }
    }, [userId, activeTab]);

    // Load unassigned messages
    const loadUnassignedMessages = useCallback(async () => {
        // Clear existing timeout
        if (loadUnassignedTimeoutRef.current) {
            clearTimeout(loadUnassignedTimeoutRef.current);
        }

        // Debounce the actual API call
        loadUnassignedTimeoutRef.current = setTimeout(async () => {
            try {
                const data = await simpleChatAPI.getUnassignedMessages();

                setUnassignedMessages(data);
            } catch (error) {
                if (activeTab === 'unassigned') {
                    setError('Không thể tải tin nhắn chưa được xử lý');
                }
            }
        }, 300); // 300ms debounce
    }, [activeTab]);

    // Load chat history when clicking a conversation
    const loadChatHistory = useCallback(async (conversation) => {
        try {
            // Try multiple possible field names for partner ID (same as parent chat)
            // API returns 'user' field as the partner ID (lowercase)
            const partnerId = conversation.user ||      // ← PRIMARY FIELD FROM API (lowercase)
                conversation.User ||      // ← Fallback to uppercase
                conversation.parentId ||
                conversation.otherUserId ||
                conversation.userId ||
                conversation.ParentId ||
                conversation.UserId;

            if (!partnerId) {
                setError('Không thể xác định người nhận. Vui lòng thử lại.');
                return;
            }

            // Reset pagination and load latest messages (skip: 0, take: 50)
            const history = await simpleChatAPI.getChatHistory(userId, partnerId, 0, 50);

            // Set messages (API returns newest first, so reverse to show oldest at top)
            setMessages(history.reverse());
            setSelectedConversation(conversation);

            // Reset pagination states
            setSkip(history.length);
            setHasMoreMessages(history.length === 50); // If we got 50 messages, there might be more

            if (isMobile) {
                setShowMobileChat(true);
            }

            // Auto scroll to bottom (latest message) - immediate scroll
            scrollToBottom();

            // Manual delay then refresh conversation list
            setTimeout(async () => {
                await loadConversations();
            }, 500);

        } catch (error) {
            setError('Không thể tải lịch sử chat');
        }
    }, [userId, loadConversations]);

    // Load more older messages (pagination)
    const loadMoreMessages = useCallback(async () => {
        if (!selectedConversation || loadingMore || !hasMoreMessages) return;

        try {
            setLoadingMore(true);

            // Get partner ID from selected conversation
            const partnerId = selectedConversation.user ||
                selectedConversation.User ||
                selectedConversation.parentId ||
                selectedConversation.otherUserId ||
                selectedConversation.userId ||
                selectedConversation.ParentId ||
                selectedConversation.UserId;

            // Load older messages (skip current amount, take 50 more)
            const olderMessages = await simpleChatAPI.getChatHistory(userId, partnerId, skip, 50);

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
    }, [selectedConversation, loadingMore, hasMoreMessages, skip, userId, messages.length]);

    // ===== STEP 1: INITIALIZE SIGNALR AND LOAD DATA =====
    useEffect(() => {
        if (!userId) return;

        const init = async () => {
            // Clear unread messages since user is now on chat page
            clearUnreadMessages();

            // Load initial data
            await Promise.all([
                loadConversations(),
                loadUnassignedMessages()
            ]);

            setLoading(false);
        };

        init();

        // Cleanup
        return () => {
            // Clear any pending timeouts
            if (loadConversationsTimeoutRef.current) {
                clearTimeout(loadConversationsTimeoutRef.current);
            }
            if (loadUnassignedTimeoutRef.current) {
                clearTimeout(loadUnassignedTimeoutRef.current);
            }
        };
    }, [userId, clearUnreadMessages, loadConversations, loadUnassignedMessages]);

    // ===== STEP 3: SETUP SIGNALR EVENT LISTENERS FOR AUTO-REFRESH =====
    useEffect(() => {
        if (!userId) return;

        // Handler for new messages received via SignalR
        const handleMessageReceived = async (messageData) => {
            const { fromUserId, toUserId } = messageData;
            const currentUserId = parseInt(userId);

            // Check if this message is for current conversation
            if (selectedConversation) {
                // Get current conversation partner ID
                const partnerId = selectedConversation.user || selectedConversation.User ||
                    selectedConversation.parentId || selectedConversation.otherUserId ||
                    selectedConversation.userId || selectedConversation.ParentId ||
                    selectedConversation.UserId;

                // Check if message is part of current conversation
                const isCurrentConversation =
                    (fromUserId === partnerId && toUserId === currentUserId) ||  // Partner → Me
                    (fromUserId === currentUserId && toUserId === partnerId);     // Me → Partner

                if (isCurrentConversation) {
                    // Refresh chat history for current conversation (reload latest messages)
                    setTimeout(async () => {
                        await loadChatHistory(selectedConversation);
                    }, 500);
                }
            }

            // Always refresh data to update lists
            setTimeout(async () => {
                await Promise.all([loadConversations(), loadUnassignedMessages()]);
            }, 1000);
        };

        // Handler for new unassigned messages
        const handleNewUnassignedMessage = async (messageData) => {
            // Refresh unassigned messages list
            setTimeout(async () => {
                await loadUnassignedMessages();
            }, 500);
        };

        // Add SignalR event listeners
        simpleSignalR.addEventListener('messageReceived', handleMessageReceived);
        simpleSignalR.addEventListener('newUnassignedMessage', handleNewUnassignedMessage);

        handlersRef.current.messageReceived = handleMessageReceived;
        handlersRef.current.newUnassignedMessage = handleNewUnassignedMessage;

        // Cleanup
        return () => {
            if (handlersRef.current.messageReceived) {
                simpleSignalR.removeEventListener('messageReceived', handlersRef.current.messageReceived);
                delete handlersRef.current.messageReceived;
            }
            if (handlersRef.current.newUnassignedMessage) {
                simpleSignalR.removeEventListener('newUnassignedMessage', handlersRef.current.newUnassignedMessage);
                delete handlersRef.current.newUnassignedMessage;
            }
        };
    }, [userId, selectedConversation, loadChatHistory, loadConversations, loadUnassignedMessages]);

    // ===== STEP 4: OTHER FUNCTIONS =====

    // Assign unassigned message to current nurse
    const assignMessage = async (parentId) => {
        try {
            if (!parentId) {
                setError('Không thể xác định ID phụ huynh');
                return;
            }

            if (!userId) {
                setError('Không thể xác định ID y tá');
                return;
            }

            setAssigning(true);
            setError(''); // Clear any existing errors

            await simpleChatAPI.assignMessage(parentId, userId);

            // Switch to conversations tab and load the new conversation
            setActiveTab('conversations');

            setTimeout(async () => {
                try {
                    await loadConversations();
                    const assignedConversation = conversations.find(conv => {
                        const convPartnerId = conv.user || conv.User || conv.userId || conv.UserId || conv.parentId || conv.otherUserId;
                        return String(convPartnerId) === String(parentId);
                    });

                    if (assignedConversation) {
                        await loadChatHistory(assignedConversation);
                    }
                } catch (error) {
                }
            }, 1000);

        } catch (error) {
            if (error.response?.status === 404) {
                setError('Không tìm thấy tin nhắn này');
            } else if (error.response?.status === 400) {
                setError('Dữ liệu không hợp lệ');
            } else if (error.response?.status === 500) {
                setError('Lỗi máy chủ, vui lòng thử lại');
            } else {
                setError('Không thể tiếp nhận tin nhắn. Vui lòng thử lại');
            }
        } finally {
            setAssigning(false);
        }
    };

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || !selectedConversation) return;

        try {
            setSending(true);
            setError('');

            // Try multiple possible field names for partner ID
            // API returns 'userId' field as the partner ID
            const partnerId = selectedConversation.userId ||    // ← PRIMARY FIELD FROM API 
                selectedConversation.UserId ||    // ← Fallback to uppercase
                selectedConversation.user ||      // ← Legacy field
                selectedConversation.User ||      // ← Legacy field uppercase
                selectedConversation.parentId ||
                selectedConversation.otherUserId ||
                selectedConversation.ParentId;

            if (!partnerId) {
                throw new Error('Không xác định được người nhận. Cấu trúc dữ liệu không đúng.');
            }

            // Send via REST API
            await simpleChatAPI.sendMessage(userId, partnerId, newMessage);

            // Clear input immediately
            setNewMessage('');

            // Reload chat history to show latest messages
            await loadChatHistory(selectedConversation);

        } catch (error) {
            setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    // Back to conversation list
    const handleBackToList = () => {
        setShowMobileChat(false);
        setSelectedConversation(null);
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

    // Auto refresh unassigned messages every 30 seconds
    useEffect(() => {
        if (activeTab === 'unassigned') {
            const interval = setInterval(() => {
                loadUnassignedMessages();
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [activeTab, loadUnassignedMessages]);

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

        // Helper function to get partner ID
        const getPartnerId = (conv) => {
            return conv?.userId ||   // ← PRIMARY FIELD FROM API 
                conv?.UserId ||      // ← Fallback to uppercase
                conv?.user ||        // ← Legacy field
                conv?.User ||        // ← Legacy field uppercase
                conv?.parentId || conv?.otherUserId ||
                conv?.ParentId;
        };

        const isActive = selectedConversation &&
            getPartnerId(selectedConversation) === getPartnerId(conversation);

        return (
            <div
                key={index}
                className={`nurse-conversation-item ${isActive ? 'active' : ''}`}
                onClick={() => loadChatHistory(conversation)}
            >
                <div className="nurse-conversation-header">
                    <div className="nurse-conversation-name">
                        {conversation.userName || conversation.UserName || conversation.parentName || conversation.ParentName || `Phụ huynh #${conversation.userId || conversation.UserId || conversation.user || conversation.User || conversation.parentId || 'Unknown'}`}
                    </div>
                    <div className="nurse-conversation-time">
                        {(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) ?
                            formatTime(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) : ''}
                    </div>
                </div>
                <div className="nurse-conversation-preview">
                    {conversation.lastMessage || conversation.LastMessage || 'Chưa có tin nhắn'}
                </div>
                {hasUnread && (
                    <div className="nurse-conversation-unread"></div>
                )}
            </div>
        );
    };

    // Render unassigned message item
    const renderUnassignedItem = (unassigned, index) => {
        // API returns: {userId: parentId, lastMessage: message, timestamp: time, hasUnread: false}
        // Try different field names for parentId
        const parentId = unassigned.userId || unassigned.UserId || unassigned.user || unassigned.User || unassigned.parentId || unassigned.ParentId || unassigned.fromUserId || unassigned.FromUserId;
        const messageText = unassigned.lastMessage || unassigned.LastMessage || unassigned.message || unassigned.Message;
        const timestamp = unassigned.timestamp || unassigned.Timestamp;

        return (
            <div key={index} className="nurse-unassigned-item">
                <div className="nurse-unassigned-header">
                    <div className="nurse-unassigned-parent">
                        {unassigned.userName || unassigned.UserName || unassigned.parentName || unassigned.ParentName || `Phụ huynh #${parentId || 'Unknown'}`}
                    </div>
                    <div className="nurse-unassigned-time">
                        {timestamp ? formatTime(timestamp) : ''}
                    </div>
                </div>

                <div className="nurse-unassigned-message">
                    {messageText || 'Tin nhắn mới'}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <Button
                        className="nurse-assign-btn"
                        size="sm"
                        onClick={() => {
                            if (!parentId) {
                                setError('Không thể xác định ID phụ huynh');
                                return;
                            }

                            // Safety timeout to prevent stuck state
                            const timeoutId = setTimeout(() => {
                                setAssigning(false);
                            }, 30000); // 30 seconds timeout

                            assignMessage(parentId).finally(() => {
                                clearTimeout(timeoutId);
                            });
                        }}
                        disabled={assigning || !parentId}
                        style={{
                            pointerEvents: 'auto',
                            cursor: (assigning || !parentId) ? 'not-allowed' : 'pointer',
                            opacity: (assigning || !parentId) ? 0.6 : 1
                        }}
                        title={
                            !parentId ? 'Không thể xác định ID phụ huynh' :
                                assigning ? 'Đang xử lý...' : 'Tiếp nhận tin nhắn này'
                        }
                    >
                        {assigning ? (
                            <>
                                <Spinner size="sm" style={{ marginRight: '4px' }} />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <FaUserCheck style={{ marginRight: '4px' }} />
                                Tiếp nhận
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    // Render conversation list
    const renderConversationsList = () => (
        <div className="nurse-conversation-list">
            {loading ? (
                <div className="nurse-chat-loading">
                    <Spinner animation="border" size="sm" />
                    <div>Đang tải...</div>
                </div>
            ) : conversations.length === 0 ? (
                <div className="nurse-chat-empty">
                    <FaComments className="nurse-chat-empty-icon" />
                    <div className="nurse-chat-empty-text">Chưa có cuộc trò chuyện nào</div>
                </div>
            ) : (
                conversations.map(renderConversationItem)
            )}
        </div>
    );

    // Render unassigned messages list
    const renderUnassignedList = () => (
        <div className="nurse-conversation-list">
            {loading ? (
                <div className="nurse-chat-loading">
                    <Spinner animation="border" size="sm" />
                    <div>Đang tải...</div>
                </div>
            ) : unassignedMessages.length === 0 ? (
                <div className="nurse-chat-empty">
                    <FaClock className="nurse-chat-empty-icon" />
                    <div className="nurse-chat-empty-text">Không có tin nhắn chờ xử lý</div>
                </div>
            ) : (
                unassignedMessages.map(renderUnassignedItem)
            )}
        </div>
    );

    // Render chat area
    const renderChatArea = () => {
        if (!selectedConversation) {
            return (
                <div className="nurse-chat-empty">
                    <FaComments className="nurse-chat-empty-icon" />
                    <div className="nurse-chat-empty-text">Chọn một cuộc trò chuyện để bắt đầu</div>
                </div>
            );
        }

        return (
            <div className="nurse-chat-area">
                {/* Header */}
                <div className="nurse-chat-header-bar">
                    {isMobile && (
                        <Button
                            className="nurse-chat-back-btn"
                            variant="link"
                            onClick={handleBackToList}
                        >
                            <FaArrowLeft />
                        </Button>
                    )}
                    <h6 className="nurse-chat-partner-name">
                        {selectedConversation.userName || selectedConversation.UserName || selectedConversation.parentName || selectedConversation.ParentName || `Phụ huynh #${selectedConversation.userId || selectedConversation.UserId || selectedConversation.user || selectedConversation.User || selectedConversation.parentId || 'Unknown'}`}
                    </h6>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} className="nurse-messages-container">
                    {/* Load More Button */}
                    {hasMoreMessages && (
                        <div className="nurse-load-more-container">
                            <Button
                                className="nurse-load-more-btn"
                                size="sm"
                                onClick={loadMoreMessages}
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <Spinner size="sm" style={{ marginRight: '8px' }} />
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
                        <div className="nurse-messages-empty">
                            Chưa có tin nhắn
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`nurse-message-wrapper ${message.fromUserId === userId ? 'own' : 'other'}`}
                            >
                                <div className={`nurse-message-bubble ${message.fromUserId === userId ? 'own' : 'other'}`}>
                                    <div className="nurse-message-content">
                                        {message.message || message.Message || message.content}
                                    </div>
                                    <div className="nurse-message-time">
                                        {formatTime(message.timestamp || message.Timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message input */}
                <div className="nurse-message-input-container">
                    <Form onSubmit={sendMessage} className="nurse-message-input-form">
                        <Form.Control
                            className="nurse-message-input"
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sending}
                        />
                        <Button
                            className="nurse-send-btn"
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                        >
                            {sending ? <Spinner size="sm" /> : <FaPaperPlane />}
                        </Button>
                    </Form>
                </div>
            </div>
        );
    };

    // Main render
    if (loading) {
        return (
            <div className="nurse-chat-loading">
                <Spinner animation="border" />
                <div>Đang tải tin nhắn...</div>
            </div>
        );
    }

    return (
        <div className="nurse-chat-container">
            {/* Header Banner */}
            <div className="nurse-chat-header">
                <h1 className="nurse-chat-title">💬 Tin nhắn</h1>
                <p className="nurse-chat-subtitle">Trao đổi với phụ huynh và xử lý tin nhắn</p>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <div className="nurse-chat-main">
                {/* Conversation/Unassigned List */}
                <div style={{
                    width: isMobile ? '100%' : '350px',
                    borderRight: isMobile ? 'none' : '1px solid #dee2e6',
                    display: isMobile && showMobileChat ? 'none' : 'block'
                }}>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(key) => setActiveTab(key)}
                        className="mb-0"
                    >
                        <Tab
                            eventKey="conversations"
                            title={
                                <span style={{ maxWidth: "140px" }}>
                                    <FaComments style={{ marginRight: '4px' }} />
                                    Trò chuyện
                                    <span className="nurse-chat-badge">
                                        {conversations?.length}
                                    </span>
                                </span>
                            }
                        >
                            {renderConversationsList()}
                        </Tab>
                        <Tab
                            eventKey="unassigned"
                            title={
                                <span style={{ maxWidth: "140px" }} >
                                    <FaClock style={{ marginRight: '4px' }} />
                                    Chờ xử lý
                                    <span className="nurse-chat-badge">
                                        {unassignedMessages?.length}
                                    </span>
                                </span>
                            }
                        >
                            {renderUnassignedList()}
                        </Tab>
                    </Tabs>
                </div>

                {/* Chat Area */}
                <div style={{
                    flex: 1,
                    display: isMobile && !showMobileChat ? 'none' : 'block'
                }}>
                    {renderChatArea()}
                </div>
            </div>
        </div>
    );
};

export default NurseChat; 