import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, Tab, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaComments, FaPaperPlane, FaArrowLeft, FaClock, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import simpleChatAPI from '../../api/simpleChatApi';
import simpleSignalR from '../../services/simpleSignalR';

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

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Debouncing refs to prevent excessive API calls
    const loadConversationsTimeoutRef = useRef(null);
    const loadUnassignedTimeoutRef = useRef(null);
    const handlersRef = useRef({});

    // ===== STEP 2: DEFINE FUNCTIONS FIRST =====

    // Load conversation list
    const loadConversations = useCallback(async () => {
        try {
            console.log('📋 [NURSE] Loading conversations for userId:', userId);
            const data = await simpleChatAPI.getConversations(userId);

            if (data && data.length > 0) {
                console.log('📋 [NURSE] All conversations:', data);
                console.log('📋 [NURSE] First conversation sample:', {
                    keys: Object.keys(data[0]),
                    values: data[0]
                });

                // Test partner ID detection for each conversation
                data.forEach((conv, index) => {
                    const partnerId = conv.user || conv.User || conv.parentId || conv.otherUserId ||
                        conv.userId || conv.ParentId || conv.UserId;
                    console.log(`📋 [NURSE] Conversation ${index} partnerId detection:`, {
                        conversationObject: conv,
                        detectedPartnerId: partnerId,
                        availableFields: Object.keys(conv)
                    });
                });
            }

            setConversations(data);
        } catch (error) {
            console.error('❌ Error loading conversations:', error);
            if (activeTab === 'conversations') {
                setError('Không thể tải danh sách cuộc trò chuyện');
            }
        }
    }, [userId, activeTab]);

    // Load unassigned messages
    const loadUnassignedMessages = useCallback(async () => {
        try {
            console.log('📥 [NURSE] Loading unassigned messages...');
            const data = await simpleChatAPI.getUnassignedMessages();

            if (data && data.length > 0) {
                console.log('📥 [NURSE] Unassigned messages data:', data);
                console.log('📥 [NURSE] First unassigned message sample:', {
                    keys: Object.keys(data[0]),
                    values: data[0]
                });
            } else {
                console.log('📥 [NURSE] No unassigned messages found');
            }

            setUnassignedMessages(data);
        } catch (error) {
            console.error('❌ Error loading unassigned messages:', error);
            if (activeTab === 'unassigned') {
                setError('Không thể tải tin nhắn chưa được xử lý');
            }
        }
    }, [activeTab]);

    // Load chat history when clicking a conversation
    const loadChatHistory = useCallback(async (conversation) => {
        try {
            console.log('📜 [NURSE] Selected conversation object:', JSON.stringify(conversation, null, 2));

            // Try multiple possible field names for partner ID (same as parent chat)
            // API returns 'user' field as the partner ID (lowercase)
            const partnerId = conversation.user ||      // ← PRIMARY FIELD FROM API (lowercase)
                conversation.User ||      // ← Fallback to uppercase
                conversation.parentId ||
                conversation.otherUserId ||
                conversation.userId ||
                conversation.ParentId ||
                conversation.UserId;

            console.log('📜 [NURSE] Loading chat history with partnerId:', partnerId);

            if (!partnerId) {
                console.error('❌ No valid partnerId found in conversation:', Object.keys(conversation));
                setError('Không thể xác định người nhận. Vui lòng thử lại.');
                return;
            }

            // Reset pagination and load latest messages (skip: 0, take: 50)
            console.log('📜 [NURSE] Loading latest 50 messages...');
            const history = await simpleChatAPI.getChatHistory(userId, partnerId, 0, 50);

            console.log('📜 [NURSE] Loaded messages:', history.length);

            // Set messages (API returns newest first, so reverse to show oldest at top)
            setMessages(history.reverse());
            setSelectedConversation(conversation);

            // Reset pagination states
            setSkip(history.length);
            setHasMoreMessages(history.length === 50); // If we got 50 messages, there might be more

            console.log('📜 [NURSE] Pagination state:', {
                skip: history.length,
                hasMoreMessages: history.length === 50,
                totalLoaded: history.length
            });

            if (isMobile) {
                setShowMobileChat(true);
            }

            // Auto scroll to bottom (latest message)
            setTimeout(() => scrollToBottom(), 100);

            // Manual delay then refresh conversation list
            setTimeout(async () => {
                await loadConversations();
            }, 500);

        } catch (error) {
            console.error('❌ Error loading chat history:', error);
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

            console.log('📜 [NURSE] Loading more messages...', {
                partnerId,
                currentSkip: skip,
                nextSkip: skip,
                take: 50
            });

            // Load older messages (skip current amount, take 50 more)
            const olderMessages = await simpleChatAPI.getChatHistory(userId, partnerId, skip, 50);

            console.log('📜 [NURSE] Loaded older messages:', olderMessages.length);

            if (olderMessages.length > 0) {
                // Prepend older messages to the beginning (reverse them first since API returns newest first)
                setMessages(prevMessages => [...olderMessages.reverse(), ...prevMessages]);

                // Update pagination state
                setSkip(prevSkip => prevSkip + olderMessages.length);
                setHasMoreMessages(olderMessages.length === 50); // If we got 50, there might be more

                console.log('📜 [NURSE] Updated pagination state:', {
                    newSkip: skip + olderMessages.length,
                    hasMoreMessages: olderMessages.length === 50,
                    totalLoaded: messages.length + olderMessages.length
                });
            } else {
                // No more messages
                setHasMoreMessages(false);
                console.log('📜 [NURSE] No more older messages to load');
            }

        } catch (error) {
            console.error('❌ Error loading more messages:', error);
            setError('Không thể tải thêm tin nhắn');
        } finally {
            setLoadingMore(false);
        }
    }, [selectedConversation, loadingMore, hasMoreMessages, skip, userId, messages.length]);

    // ===== STEP 1: INITIALIZE SIGNALR AND LOAD DATA =====
    useEffect(() => {
        if (!userId) return;

        const init = async () => {
            console.log('🚀 [NURSE] Initializing chat...');

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
            console.log('📨 [NURSE] SignalR message received:', JSON.stringify(messageData, null, 2));

            const { fromUserId, toUserId } = messageData;
            const currentUserId = parseInt(userId);

            // Check if this message is for current conversation
            if (selectedConversation) {
                // Get current conversation partner ID
                const partnerId = selectedConversation.user || selectedConversation.User ||
                    selectedConversation.parentId || selectedConversation.otherUserId ||
                    selectedConversation.userId || selectedConversation.ParentId ||
                    selectedConversation.UserId;

                console.log('🔍 [NURSE] Checking if message belongs to current conversation:', {
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
                    console.log('🔄 [NURSE] Message belongs to current conversation - refreshing chat history');

                    // Refresh chat history for current conversation (reload latest messages)
                    setTimeout(async () => {
                        await loadChatHistory(selectedConversation);
                    }, 500);
                }
            }

            // Always refresh data to update lists
            console.log('🔄 [NURSE] Refreshing conversation and unassigned lists');
            setTimeout(async () => {
                await Promise.all([loadConversations(), loadUnassignedMessages()]);
            }, 1000);
        };

        // Handler for new unassigned messages
        const handleNewUnassignedMessage = async (messageData) => {
            console.log('📥 [NURSE] New unassigned message received:', JSON.stringify(messageData, null, 2));

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
            setAssigning(true);
            console.log('👩‍⚕️ [NURSE] Assigning message from parent:', parentId, 'to nurse:', userId);

            await simpleChatAPI.assignMessage(parentId, userId);

            // Switch to conversations tab and load the new conversation
            setActiveTab('conversations');
            await Promise.all([loadConversations(), loadUnassignedMessages()]);

            // Find and open the newly assigned conversation
            setTimeout(async () => {
                await loadConversations();
                const assignedConversation = conversations.find(conv =>
                    (conv.user || conv.User || conv.parentId || conv.otherUserId) === parentId
                );
                if (assignedConversation) {
                    await loadChatHistory(assignedConversation);
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Error assigning message:', error);
            setError('Không thể tiếp nhận tin nhắn');
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

            console.log('📤 [NURSE] Selected conversation for sending:', JSON.stringify(selectedConversation, null, 2));
            console.log('📤 [NURSE] Available fields:', Object.keys(selectedConversation));

            // Try multiple possible field names for partner ID (same as parent chat)
            // API returns 'user' field as the partner ID (lowercase)
            const partnerId = selectedConversation.user ||      // ← PRIMARY FIELD FROM API (lowercase)
                selectedConversation.User ||      // ← Fallback to uppercase
                selectedConversation.parentId ||
                selectedConversation.otherUserId ||
                selectedConversation.userId ||
                selectedConversation.ParentId ||
                selectedConversation.UserId;

            if (!partnerId) {
                console.error('❌ No valid partnerId found in selectedConversation:', Object.keys(selectedConversation || {}));
                throw new Error('Không xác định được người nhận. Cấu trúc dữ liệu không đúng.');
            }

            console.log('📤 [NURSE] Sending message to partnerId:', partnerId);

            // Send via REST API
            await simpleChatAPI.sendMessage(userId, partnerId, newMessage);

            // Clear input immediately
            setNewMessage('');

            // Reload chat history to show latest messages
            await loadChatHistory(selectedConversation);

        } catch (error) {
            console.error('❌ Error sending message:', error);
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
                console.log('🔄 [NURSE] Auto-refreshing unassigned messages...');
                loadUnassignedMessages();
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [activeTab]);

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
                            conv?.parentId || conv?.otherUserId || conv?.userId ||
                            conv?.ParentId || conv?.UserId;
                    };

                    const isActive = selectedConversation &&
                        getPartnerId(selectedConversation) === getPartnerId(conversation);
                    return isActive ? 'active' : '';
                })()}`}
                onClick={() => loadChatHistory(conversation)}
                style={{
                    padding: '12px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: hasUnread ? 'rgba(102, 126, 234, 0.08)' : '#f8f9fa',
                    borderLeft: hasUnread ? '4px solid #667eea' : '4px solid transparent',
                    fontWeight: hasUnread ? '600' : '400'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontWeight: hasUnread ? '700' : '500',
                            color: hasUnread ? '#2d3748' : '#4a5568',
                            marginBottom: '4px'
                        }}>
                            {conversation.parentName || `Phụ huynh #${conversation.user || conversation.User || conversation.parentId || 'Unknown'}`}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            color: hasUnread ? '#4a5568' : '#718096',
                            fontWeight: hasUnread ? '600' : '400'
                        }}>
                            {conversation.lastMessage || conversation.LastMessage || 'Chưa có tin nhắn'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            fontSize: '0.8rem',
                            color: hasUnread ? '#667eea' : '#a0aec0',
                            fontWeight: hasUnread ? '600' : '400',
                            marginBottom: '4px'
                        }}>
                            {(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) ?
                                formatTime(conversation.timestamp || conversation.Timestamp || conversation.lastMessageTime) : ''}
                        </div>
                        {hasUnread && (
                            <div style={{
                                backgroundColor: '#667eea',
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

    // Render unassigned message item
    const renderUnassignedItem = (unassigned, index) => {
        console.log('📋 [NURSE] Unassigned message object:', JSON.stringify(unassigned, null, 2));

        // API returns: {user: parentId, lastMessage: message, timestamp: time, hasUnread: false}
        const parentId = unassigned.user;  // This is the parent's ID (lowercase!)
        const messageText = unassigned.lastMessage;  // lowercase!
        const timestamp = unassigned.timestamp;  // lowercase!

        return (
            <div
                key={index}
                style={{
                    padding: '12px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 193, 7, 0.08)',
                    borderLeft: '4px solid #ffc107',
                    border: '1px solid rgba(255, 193, 7, 0.2)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                        <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                            {unassigned.parentName || `Phụ huynh #${parentId || 'Unknown'}`}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#ffc107', fontWeight: '600' }}>
                            <FaClock style={{ marginRight: '4px' }} />
                            Chờ tiếp nhận - Tin nhắn mới
                        </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                        {timestamp ? formatTime(timestamp) : ''}
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(255, 249, 196, 0.5)',
                    padding: '8px',
                    borderRadius: '8px',
                    marginBottom: '8px'
                }}>
                    <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>
                        {messageText || 'Tin nhắn mới'}
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() => assignMessage(parentId)}
                        disabled={assigning || !parentId}
                        style={{ fontWeight: '600' }}
                    >
                        {assigning ? <Spinner size="sm" /> : <><FaUserCheck style={{ marginRight: '4px' }} />Tiếp nhận</>}
                    </Button>
                </div>
            </div>
        );
    };

    // Render conversation list
    const renderConversationsList = () => (
        <div style={{ height: '100%', overflow: 'auto' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #dee2e6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaComments />
                        Cuộc trò chuyện ({conversations.length})
                    </h5>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={loadConversations}
                        disabled={loading}
                        style={{ fontSize: '0.8rem' }}
                    >
                        {loading ? <Spinner size="sm" /> : '🔄'}
                    </Button>
                </div>
            </div>

            <div style={{ padding: '16px' }}>
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

    // Render unassigned messages list
    const renderUnassignedList = () => (
        <div style={{ height: '100%', overflow: 'auto' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #dee2e6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaClock />
                        Tin nhắn chờ xử lý ({unassignedMessages.length})
                    </h5>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={loadUnassignedMessages}
                        disabled={loading}
                        style={{ fontSize: '0.8rem' }}
                    >
                        {loading ? <Spinner size="sm" /> : '🔄'}
                    </Button>
                </div>
            </div>

            <div style={{ padding: '16px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Spinner animation="border" size="sm" />
                        <div>Đang tải...</div>
                    </div>
                ) : unassignedMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                        <FaClock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <div>Không có tin nhắn chờ xử lý</div>
                        <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                            Tất cả tin nhắn đã được tiếp nhận
                        </div>
                    </div>
                ) : (
                    unassignedMessages.map(renderUnassignedItem)
                )}
            </div>
        </div>
    );

    // Render chat area
    const renderChatArea = () => {
        if (!selectedConversation) {
            return (
                <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6c757d',
                    textAlign: 'center'
                }}>
                    <div>
                        <FaComments size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <div>Chọn một cuộc trò chuyện để bắt đầu</div>
                    </div>
                </div>
            );
        }

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #dee2e6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    {isMobile && (
                        <Button
                            variant="link"
                            onClick={handleBackToList}
                            style={{ padding: '0', minWidth: 'auto' }}
                        >
                            <FaArrowLeft />
                        </Button>
                    )}
                    <h6 style={{ margin: 0 }}>
                        {selectedConversation.parentName || `Phụ huynh #${selectedConversation.user || selectedConversation.User || selectedConversation.parentId || 'Unknown'}`}
                    </h6>
                </div>

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '16px',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    {/* Load More Button */}
                    {hasMoreMessages && (
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '16px',
                            padding: '8px'
                        }}>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={loadMoreMessages}
                                disabled={loadingMore}
                                style={{
                                    fontSize: '0.85rem',
                                    padding: '6px 16px',
                                    borderRadius: '20px'
                                }}
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
                                    style={{
                                        maxWidth: '70%',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        backgroundColor: message.fromUserId === userId ? '#667eea' : 'white',
                                        color: message.fromUserId === userId ? 'white' : '#333',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div>{message.message || message.Message || message.content}</div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        opacity: 0.7,
                                        marginTop: '4px',
                                        textAlign: 'right'
                                    }}>
                                        {formatTime(message.timestamp || message.Timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div style={{ padding: '16px', borderTop: '1px solid #dee2e6' }}>
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
        <div className="nurse-chat-container">
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
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
                        style={{ borderBottom: '1px solid #dee2e6' }}
                    >
                        <Tab
                            eventKey="conversations"
                            title={
                                <span>
                                    <FaComments style={{ marginRight: '4px' }} />
                                    Trò chuyện
                                    {conversations.length > 0 && (
                                        <span style={{
                                            marginLeft: '4px',
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            borderRadius: '10px',
                                            padding: '0 6px',
                                            fontSize: '0.75rem'
                                        }}>
                                            {conversations.length}
                                        </span>
                                    )}
                                </span>
                            }
                        >
                            {renderConversationsList()}
                        </Tab>
                        <Tab
                            eventKey="unassigned"
                            title={
                                <span>
                                    <FaClock style={{ marginRight: '4px' }} />
                                    Chờ xử lý
                                    {unassignedMessages.length > 0 && (
                                        <span style={{
                                            marginLeft: '4px',
                                            backgroundColor: '#ffc107',
                                            color: 'white',
                                            borderRadius: '10px',
                                            padding: '0 6px',
                                            fontSize: '0.75rem'
                                        }}>
                                            {unassignedMessages.length}
                                        </span>
                                    )}
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