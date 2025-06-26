import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, Tab, Form, Button, Spinner, Alert } from 'react-bootstrap';
import {
    FaComments,
    FaClock,
    FaPaperPlane,
    FaUser,
    FaUserNurse,
    FaSearch,
    FaEnvelope,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRobot,
    FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import chatSignalR from '../../services/chatSignalR';


const ParentChat = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('conversations');
    const [conversations, setConversations] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [error, setError] = useState('');
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

        const nurseId = selectedConversation.nurseId || selectedConversation.User || selectedConversation.user;
        if (!nurseId) {
            console.log('❌ No nurseId found');
            return;
        }

        console.log('🔄 Loading more messages...', { skip, nurseId });
        setLoadingMore(true);

        try {
            // Get current scroll height to maintain position
            const container = messagesContainerRef.current;
            const prevScrollHeight = container?.scrollHeight || 0;

            // Load next batch of older messages
            const response = await chatSignalR.getChatHistory(user.id, nurseId, skip, 50);
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
        console.log('📤 [PARENT] scrollToBottom called:', { forceDelay, immediate });

        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            const delay = immediate ? 0 : (forceDelay ? 200 : 100);
            console.log('📤 [PARENT] scrollToBottom delay:', delay);

            setTimeout(() => {
                if (messagesEndRef.current) {
                    let container = messagesEndRef.current.parentElement;

                    // Try multiple methods to find scrollable container
                    if (!container || container.scrollHeight === 0) {
                        console.log('📤 [PARENT] Trying alternative container methods...');
                        container = messagesContainerRef.current;
                    }

                    if (!container || container.scrollHeight === 0) {
                        console.log('📤 [PARENT] Trying querySelector method...');
                        container = document.querySelector('.messages-container');
                    }

                    if (container) {
                        try {
                            console.log('📤 [PARENT] Container found, scrolling:', {
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

                                console.log('📤 [PARENT] Scroll executed, new scrollTop:', container.scrollTop);

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
                                console.warn('📤 [PARENT] Container has no scrollable content');
                            }
                        } catch (error) {
                            console.warn('[PARENT] Error scrolling to bottom:', error);
                        }
                    } else {
                        console.warn('📤 [PARENT] No scrollable container found');
                    }
                } else {
                    console.warn('📤 [PARENT] messagesEndRef.current not found');
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
                loadPendingRequests()
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

    const loadPendingRequests = async () => {
        try {
            const response = await chatSignalR.getPendingRequests(user.id);
            setPendingRequests(response || []);
        } catch (error) {
            console.error('Error loading pending requests:', error);
            setPendingRequests([]);
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
        console.log('🔔 Parent received real-time message:', messageData);
        console.log('📝 Current selectedConversation:', selectedConversation);
        console.log('👤 Current user ID:', user.id);

        // Add real-time message to current conversation
        if (selectedConversation &&
            (messageData.fromUserId === selectedConversation.nurseId ||
                messageData.fromUserId === selectedConversation.User ||
                messageData.toUserId === user.id)) {

            console.log('✅ Message matches current conversation, adding to chat');

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
        } else {
            console.log('❌ Message does not match current conversation');
        }

        // Refresh conversations to update last message
        loadConversations();
    };

    const handleMessageAssigned = (assignmentData) => {
        // Refresh conversations and pending requests when assignment happens
        loadConversations();
        loadPendingRequests();
    };

    const loadChatHistory = async (conversation) => {
        try {
            setSelectedConversation(conversation);

            // Show chat on mobile
            if (isMobile) {
                setShowMobileChat(true);
            }

            // Backend trả về 'User' field thay vì 'nurseId'
            const nurseId = conversation.nurseId || conversation.User || conversation.user;

            if (!nurseId) {
                setMessages([]);
                setSkip(0);
                setHasMoreMessages(true);
                return;
            }

            // Load first batch of messages (50 newest)
            const response = await chatSignalR.getChatHistory(user.id, nurseId, 0, 50);
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

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const messageText = newMessage.trim();
            let nurseId = null;

            // LOGIC THEO FLOW YÊU CẦU:
            // - Tab "conversations" + có selectedConversation → gửi tin nhắn bình thường với nurseId
            // - Tab "pending" hoặc không có selectedConversation → gửi tin nhắn chờ với nurseId = null
            if (activeTab === 'conversations' && selectedConversation) {
                // Tin nhắn bình thường với y tá
                nurseId = selectedConversation.nurseId || selectedConversation.User || selectedConversation.user;
                console.log('📤 [PARENT] Sending normal message to nurse:', nurseId);
            } else {
                // Tin nhắn chờ mới (gửi cho hệ thống, chờ nurse nhận)
                nurseId = null;
                console.log('📤 [PARENT] Sending pending message (waiting for nurse assignment)');
            }

            // Send message via hybrid system (SignalR preferred, REST API fallback)
            await chatSignalR.sendMessage(user.id, nurseId, messageText);

            // Add message to local state for immediate UI update
            const newMsg = {
                id: Date.now(),
                message: messageText,
                fromUserId: user.id,
                toUserId: nurseId,
                timestamp: new Date().toISOString(),
                isFromCurrentUser: true,
                isPending: nurseId === null // Mark pending messages
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

            // Refresh data theo tab hiện tại
            if (activeTab === 'conversations') {
                await loadConversations();
            } else {
                await loadPendingRequests();
            }

            // Auto scroll to bottom
            setTimeout(() => scrollToBottom(false, false), 100);

        } catch (error) {
            console.error('Error sending message:', error);
            setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
        } finally {
            setSending(false);
        }
    };

    const startNewChat = () => {
        setSelectedConversation(null);
        setMessages([]);
        setSkip(0);
        setHasMoreMessages(true);
        // Reset scroll states
        setIsAtBottom(true);
        setShowNewMessageBadge(false);
        setNewMessagesCount(0);
        // Show chat on mobile for new message
        if (isMobile) {
            setShowMobileChat(true);
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
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={startNewChat}
                    style={{
                        borderRadius: '12px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                >
                    <FaEnvelope className="me-2" />
                    Tin nhắn mới
                </Button>
            </div>

            {conversations.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FaComments />
                    </div>
                    <h4 className="empty-state-title">Chưa có cuộc trò chuyện</h4>
                    <p className="empty-state-subtitle">
                        Bắt đầu cuộc trò chuyện đầu tiên với y tá để được tư vấn sức khỏe
                    </p>
                </div>
            ) : (
                conversations.map((conversation, index) => (
                    <div
                        key={conversation.id || `conversation-${index}`}
                        className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                        onClick={() => loadChatHistory(conversation)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="conversation-avatar">
                                <FaUserNurse />
                            </div>
                            <div className="conversation-info">
                                <h6 className="conversation-name">
                                    Y tá {conversation.nurseName || 'Hệ thống'}
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
                    </div>
                ))
            )}
        </>
    );

    const renderPendingRequests = () => (
        <>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <Button
                    variant="outline-warning"
                    className="w-100"
                    onClick={startNewChat}
                    style={{
                        borderRadius: '12px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #ffc107, #ff8f00)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)'
                    }}
                >
                    <FaClock className="me-2" />
                    Gửi yêu cầu mới
                </Button>
            </div>

            {pendingRequests.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FaClock />
                    </div>
                    <h4 className="empty-state-title">Không có tin nhắn chờ</h4>
                    <p className="empty-state-subtitle">
                        Tất cả tin nhắn của bạn đã được y tá tiếp nhận
                    </p>
                </div>
            ) : (
                pendingRequests.map((request, index) => (
                    <div key={request.id || `request-${index}`} className="pending-request-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div className="pending-badge">
                                <FaClock className="me-1" />
                                Chờ tiếp nhận
                            </div>
                            <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                                {formatTime(request.timestamp)}
                            </span>
                        </div>
                        <div style={{ background: 'rgba(247, 250, 252, 0.6)', padding: '1rem', borderRadius: '12px' }}>
                            <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.5' }}>
                                {request.message}
                            </p>
                        </div>
                        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#718096' }}>
                            <FaExclamationTriangle className="me-1" />
                            Tin nhắn này đang chờ y tá tiếp nhận
                        </div>
                    </div>
                ))
            )}
        </>
    );

    const renderChatArea = () => {
        if (!selectedConversation && activeTab === 'conversations') {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FaComments />
                    </div>
                    <h4 className="empty-state-title">Chọn cuộc trò chuyện</h4>
                    <p className="empty-state-subtitle">
                        Chọn một cuộc trò chuyện để bắt đầu nhắn tin với y tá
                    </p>
                </div>
            );
        }

        return (
            <div className={`chat-area ${isMobile && showMobileChat ? 'show' : ''}`}>
                {selectedConversation && (
                    <div className="chat-area-header">
                        {isMobile && (
                            <button className="back-button" onClick={handleBackToList}>
                                <FaArrowLeft />
                            </button>
                        )}
                        <div className="chat-area-title">
                            <div className="chat-area-avatar">
                                <FaUserNurse />
                            </div>
                            <div>
                                <h5 style={{ margin: 0 }}>
                                    Y tá {selectedConversation.nurseName || selectedConversation.name || 'Hệ thống'}
                                </h5>
                                <div className="online-status"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="messages-container" ref={messagesContainerRef}>
                    {messages.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                {selectedConversation ? <FaComments /> : <FaRobot />}
                            </div>
                            <h4 className="empty-state-title">
                                {selectedConversation ? 'Bắt đầu cuộc trò chuyện' : 'Tin nhắn mới'}
                            </h4>
                            <p className="empty-state-subtitle">
                                {selectedConversation
                                    ? 'Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện với y tá'
                                    : 'Tin nhắn của bạn sẽ được gửi đến hệ thống và y tá sẽ sớm phản hồi'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {loadingMore && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    padding: '1rem',
                                    color: '#667eea'
                                }}>
                                    <Spinner size="sm" className="me-2" />
                                    <span>Đang tải thêm tin nhắn...</span>
                                </div>
                            )}
                            {!hasMoreMessages && messages.length > 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '1rem',
                                    color: '#718096',
                                    fontSize: '0.875rem'
                                }}>
                                    🏁 Đã tải hết tin nhắn
                                </div>
                            )}
                            {hasMoreMessages && messages.length > 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '1rem'
                                }}>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={loadMoreMessages}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? 'Đang tải...' : '🔄 Load More (Debug)'}
                                    </Button>
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
                            console.log('🔧 [PARENT] Manual scroll test clicked');
                            scrollToBottom(false, true);
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: '20px',
                            background: 'red',
                            color: 'white',
                            borderRadius: '25px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            zIndex: 100,
                            border: 'none'
                        }}
                    >
                        🔧 Manual Scroll Test
                    </div>

                    {/* New Message Notification Badge */}
                    {showNewMessageBadge && (
                        <div
                            onClick={handleScrollToNewMessages}
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                color: 'white',
                                borderRadius: '25px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                zIndex: 100,
                                animation: 'bounce-in 0.3s ease',
                                transition: 'all 0.3s ease',
                                border: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            <span>📩</span>
                            <span>{newMessagesCount} tin mới</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>↓</span>
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
                                placeholder={
                                    selectedConversation
                                        ? "Nhập tin nhắn của bạn..."
                                        : "Nhập câu hỏi hoặc yêu cầu tư vấn..."
                                }
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
                        <FaComments />
                    </div>
                    <h4>Đang tải tin nhắn...</h4>
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
                        <FaComments />
                    </div>
                    <div>
                        <h1>Tin nhắn tư vấn</h1>
                        <p className="chat-subtitle">
                            Liên hệ với y tá để được tư vấn về sức khỏe con em
                        </p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            marginTop: '0.5rem'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: isConnected ? '#28a745' : '#dc3545'
                            }} />
                            <span style={{ color: isConnected ? '#28a745' : '#dc3545' }}>
                                {connectionStatus === 'Connected' ? 'Chat thời gian thực' :
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaComments />
                            <span>Cuộc trò chuyện</span>
                            {hasUnread && (
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    background: '#dc3545',
                                    borderRadius: '50%'
                                }} />
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
                    eventKey="pending"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaClock />
                            <span>Tin nhắn chờ</span>
                            {pendingRequests.length > 0 && (
                                <span style={{
                                    background: '#ffc107',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '0.125rem 0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}>
                                    {pendingRequests.length}
                                </span>
                            )}
                        </div>
                    }
                >
                    <div className="tab-content-wrapper">
                        <div className="conversations-container">
                            <div className={`conversations-list ${isMobile && !showMobileChat ? 'show' : ''}`}>
                                {renderPendingRequests()}
                            </div>
                            {renderChatArea()}
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default ParentChat; 