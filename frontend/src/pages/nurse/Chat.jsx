import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, Tab, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import {
    FaComments,
    FaClock,
    FaPaperPlane,
    FaUser,
    FaUserGraduate,
    FaSearch,
    FaEnvelope,
    FaCheckCircle,
    FaExclamationTriangle,
    FaHandHoldingMedical,
    FaStethoscope,
    FaUsers,
    FaInbox,
    FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import chatSignalR from '../../services/chatSignalR';
import '../../styles/nurse/chat/index.css';

const NurseChat = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('conversations');
    const [conversations, setConversations] = useState([]);
    const [unassignedMessages, setUnassignedMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [error, setError] = useState('');
    const [assigningId, setAssigningId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Pagination states
    const [skip, setSkip] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Smart scroll states
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [showNewMessageBadge, setShowNewMessageBadge] = useState(false);

    // Load data when component mounts and setup SignalR
    useEffect(() => {
        if (user?.id) {
            let signalRCleanup = null;

            // Load data immediately (hybrid system will work with/without SignalR)
            loadInitialData();
            checkUnreadMessages();

            // Setup SignalR for real-time features (optional)
            setupSignalRConnection().then(cleanup => {
                signalRCleanup = cleanup;
            }).catch(error => {
                console.warn('SignalR setup failed, continuing with REST API only:', error);
                // Don't show error to user, system still works via REST API
            });

            return () => {
                // Call SignalR event listener cleanup if available
                if (signalRCleanup) {
                    signalRCleanup();
                }
                // Stop SignalR connection
                chatSignalR.stopConnection();
            };
        }
    }, [user]);

    // Load data when connected
    useEffect(() => {
        if (user?.id && isConnected) {
            loadInitialData();
            checkUnreadMessages();
        }
    }, [user, isConnected]);

    // DEBUG: Disable smart scroll temporarily, only basic auto-scroll
    useEffect(() => {
        console.log('🔄 Auto scroll useEffect triggered:', {
            messagesLength: messages.length,
            selectedConversation: !!selectedConversation,
            lastMessage: messages[messages.length - 1]?.message?.substring(0, 50)
        });

        if (selectedConversation && messages.length > 0) {
            console.log('📤 Calling scrollToBottom');
            scrollToBottom(true); // Force scroll with longer delay for initial load
        }
    }, [selectedConversation, messages.length]);

    // Define loadMoreMessages first with useCallback
    const loadMoreMessages = useCallback(async () => {
        if (!selectedConversation || loadingMore || !hasMoreMessages) {
            console.log('❌ LoadMoreMessages blocked:', { selectedConversation: !!selectedConversation, loadingMore, hasMoreMessages });
            return;
        }

        const parentId = selectedConversation.parentId || selectedConversation.User || selectedConversation.user;
        if (!parentId) {
            console.log('❌ No parentId found');
            return;
        }

        console.log('🔄 Loading more messages...', { skip, parentId });
        setLoadingMore(true);

        try {
            // Get current scroll height to maintain position
            const container = messagesContainerRef.current;
            const prevScrollHeight = container?.scrollHeight || 0;

            // Load next batch of older messages
            const response = await chatSignalR.getChatHistory(user.id, parentId, skip, 50);
            console.log('📊 Response from getChatHistory:', { length: response?.length, skip });

            if (response && response.length > 0) {
                // Backend returns messages ordered by timestamp DESC (newest first)
                // We need to reverse to get oldest first for UI
                const olderMessages = [...response].reverse();
                console.log('📝 Adding older messages:', olderMessages.length);

                // Add older messages to the beginning of the current messages
                setMessages(prev => {
                    console.log('📝 Current messages count:', prev.length);
                    const newMessages = [...olderMessages, ...prev];
                    console.log('📝 New messages count:', newMessages.length);
                    return newMessages;
                });
                setSkip(prev => prev + response.length);
                setHasMoreMessages(response.length === 50); // If we got 50, there might be more

                // Maintain scroll position
                if (container) {
                    setTimeout(() => {
                        const newScrollHeight = container.scrollHeight;
                        const scrollDiff = newScrollHeight - prevScrollHeight;
                        container.scrollTop = scrollDiff;
                        console.log('📍 Scroll position maintained:', { prevScrollHeight, newScrollHeight, scrollDiff });
                    }, 50);
                }
            } else {
                console.log('🏁 No more messages to load');
                setHasMoreMessages(false);
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
            setError('Không thể tải thêm tin nhắn. Vui lòng thử lại.');
        } finally {
            setLoadingMore(false);
        }
    }, [selectedConversation, loadingMore, hasMoreMessages, skip, user.id]);

    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setShowMobileChat(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Setup scroll listener for infinite scroll
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        // Debug scroll capability
        console.log('📏 Container scroll info:', {
            scrollHeight: container.scrollHeight,
            clientHeight: container.clientHeight,
            scrollTop: container.scrollTop,
            canScroll: container.scrollHeight > container.clientHeight
        });

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;

            // Check if user is at bottom (within 50px threshold)
            const atBottom = scrollHeight - clientHeight - scrollTop <= 50;
            setIsAtBottom(atBottom);

            // Hide new message badge when user scrolls to bottom
            if (atBottom && showNewMessageBadge) {
                setShowNewMessageBadge(false);
                setNewMessagesCount(0);
            }

            console.log('📜 Scroll detected:', {
                scrollTop,
                scrollHeight,
                clientHeight,
                atBottom,
                hasMoreMessages,
                loadingMore,
                messagesLength: messages.length
            });

            // Load more when scrolled to top (within 50px)
            if (scrollTop <= 50 && hasMoreMessages && !loadingMore && messages.length > 0) {
                console.log('🔄 Triggering loadMoreMessages');
                loadMoreMessages();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [hasMoreMessages, loadingMore, messages.length, selectedConversation, loadMoreMessages]);

    const scrollToBottom = (forceDelay = false, immediate = false) => {
        console.log('📤 scrollToBottom called:', { forceDelay, immediate });

        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            const delay = immediate ? 0 : (forceDelay ? 200 : 100);
            console.log('📤 scrollToBottom delay:', delay);

            setTimeout(() => {
                if (messagesEndRef.current) {
                    let container = messagesEndRef.current.parentElement;

                    // Try multiple methods to find scrollable container
                    if (!container || container.scrollHeight === 0) {
                        console.log('📤 Trying alternative container methods...');
                        container = messagesContainerRef.current;
                    }

                    if (!container || container.scrollHeight === 0) {
                        console.log('📤 Trying querySelector method...');
                        container = document.querySelector('.messages-container');
                    }

                    if (container) {
                        try {
                            console.log('📤 Container found, scrolling:', {
                                scrollHeight: container.scrollHeight,
                                scrollTop: container.scrollTop,
                                clientHeight: container.clientHeight,
                                method: container === messagesContainerRef.current ? 'ref' :
                                    container === messagesEndRef.current.parentElement ? 'parent' : 'querySelector'
                            });

                            if (container.scrollHeight > container.clientHeight) {
                                // Use smooth scrolling for better UX
                                container.style.scrollBehavior = immediate ? 'auto' : 'smooth';
                                container.scrollTop = container.scrollHeight;

                                console.log('📤 Scroll executed, new scrollTop:', container.scrollTop);

                                // Reset scroll behavior after scrolling
                                if (!immediate) {
                                    setTimeout(() => {
                                        if (container) {
                                            container.style.scrollBehavior = 'auto';
                                        }
                                    }, 300);
                                }

                                // Reset notification states after scrolling
                                setIsAtBottom(true);
                                setShowNewMessageBadge(false);
                                setNewMessagesCount(0);
                            } else {
                                console.warn('📤 Container has no scrollable content');
                            }
                        } catch (error) {
                            console.warn('Error scrolling to bottom:', error);
                        }
                    } else {
                        console.warn('📤 No scrollable container found');
                    }
                } else {
                    console.warn('📤 messagesEndRef.current not found');
                }
            }, delay);
        });
    };

    const handleScrollToNewMessages = () => {
        scrollToBottom(false, false);
    };

    const loadInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadConversations(),
                loadUnassignedMessages()
            ]);
        } catch (error) {
            setError('Không thể tải dữ liệu chat');
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadConversations = async () => {
        try {
            const response = await chatSignalR.getUserConversations(user.id);
            setConversations(response || []);
        } catch (error) {
            console.error('Error loading conversations:', error);
            setConversations([]);
            setError('Không thể tải cuộc trò chuyện. Vui lòng thử lại.');
        }
    };

    const loadUnassignedMessages = async () => {
        try {
            const response = await chatSignalR.getUnassignedMessages();
            setUnassignedMessages(response || []);
        } catch (error) {
            console.error('Error loading unassigned messages:', error);
            setUnassignedMessages([]);
            setError('Không thể tải tin nhắn chờ. Vui lòng thử lại.');
        }
    };

    const checkUnreadMessages = async () => {
        try {
            const response = await chatSignalR.hasUnreadMessages(user.id);
            setHasUnread(response?.hasUnread || false);
        } catch (error) {
            console.error('Error checking unread messages:', error);
        }
    };

    const setupSignalRConnection = async () => {
        if (!user?.id) return;

        try {
            setConnectionStatus('Connecting');

            // Define event handlers that can be referenced for cleanup
            const reconnectingHandler = () => {
                setIsConnected(false);
                setConnectionStatus('Reconnecting');
            };

            const reconnectedHandler = () => {
                setIsConnected(true);
                setConnectionStatus('Connected');
            };

            const disconnectedHandler = () => {
                setIsConnected(false);
                setConnectionStatus('Disconnected');
            };

            // Setup event handlers before connecting
            chatSignalR.addEventListener('messageReceived', handleRealTimeMessage);
            chatSignalR.addEventListener('messageAssigned', handleMessageAssigned);
            chatSignalR.addEventListener('reconnecting', reconnectingHandler);
            chatSignalR.addEventListener('reconnected', reconnectedHandler);
            chatSignalR.addEventListener('disconnected', disconnectedHandler);

            const connected = await chatSignalR.startConnection(user.id);
            setIsConnected(connected);
            setConnectionStatus(connected ? 'Connected' : 'Failed');

            if (!connected) {
                console.warn('SignalR connection failed, will use REST API only');
            }

            // Return cleanup function
            return () => {
                chatSignalR.removeEventListener('messageReceived', handleRealTimeMessage);
                chatSignalR.removeEventListener('messageAssigned', handleMessageAssigned);
                chatSignalR.removeEventListener('reconnecting', reconnectingHandler);
                chatSignalR.removeEventListener('reconnected', reconnectedHandler);
                chatSignalR.removeEventListener('disconnected', disconnectedHandler);
            };
        } catch (error) {
            console.error('Error setting up SignalR:', error);
            setIsConnected(false);
            setConnectionStatus('Error');
            return null;
        }
    };

    const handleRealTimeMessage = (messageData) => {
        // Add real-time message to current conversation
        if (selectedConversation &&
            (messageData.fromUserId === selectedConversation.parentId ||
                messageData.fromUserId === selectedConversation.User)) {
            const newMessage = {
                id: messageData.id || Date.now(),
                message: messageData.message,
                fromUserId: messageData.fromUserId,
                toUserId: messageData.toUserId,
                timestamp: messageData.timestamp,
                isFromCurrentUser: messageData.fromUserId === user.id
            };

            setMessages(prev => {
                const updatedMessages = [...prev, newMessage];
                // Sort by timestamp to maintain order
                const sortedMessages = updatedMessages.sort((a, b) => {
                    const timeA = new Date(a.timestamp).getTime();
                    const timeB = new Date(b.timestamp).getTime();
                    return timeA - timeB;
                });

                return sortedMessages;
            });
        }

        // Refresh conversations and unassigned messages
        loadConversations();
        loadUnassignedMessages();
    };

    const handleMessageAssigned = (assignmentData) => {
        // Refresh conversations and unassigned messages when assignment happens
        loadConversations();
        loadUnassignedMessages();
    };

    const loadChatHistory = async (conversation) => {
        try {
            setSelectedConversation(conversation);

            // Show chat on mobile
            if (isMobile) {
                setShowMobileChat(true);
            }

            // Backend trả về 'User' field thay vì 'parentId'
            const parentId = conversation.parentId || conversation.User || conversation.user;

            if (!parentId) {
                setMessages([]);
                setSkip(0);
                setHasMoreMessages(true);
                return;
            }

            // Load first batch of messages (50 newest)
            const response = await chatSignalR.getChatHistory(user.id, parentId, 0, 50);
            console.log('📊 Initial chat history loaded:', {
                responseLength: response?.length,
                firstMessage: response?.[0],
                lastMessage: response?.[response?.length - 1]
            });

            // Backend returns messages ordered by timestamp DESC (newest first)
            // We need to reverse to get oldest first for UI
            const sortedMessages = [...(response || [])].reverse();
            console.log('📝 Messages after reverse:', {
                sortedLength: sortedMessages.length,
                firstMessage: sortedMessages[0],
                lastMessage: sortedMessages[sortedMessages.length - 1]
            });

            setMessages(sortedMessages);
            setSkip(response?.length || 0);
            setHasMoreMessages((response?.length || 0) === 50); // If we got 50, there might be more
            console.log('📊 Initial state set:', { skip: response?.length || 0, hasMoreMessages: (response?.length || 0) === 50 });

            // Reset scroll states for new conversation
            setIsAtBottom(true);
            setShowNewMessageBadge(false);
            setNewMessagesCount(0);

            // Always scroll to bottom for initial load
            if (sortedMessages.length > 0) {
                scrollToBottom(true);
            }

            // Mark as read
            await chatSignalR.markAsRead(user.id);
            setHasUnread(false);
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([]);
            setSkip(0);
            setHasMoreMessages(true);
            setError('Không thể tải lịch sử chat. Vui lòng thử lại.');
        }
    };

    const assignMessage = async (unassignedMessage) => {
        setAssigningId(unassignedMessage.id);

        try {
            const parentId = unassignedMessage.parentId || unassignedMessage.User || unassignedMessage.user;

            // Assign message via hybrid system (SignalR preferred, REST API fallback)
            await chatSignalR.assignMessage(parentId, user.id);

            // Refresh data
            await Promise.all([
                loadConversations(),
                loadUnassignedMessages()
            ]);

            // Auto-select the newly assigned conversation
            const newConversation = {
                id: `${user.id}-${parentId}`,
                parentId: parentId,
                parentName: unassignedMessage.parentName,
                lastMessage: unassignedMessage.message,
                lastMessageTime: unassignedMessage.timestamp
            };

            setActiveTab('conversations');
            await loadChatHistory(newConversation);

        } catch (error) {
            console.error('Error assigning message:', error);
            setError('Không thể nhận tin nhắn này. Vui lòng thử lại.');
        } finally {
            setAssigningId(null);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            const parentId = selectedConversation.parentId || selectedConversation.User || selectedConversation.user;
            const messageText = newMessage.trim();

            // Send message via hybrid system (SignalR preferred, REST API fallback)
            await chatSignalR.sendMessage(user.id, parentId, messageText);

            // Add message to local state for immediate UI update
            const newMsg = {
                id: Date.now(),
                message: messageText,
                fromUserId: user.id,
                toUserId: parentId,
                timestamp: new Date().toISOString(),
                isFromCurrentUser: true
            };

            setMessages(prev => {
                const updatedMessages = [...prev, newMsg];
                // Sort by timestamp to maintain order
                const sortedMessages = updatedMessages.sort((a, b) => {
                    const timeA = new Date(a.timestamp).getTime();
                    const timeB = new Date(b.timestamp).getTime();
                    return timeA - timeB;
                });

                return sortedMessages;
            });
            setNewMessage('');

            // Refresh conversations
            await loadConversations();

        } catch (error) {
            console.error('Error sending message:', error);
            setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const handleBackToList = () => {
        setShowMobileChat(false);
        setSelectedConversation(null);
        setMessages([]);
        setSkip(0);
        setHasMoreMessages(true);
        // Reset scroll states
        setIsAtBottom(true);
        setShowNewMessageBadge(false);
        setNewMessagesCount(0);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Hôm qua';
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderConversationsList = () => (
        <>
            <div className="sidebar-header sidebar-header-conversations">
                <FaStethoscope className="sidebar-header-icon" />
                <div className="sidebar-header-title">Cuộc trò chuyện đang tư vấn</div>
                <div className="sidebar-header-subtitle">
                    {conversations.length} phụ huynh
                </div>
            </div>

            {conversations.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FaUsers />
                    </div>
                    <h4 className="empty-state-title">Chưa có cuộc trò chuyện</h4>
                    <p className="empty-state-subtitle">
                        Nhận tin nhắn chờ từ phụ huynh để bắt đầu tư vấn
                    </p>
                </div>
            ) : (
                conversations.map((conversation, index) => (
                    <div
                        key={conversation.id || `conversation-${index}`}
                        className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                        onClick={() => loadChatHistory(conversation)}
                    >
                        <div className="conversation-avatar">
                            <FaUserGraduate />
                        </div>
                        <div className="conversation-info">
                            <h6 className="conversation-name">
                                {conversation.parentName || 'Phụ huynh'}
                            </h6>
                            <p className="conversation-preview">
                                {conversation.lastMessage || 'Chưa có tin nhắn'}
                            </p>
                        </div>
                        <div className="conversation-meta">
                            <span className="conversation-time">
                                {formatTime(conversation.lastMessageTime)}
                            </span>
                            {conversation.unreadCount > 0 && (
                                <div className="unread-badge">
                                    {conversation.unreadCount}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </>
    );

    const renderUnassignedMessages = () => (
        <>
            <div className="sidebar-header sidebar-header-unassigned">
                <FaInbox className="sidebar-header-icon" />
                <div className="sidebar-header-title">Tin nhắn chờ tiếp nhận</div>
                <div className="sidebar-header-subtitle">
                    {unassignedMessages.length} tin nhắn mới
                </div>
            </div>

            {unassignedMessages.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FaCheckCircle />
                    </div>
                    <h4 className="empty-state-title">Không có tin nhắn chờ</h4>
                    <p className="empty-state-subtitle">
                        Tất cả tin nhắn đã được các y tá tiếp nhận
                    </p>
                </div>
            ) : (
                unassignedMessages.map((message, index) => (
                    <div key={message.id || `unassigned-${index}`} className="pending-request-item">
                        <div className="pending-header">
                            <div className="pending-badges">
                                <div className="pending-badge">
                                    <FaClock className="me-1" />
                                    Tin nhắn mới
                                </div>
                                <Badge bg="info" className="priority-badge">
                                    {message.priority || 'Thường'}
                                </Badge>
                            </div>
                            <span className="pending-time">
                                {formatTime(message.timestamp)}
                            </span>
                        </div>

                        <div className="pending-parent-section">
                            <div className="pending-parent-info">
                                <FaUserGraduate />
                                <strong className="pending-parent-name">
                                    {message.parentName || 'Phụ huynh'}
                                </strong>
                            </div>
                            {message.studentName && (
                                <div className="pending-student-name">
                                    Con: {message.studentName}
                                </div>
                            )}
                        </div>

                        <div className="pending-message-content">
                            <p>
                                {message.message}
                            </p>
                        </div>

                        <div className="pending-footer">
                            <div className="pending-label">
                                <FaExclamationTriangle />
                                Yêu cầu tư vấn từ phụ huynh
                            </div>

                            <Button
                                className="accept-button"
                                onClick={() => assignMessage(message)}
                                disabled={assigningId === message.id}
                            >
                                {assigningId === message.id ? (
                                    <>
                                        <Spinner size="sm" className="me-2" />
                                        Đang nhận...
                                    </>
                                ) : (
                                    <>
                                        <FaHandHoldingMedical className="me-2" />
                                        Nhận tư vấn
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ))
            )}
        </>
    );

    const renderChatArea = () => {
        if (!selectedConversation) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FaStethoscope />
                    </div>
                    <h4 className="empty-state-title">
                        {activeTab === 'conversations' ? 'Chọn cuộc trò chuyện' : 'Nhận tin nhắn để tư vấn'}
                    </h4>
                    <p className="empty-state-subtitle">
                        {activeTab === 'conversations'
                            ? 'Chọn một cuộc trò chuyện để tiếp tục tư vấn cho phụ huynh'
                            : 'Nhận tin nhắn chờ từ phụ huynh để bắt đầu quá trình tư vấn sức khỏe'
                        }
                    </p>
                </div>
            );
        }

        return (
            <div className={`chat-area ${isMobile && showMobileChat ? 'show' : ''}`}>
                <div className="chat-area-header">
                    {isMobile && (
                        <button className="back-button" onClick={handleBackToList}>
                            <FaArrowLeft />
                        </button>
                    )}
                    <div className="chat-area-title">
                        <div className="chat-area-avatar">
                            <FaUserGraduate />
                        </div>
                        <div>
                            <h5>
                                {selectedConversation.parentName || 'Phụ huynh'}
                            </h5>
                            <div className="chat-status">
                                Đang tư vấn sức khỏe
                            </div>
                            <div className="online-status"></div>
                        </div>
                    </div>
                </div>

                <div className="messages-container" ref={messagesContainerRef}>
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <FaComments />
                            </div>
                            <h4 className="empty-state-title">Bắt đầu tư vấn</h4>
                            <p className="empty-state-subtitle">
                                Gửi tin nhắn đầu tiên để bắt đầu tư vấn sức khỏe cho phụ huynh
                            </p>
                        </div>
                    ) : (
                        <>
                            {loadingMore && (
                                <div className="loading-more-indicator">
                                    <Spinner size="sm" className="me-2" />
                                    <span>Đang tải thêm tin nhắn...</span>
                                </div>
                            )}
                            {!hasMoreMessages && messages.length > 0 && (
                                <div className="no-more-messages">
                                    🏁 Đã tải hết tin nhắn
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div
                                    key={message.id || index}
                                    className={`message ${message.fromUserId === user.id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-bubble">
                                        <div>{message.message}</div>
                                        <div className="message-time">
                                            {formatMessageTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    <div ref={messagesEndRef} />

                    {/* DEBUG: Manual scroll button */}
                    <div
                        onClick={() => {
                            console.log('🔧 Manual scroll test clicked');
                            scrollToBottom(false, true);
                        }}
                        className="debug-scroll-button"
                    >
                        🔧 Manual Scroll Test
                    </div>

                    {/* New Message Notification Badge */}
                    {showNewMessageBadge && (
                        <div
                            onClick={handleScrollToNewMessages}
                            className="new-message-notification"
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            <span>📩</span>
                            <span>{newMessagesCount} tin mới</span>
                            <span className="notification-arrow">↓</span>
                        </div>
                    )}
                </div>

                <div className="message-input-container">
                    <Form onSubmit={sendMessage}>
                        <div className="message-input-wrapper">
                            <Form.Control
                                as="textarea"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Nhập lời tư vấn cho phụ huynh..."
                                className="message-input"
                                disabled={sending}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(e);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                className="send-button"
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

    if (loading) {
        return (
            <div className="chat-container">
                <div className="loading-container">
                    <div className="loading-spinner">
                        <FaStethoscope />
                    </div>
                    <h4>Đang tải tin nhắn tư vấn...</h4>
                    <p>Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-title">
                    <div className="chat-title-icon">
                        <FaStethoscope />
                    </div>
                    <div>
                        <h1>Tư vấn sức khỏe</h1>
                        <p className="chat-subtitle">
                            Hỗ trợ và tư vấn sức khỏe cho phụ huynh học sinh
                        </p>
                        <div className="connection-status">
                            <div className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
                            <span className={`connection-text ${isConnected ? 'connected' : 'disconnected'}`}>
                                {connectionStatus === 'Connected' ? 'Tư vấn thời gian thực' :
                                    connectionStatus === 'Connecting' ? 'Đang kết nối...' :
                                        connectionStatus === 'Reconnecting' ? 'Đang kết nối lại...' :
                                            connectionStatus === 'Failed' ? 'Dùng REST API' :
                                                'Ngoại tuyến'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={(key) => setActiveTab(key)}
                className="chat-tabs"
            >
                <Tab
                    eventKey="conversations"
                    title={
                        <div className="tab-title-wrapper">
                            <FaComments className="tab-icon" />
                            <span>Cuộc trò chuyện</span>
                            {hasUnread && (
                                <div className="unread-indicator" />
                            )}
                            {conversations.length > 0 && (
                                <Badge bg="primary" className="tab-badge primary">
                                    {conversations.length}
                                </Badge>
                            )}
                        </div>
                    }
                >
                    <div className="tab-content-wrapper">
                        <div className="conversations-container">
                            <div className={`conversations-list ${isMobile && !showMobileChat ? 'show' : ''}`}>
                                {renderConversationsList()}
                            </div>
                            {renderChatArea()}
                        </div>
                    </div>
                </Tab>

                <Tab
                    eventKey="unassigned"
                    title={
                        <div className="tab-title-wrapper">
                            <FaInbox className="tab-icon" />
                            <span>Tin nhắn chờ</span>
                            {unassignedMessages.length > 0 && (
                                <Badge bg="warning" className="tab-badge warning">
                                    {unassignedMessages.length}
                                </Badge>
                            )}
                        </div>
                    }
                >
                    <div className="tab-content-wrapper">
                        <div className="conversations-container">
                            <div className={`conversations-list ${isMobile && !showMobileChat ? 'show' : ''}`}>
                                {renderUnassignedMessages()}
                            </div>
                            {renderChatArea()}
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default NurseChat; 