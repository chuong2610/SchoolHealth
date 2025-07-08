import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Button, Spinner, Alert, Row } from 'react-bootstrap';
import { FaComments, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import simpleChatAPI from '../../api/simpleChatApi';
import simpleSignalR from '../../services/simpleSignalR';
import '../../styles/parent/chat/index.css';
import { useLocation } from 'react-router-dom';

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
                console.log('📋 [PARENT] Loading conversations...');
                const data = await simpleChatAPI.getConversations(userId);

                console.log('📋 [PARENT] Conversations count:', data?.length || 0);
                console.log('📋 [PARENT] Conversations data:', data);

                setConversations(data || []);
                setError('');
            } catch (error) {
                console.error('❌ Error loading conversations:', error);
                setError('Không thể tải danh sách cuộc trò chuyện');
            }
        }, 300); // Reduced debounce time
    }, [userId]);

    // Load chat history when clicking a conversation
    const loadChatHistory = useCallback(async (conversation) => {
        try {
            console.log('📜 [PARENT] Loading chat history for conversation:', conversation);

            // Get partner ID (nurse ID) from conversation
            const nurseId = conversation.User ||
                conversation.nurseId ||
                conversation.otherUserId ||
                conversation.userId ||
                conversation.user ||
                conversation.NurseId ||
                conversation.UserId;

            console.log('📜 [PARENT] Loading chat history with nurseId:', nurseId);

            if (!nurseId) {
                console.error('❌ No valid nurseId found in conversation:', Object.keys(conversation));
                setError('Không thể xác định y tá. Vui lòng thử lại.');
                return;
            }

            // Reset pagination and load latest messages (skip: 0, take: 50)
            console.log('📜 [PARENT] Loading latest 50 messages...');
            const history = await simpleChatAPI.getChatHistory(userId, nurseId, 0, 50);

            console.log('📜 [PARENT] Loaded messages:', history.length);

            // Set messages (API returns newest first, so reverse to show oldest at top)
            setMessages(history.reverse());
            setSelectedConversation(conversation);
            setIsNewChatMode(false);

            // Reset pagination states
            setSkip(history.length);
            setHasMoreMessages(history.length === 50); // If we got 50 messages, there might be more

            console.log('📜 [PARENT] Pagination state:', {
                skip: history.length,
                hasMoreMessages: history.length === 50,
                totalLoaded: history.length
            });

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
            console.error('❌ Error loading chat history:', error);
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

            console.log('📜 [PARENT] Loading more messages...', {
                nurseId,
                currentSkip: skip,
                nextSkip: skip,
                take: 50
            });

            // Load older messages (skip current amount, take 50 more)
            const olderMessages = await simpleChatAPI.getChatHistory(userId, nurseId, skip, 50);

            console.log('📜 [PARENT] Loaded older messages:', olderMessages.length);

            if (olderMessages.length > 0) {
                // Prepend older messages to the beginning (reverse them first since API returns newest first)
                setMessages(prevMessages => [...olderMessages.reverse(), ...prevMessages]);

                // Update pagination state
                setSkip(prevSkip => prevSkip + olderMessages.length);
                setHasMoreMessages(olderMessages.length === 50); // If we got 50, there might be more

                console.log('📜 [PARENT] Updated pagination state:', {
                    newSkip: skip + olderMessages.length,
                    hasMoreMessages: olderMessages.length === 50,
                    totalLoaded: messages.length + olderMessages.length
                });
            } else {
                // No more messages
                setHasMoreMessages(false);
                console.log('📜 [PARENT] No more older messages to load');
            }

        } catch (error) {
            console.error('❌ Error loading more messages:', error);
            setError('Không thể tải thêm tin nhắn');
        } finally {
            setLoadingMore(false);
        }
    }, [selectedConversation, loadingMore, hasMoreMessages, skip, userId, messages.length, isNewChatMode]);

    // ===== STEP 1: INITIALIZE AND LOAD DATA =====
    useEffect(() => {
        if (!userId) return;

        const init = async () => {
            console.log('🚀 [PARENT] Initializing chat...');

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

        console.log('🚀 [PARENT] Auto-starting chat with nurse:', location.state.nurseName, 'nurseId:', location.state.nurseId);

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
                console.log('🚀 [PARENT] Found existing conversation with nurse:', {
                    nurseId: getNurseIdFromConversation(nurseConversation),
                    nurseName: getNurseNameFromConversation(nurseConversation)
                });
                await loadChatHistory(nurseConversation);
            } else {
                console.log('🚀 [PARENT] Starting new chat with nurse:', {
                    nurseId: location.state.nurseId,
                    nurseName: location.state.nurseName
                });
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
            console.log('📨 [PARENT] SignalR message received:', JSON.stringify(messageData, null, 2));

            const { fromUserId, toUserId } = messageData;
            const currentUserId = parseInt(userId);

            // Check if this message is for current conversation
            if (selectedConversation && !isNewChatMode) {
                // Get current conversation partner ID
                const partnerId = selectedConversation.user || selectedConversation.User ||
                    selectedConversation.nurseId || selectedConversation.otherUserId ||
                    selectedConversation.userId || selectedConversation.NurseId ||
                    selectedConversation.UserId;

                console.log('🔍 [PARENT] Checking if message belongs to current conversation:', {
                    messageFromUserId: fromUserId,
                    messageToUserId: toUserId,
                    currentUserId,
                    conversationPartnerId: partnerId
                });

                // Check if message is part of current conversation
                const isCurrentConversation =
                    (fromUserId === partnerId && toUserId === currentUserId) ||  // Partner → Me
                    (fromUserId === currentUserId && toUserId === partnerId);     // Me → Partner

                if (isCurrentConversation) {
                    console.log('🔄 [PARENT] Message belongs to current conversation - refreshing chat history');

                    // Refresh chat history for current conversation (reload latest messages)
                    setTimeout(async () => {
                        await loadChatHistory(selectedConversation);
                    }, 500);
                }
            }

            // Always refresh conversation list to update last message
            console.log('🔄 [PARENT] Refreshing conversation list');
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
                console.log('📤 [PARENT] Sending new chat message to system (toUserId: null)');
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
                console.log('📤 [PARENT] Sending new chat message to nurseId:', selectedConversation.nurseId);
                await simpleChatAPI.sendMessage(userId, selectedConversation.nurseId, newMessage);
                setNewMessage('');
                setIsNewChatMode(false);
                await loadConversations();
                setSuccess('Tin nhắn đã được gửi! Y tá sẽ sớm phản hồi.');
                return;
            }

            // Existing conversation - send to specific nurse
            console.log('📤 [PARENT] Selected conversation for sending:', selectedConversation);
            const nurseId = selectedConversation?.user ||
                selectedConversation?.User ||
                selectedConversation?.nurseId ||
                selectedConversation?.otherUserId ||
                selectedConversation?.userId ||
                selectedConversation?.NurseId ||
                selectedConversation?.UserId;
            if (!nurseId) {
                console.error('❌ No valid nurseId found in selectedConversation:', Object.keys(selectedConversation || {}));
                throw new Error('Không xác định được y tá. Cấu trúc dữ liệu không đúng.');
            }
            console.log('📤 [PARENT] Sending message to nurseId:', nurseId);
            await simpleChatAPI.sendMessage(userId, nurseId, newMessage);
            setNewMessage('');
            await loadChatHistory(selectedConversation);
        } catch (error) {
            console.error('❌ Error sending message:', error);
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
                className={`conversation-item ${hasUnread ? 'has-unread' : ''} ${(() => {
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
                    return isActive ? 'active' : '';
                })()}`}
                onClick={() => loadChatHistory(conversation)}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div className="nurse-name">
                            {conversation.userName || 'Unknown'}
                        </div>
                        <div className="last-message">
                            {conversation.lastMessage || conversation.LastMessage || 'Chưa có tin nhắn'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="message-time">
                            {(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) ?
                                formatTime(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) : ''}
                        </div>
                        {hasUnread && (
                            <div style={{
                                backgroundColor: '#2563eb',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginLeft: 'auto'
                            }}>
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
        <div className="conversation-list" style={{ height: '100%', overflow: 'auto' }}>
            <div className="conversations-header">
                <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaComments />
                    Liên hệ y tá
                </h5>
            </div>

            <div style={{ padding: '16px' }}>
                <Row className="justify-content-center mx-5">
                    <Button
                        className="btn-new-chat"
                        variant="primary"
                        onClick={startNewChat}
                    >
                        + Trò chuyện mới
                    </Button>
                </Row>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spinner animation="border" size="sm" />
                        <div>Đang tải...</div>
                    </div>
                ) : conversations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        <FaComments size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
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
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <div className="chat-header">
                        {isMobile && (
                            <Button
                                variant="link"
                                onClick={handleBackToList}
                                style={{ padding: '0', minWidth: 'auto' }}
                            >
                                <FaArrowLeft />
                            </Button>
                        )}
                        <h6>
                            <span className="nurse-status"></span>
                            {selectedConversation?.nurseName !== 'Hệ thống tư vấn'
                                ? 'Cuộc trò chuyện mới'
                                : `Liên hệ với ${selectedConversation?.nurseName}`}
                        </h6>
                    </div>

                    {/* New chat instructions */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        textAlign: 'center',
                        color: '#6c757d'
                    }}>
                        <div>
                            <FaComments size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <div>
                                {selectedConversation?.nurseName !== 'Hệ thống tư vấn'
                                    ? 'Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện với y tá'

                                    : `Gửi tin nhắn tới ${selectedConversation?.nurseName}`}
                            </div>
                            <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                                Y tá sẽ phản hồi sớm nhất có thể
                            </div>
                        </div>
                    </div>

                    {/* Message input */}
                    <div className="message-input-area">
                        <Form onSubmit={sendMessage}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={sending}
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
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
                <div className="empty-state" style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div>
                        <FaComments size={48} />
                        <div>Chọn một cuộc trò chuyện để bắt đầu</div>
                    </div>
                </div>
            );
        }

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div className="chat-header">
                    {isMobile && (
                        <Button
                            variant="link"
                            onClick={handleBackToList}
                            style={{ padding: '0', minWidth: 'auto' }}
                        >
                            <FaArrowLeft />
                        </Button>
                    )}
                    <h6>
                        <span className="nurse-status"></span>
                        {selectedConversation.userName || 'Y tá'}
                    </h6>
                </div>

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    className="messages-area"
                    style={{
                        flex: 1,
                        overflow: 'auto'
                    }}
                >
                    {/* Load More Button */}
                    {hasMoreMessages && !isNewChatMode && (
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '16px',
                            padding: '8px'
                        }}>
                            <Button
                                className="btn-load-more"
                                variant="outline-secondary"
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
                        <div style={{ textAlign: 'center', color: '#6c757d' }}>
                            Chưa có tin nhắn
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: message.fromUserId === userId ? 'flex-end' : 'flex-start',
                                    marginBottom: '12px'
                                }}
                            >
                                <div
                                    className={`message-bubble ${message.fromUserId === userId ? 'sent' : 'received'}`}
                                >
                                    <div>{message.message || message.Message || message.content}</div>
                                    <div className="message-time">
                                        {formatTime(message.timestamp || message.Timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message input */}
                <div className="message-input-area">
                    <Form onSubmit={sendMessage}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tin nhắn..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={sending}
                            />
                            <Button
                                type="submit"
                                variant="primary"
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
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Spinner animation="border" />
                <div>Đang tải tin nhắn...</div>
            </div>
        );
    }

    return (
        <div className="parent-chat-container">
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

            <div style={{
                height: 'calc(100vh - 120px)',
                display: 'flex',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                {/* Conversation List */}
                <div style={{
                    width: isMobile ? '100%' : '300px',
                    borderRight: isMobile ? 'none' : '1px solid #dee2e6',
                    display: isMobile && showMobileChat ? 'none' : 'block'
                }}>
                    {renderConversationsList()}
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

export default ParentChat; 