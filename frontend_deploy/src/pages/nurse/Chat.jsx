import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, Tab, Form, Button, Spinner, Alert } from "react-bootstrap";
import {
  FaComments,
  FaPaperPlane,
  FaArrowLeft,
  FaClock,
  FaUserCheck,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import simpleChatAPI from "../../api/simpleChatApi";
import simpleSignalR from "../../services/simpleSignalR";
import styles from "./Chat.module.css";

const NurseChat = () => {
  const { user, clearUnreadMessages } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState("conversations");
  const [conversations, setConversations] = useState([]);
  const [unassignedMessages, setUnassignedMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const [skip, setSkip] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const messagesContainerRef = useRef(null);
  const loadConversationsTimeoutRef = useRef(null);
  const loadUnassignedTimeoutRef = useRef(null);
  const handlersRef = useRef({});
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  //ẩn scroll cho trang chat
  useEffect(() => {
    window.scrollTo(0, 0); // Tự động cuộn lên đầu trang
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto"; // reset khi rời trang
    };
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const data = await simpleChatAPI.getConversations(userId);
      setConversations(data);
    } catch (error) {
      if (activeTab === "conversations") {
        setError("Không thể tải danh sách cuộc trò chuyện");
      }
    }
  }, [userId, activeTab]);

  const loadUnassignedMessages = useCallback(async () => {
    if (loadUnassignedTimeoutRef.current) {
      clearTimeout(loadUnassignedTimeoutRef.current);
    }

    loadUnassignedTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await simpleChatAPI.getUnassignedMessages();
        setUnassignedMessages(data);
      } catch (error) {
        if (activeTab === "unassigned") {
          setError("Không thể tải tin nhắn chưa được xử lý");
        }
      }
    }, 300);
  }, [activeTab]);

  const loadChatHistory = useCallback(
    async (conversation) => {
      try {
        const partnerId =
          conversation.user ||
          conversation.User ||
          conversation.parentId ||
          conversation.otherUserId ||
          conversation.userId ||
          conversation.ParentId ||
          conversation.UserId;

        if (!partnerId) {
          setError("Không thể xác định người nhận. Vui lòng thử lại.");
          return;
        }

        const history = await simpleChatAPI.getChatHistory(
          userId,
          partnerId,
          0,
          50
        );

        setMessages(history.reverse());
        setSelectedConversation(conversation);

        setSkip(history.length);
        setHasMoreMessages(history.length === 50);

        if (isMobile) {
          setShowMobileChat(true);
        }

        scrollToBottom();

        setTimeout(async () => {
          await loadConversations();
        }, 500);
      } catch (error) {
        setError("Không thể tải lịch sử chat");
      }
    },
    [userId, loadConversations]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversation || loadingMore || !hasMoreMessages) return;

    try {
      setLoadingMore(true);

      const partnerId =
        selectedConversation.user ||
        selectedConversation.User ||
        selectedConversation.parentId ||
        selectedConversation.otherUserId ||
        selectedConversation.userId ||
        selectedConversation.ParentId ||
        selectedConversation.UserId;

      const olderMessages = await simpleChatAPI.getChatHistory(
        userId,
        partnerId,
        skip,
        50
      );

      if (olderMessages.length > 0) {
        setMessages((prevMessages) => [
          ...olderMessages.reverse(),
          ...prevMessages,
        ]);

        setSkip((prevSkip) => prevSkip + olderMessages.length);
        setHasMoreMessages(olderMessages.length === 50);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      setError("Không thể tải thêm tin nhắn");
    } finally {
      setLoadingMore(false);
    }
  }, [
    selectedConversation,
    loadingMore,
    hasMoreMessages,
    skip,
    userId,
    messages.length,
  ]);

  useEffect(() => {
    if (!userId) return;

    const init = async () => {
      clearUnreadMessages();

      await Promise.all([loadConversations(), loadUnassignedMessages()]);

      setLoading(false);
    };

    init();

    return () => {
      if (loadConversationsTimeoutRef.current) {
        clearTimeout(loadConversationsTimeoutRef.current);
      }
      if (loadUnassignedTimeoutRef.current) {
        clearTimeout(loadUnassignedTimeoutRef.current);
      }
    };
  }, [userId, clearUnreadMessages, loadConversations, loadUnassignedMessages]);

  useEffect(() => {
    if (!userId) return;

    const handleMessageReceived = async (messageData) => {
      const { fromUserId, toUserId } = messageData;
      const currentUserId = parseInt(userId);

      if (selectedConversation) {
        const partnerId =
          selectedConversation.user ||
          selectedConversation.User ||
          selectedConversation.parentId ||
          selectedConversation.otherUserId ||
          selectedConversation.userId ||
          selectedConversation.ParentId ||
          selectedConversation.UserId;

        const isCurrentConversation =
          (fromUserId === partnerId && toUserId === currentUserId) ||
          (fromUserId === currentUserId && toUserId === partnerId);

        if (isCurrentConversation) {
          setTimeout(async () => {
            await loadChatHistory(selectedConversation);
          }, 500);
        }
      }

      setTimeout(async () => {
        await Promise.all([loadConversations(), loadUnassignedMessages()]);
      }, 1000);
    };

    const handleNewUnassignedMessage = async (messageData) => {
      setTimeout(async () => {
        await loadUnassignedMessages();
      }, 500);
    };

    simpleSignalR.addEventListener("messageReceived", handleMessageReceived);
    simpleSignalR.addEventListener(
      "newUnassignedMessage",
      handleNewUnassignedMessage
    );

    handlersRef.current.messageReceived = handleMessageReceived;
    handlersRef.current.newUnassignedMessage = handleNewUnassignedMessage;

    return () => {
      if (handlersRef.current.messageReceived) {
        simpleSignalR.removeEventListener(
          "messageReceived",
          handlersRef.current.messageReceived
        );
        delete handlersRef.current.messageReceived;
      }
      if (handlersRef.current.newUnassignedMessage) {
        simpleSignalR.removeEventListener(
          "newUnassignedMessage",
          handlersRef.current.newUnassignedMessage
        );
        delete handlersRef.current.newUnassignedMessage;
      }
    };
  }, [
    userId,
    selectedConversation,
    loadChatHistory,
    loadConversations,
    loadUnassignedMessages,
  ]);

  const assignMessage = async (parentId) => {
    try {
      if (!parentId) {
        setError("Không thể xác định ID phụ huynh");
        return;
      }

      if (!userId) {
        setError("Không thể xác định ID y tá");
        return;
      }

      setAssigning(true);
      setError("");

      await simpleChatAPI.assignMessage(parentId, userId);

      setActiveTab("conversations");

      setTimeout(async () => {
        try {
          await loadConversations();
          const assignedConversation = conversations.find((conv) => {
            const convPartnerId =
              conv.user ||
              conv.User ||
              conv.userId ||
              conv.UserId ||
              conv.parentId ||
              conv.otherUserId;
            return String(convPartnerId) === String(parentId);
          });

          if (assignedConversation) {
            await loadChatHistory(assignedConversation);
          }
        } catch (error) {}
      }, 1000);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Không tìm thấy tin nhắn này");
      } else if (error.response?.status === 400) {
        setError("Dữ liệu không hợp lệ");
      } else if (error.response?.status === 500) {
        setError("Lỗi máy chủ, vui lòng thử lại");
      } else {
        setError("Không thể tiếp nhận tin nhắn. Vui lòng thử lại");
      }
    } finally {
      setAssigning(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedConversation) return;

    try {
      setSending(true);
      setError("");

      const partnerId =
        selectedConversation.userId ||
        selectedConversation.UserId ||
        selectedConversation.user ||
        selectedConversation.User ||
        selectedConversation.parentId ||
        selectedConversation.otherUserId ||
        selectedConversation.ParentId;

      if (!partnerId) {
        throw new Error(
          "Không xác định được người nhận. Cấu trúc dữ liệu không đúng."
        );
      }

      await simpleChatAPI.sendMessage(userId, partnerId, newMessage);

      setNewMessage("");

      await loadChatHistory(selectedConversation);
    } catch (error) {
      setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
    setMessages([]);

    setSkip(0);
    setHasMoreMessages(false);
    setLoadingMore(false);
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (activeTab === "unassigned") {
      const interval = setInterval(() => {
        loadUnassignedMessages();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [activeTab, loadUnassignedMessages]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [selectedConversation, messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderConversationItem = (conversation, index) => {
    const hasUnread =
      conversation.hasUnread ||
      conversation.HasUnread ||
      conversation.unreadCount > 0;

    const getPartnerId = (conv) => {
      return (
        conv?.userId ||
        conv?.UserId ||
        conv?.user ||
        conv?.User ||
        conv?.parentId ||
        conv?.otherUserId ||
        conv?.ParentId
      );
    };

    const isActive =
      selectedConversation &&
      getPartnerId(selectedConversation) === getPartnerId(conversation);

    return (
      <div key={index} onClick={() => loadChatHistory(conversation)}>
        <div>
          <div>
            {conversation.userName ||
              conversation.UserName ||
              conversation.parentName ||
              conversation.ParentName ||
              `Phụ huynh #${
                conversation.userId ||
                conversation.UserId ||
                conversation.user ||
                conversation.User ||
                conversation.parentId ||
                "Unknown"
              }`}
          </div>
          <div>
            {conversation.timestamp ||
            conversation.Timestamp ||
            conversation.lastMessageTime
              ? formatTime(
                  conversation.timestamp ||
                    conversation.Timestamp ||
                    conversation.lastMessageTime
                )
              : ""}
          </div>
        </div>
        <div>
          {conversation.lastMessage ||
            conversation.LastMessage ||
            "Chưa có tin nhắn"}
        </div>
        {hasUnread && <div></div>}
      </div>
    );
  };

  const renderUnassignedItem = (unassigned, index) => {
    const parentId =
      unassigned.userId ||
      unassigned.UserId ||
      unassigned.user ||
      unassigned.User ||
      unassigned.parentId ||
      unassigned.ParentId ||
      unassigned.fromUserId ||
      unassigned.FromUserId;
    const messageText =
      unassigned.lastMessage ||
      unassigned.LastMessage ||
      unassigned.message ||
      unassigned.Message;
    const timestamp = unassigned.timestamp || unassigned.Timestamp;

    return (
      <div key={index}>
        <div>
          <div>
            {unassigned.userName ||
              unassigned.UserName ||
              unassigned.parentName ||
              unassigned.ParentName ||
              `Phụ huynh #${parentId || "Unknown"}`}
          </div>
          <div>{timestamp ? formatTime(timestamp) : ""}</div>
        </div>

        <div>{messageText || "Tin nhắn mới"}</div>

        <div>
          <Button
            size="sm"
            onClick={() => {
              if (!parentId) {
                setError("Không thể xác định ID phụ huynh");
                return;
              }

              const timeoutId = setTimeout(() => {
                setAssigning(false);
              }, 30000);

              assignMessage(parentId).finally(() => {
                clearTimeout(timeoutId);
              });
            }}
            disabled={assigning || !parentId}
            title={
              !parentId
                ? "Không thể xác định ID phụ huynh"
                : assigning
                ? "Đang xử lý..."
                : "Tiếp nhận tin nhắn này"
            }
          >
            {assigning ? (
              <>
                <Spinner size="sm" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FaUserCheck />
                Tiếp nhận
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderConversationsList = () => (
    <div>
      {loading ? (
        <div>
          <Spinner animation="border" size="sm" />
          <div>Đang tải...</div>
        </div>
      ) : conversations.length === 0 ? (
        <div>
          <FaComments />
          <div>Chưa có cuộc trò chuyện nào</div>
        </div>
      ) : (
        conversations.map(renderConversationItem)
      )}
    </div>
  );

  const renderUnassignedList = () => (
    <div>
      {loading ? (
        <div>
          <Spinner animation="border" size="sm" />
          <div>Đang tải...</div>
        </div>
      ) : unassignedMessages.length === 0 ? (
        <div>
          <FaClock />
          <div>Không có tin nhắn chờ xử lý</div>
        </div>
      ) : (
        unassignedMessages.map(renderUnassignedItem)
      )}
    </div>
  );

  const renderChatBubbles = () => (
    <div className={styles.chatMessages} ref={chatMessagesRef}>
      {messages.map((msg, idx) => {
        const isMine = String(msg.fromUserId || msg.from) === String(userId);
        return (
          <div
            key={idx}
            className={isMine ? styles.chatBubbleMine : styles.chatBubbleOther}
          >
            <div className={styles.chatBubbleText}>
              {msg.message || msg.content}
            </div>
            <div className={styles.chatBubbleTime}>
              {formatTime(msg.timestamp)}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );

  if (loading) {
    return (
      <div>
        <Spinner animation="border" />
        <div>Đang tải tin nhắn...</div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      <div className={styles.chatMain}>
        <div className={styles.chatSidebar}>
          <div className={styles.chatTabs}>
            <button
              className={
                styles.chatTab +
                (activeTab === "conversations" ? " " + styles.active : "")
              }
              onClick={() => setActiveTab("conversations")}
            >
              <FaComments />
              Trò chuyện
              <span className={styles.chatTabBadge}>
                {conversations?.length}
              </span>
            </button>
            <button
              className={
                styles.chatTab +
                (activeTab === "unassigned" ? " " + styles.active : "")
              }
              onClick={() => setActiveTab("unassigned")}
            >
              <FaClock />
              Chờ xử lý
              <span className={styles.chatTabBadge}>
                {unassignedMessages?.length}
              </span>
            </button>
          </div>
          <div className={styles.chatList}>
            {activeTab === "conversations"
              ? conversations.map((conv, idx) => {
                  const isActive =
                    selectedConversation &&
                    ((conv.userId &&
                      selectedConversation.userId &&
                      conv.userId === selectedConversation.userId) ||
                      (conv.parentId &&
                        selectedConversation.parentId &&
                        conv.parentId === selectedConversation.parentId));
                  return (
                    <div
                      key={idx}
                      className={
                        styles.chatListItem +
                        (isActive ? " " + styles.active : "")
                      }
                      onClick={() => loadChatHistory(conv)}
                    >
                      <div className={styles.chatListItemTitle}>
                        {conv.userName ||
                          conv.parentName ||
                          `Phụ huynh ${conv.userId || conv.parentId}`}
                        <span className={styles.chatListItemTime}>
                          {conv.timestamp ? formatTime(conv.timestamp) : ""}
                        </span>
                      </div>
                      <div className={styles.chatListItemMsg}>
                        {conv.lastMessage || "Chưa có tin nhắn"}
                      </div>
                    </div>
                  );
                })
              : unassignedMessages.map((msg, idx) => {
                  const parentId =
                    msg.userId ||
                    msg.UserId ||
                    msg.user ||
                    msg.User ||
                    msg.parentId ||
                    msg.ParentId ||
                    msg.fromUserId ||
                    msg.FromUserId;
                  return (
                    <div key={idx} className={styles.chatListItem}>
                      <div className={styles.chatListItemTitle}>
                        {msg.userName ||
                          msg.parentName ||
                          `Phụ huynh ${msg.userId || msg.parentId}`}
                        <span className={styles.chatListItemTime}>
                          {msg.timestamp ? formatTime(msg.timestamp) : ""}
                        </span>
                      </div>
                      <div className={styles.chatListItemMsg}>
                        {msg.lastMessage || msg.message || "Tin nhắn mới"}
                      </div>
                      <div className={styles.acceptBtnRight}>
                        <button
                          style={{
                            background:
                              "linear-gradient(90deg, #ff6b8d 0%, #f06292 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 18px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            cursor: assigning ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 8px rgba(255, 105, 135, 0.10)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            outline: "none",
                          }}
                          disabled={assigning || !parentId}
                          onClick={() => assignMessage(parentId)}
                        >
                          {assigning ? (
                            <>
                              <Spinner size="sm" /> Đang xử lý...
                            </>
                          ) : (
                            <>
                              <FaUserCheck style={{ marginRight: 4 }} /> Tiếp
                              nhận
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
        <div className={styles.chatContent}>
          {!selectedConversation ? (
            <div className={styles.chatEmpty}>
              <FaComments style={{ fontSize: 48, color: "#ffb6c1" }} />
              <div>Chọn một cuộc trò chuyện để bắt đầu</div>
            </div>
          ) : (
            <div className={styles.chatDetail}>
              <div className={styles.chatDetailHeader}>
                {selectedConversation.userName ||
                  selectedConversation.parentName ||
                  `Phụ huynh ${
                    selectedConversation.userId || selectedConversation.parentId
                  }`}
              </div>
              {renderChatBubbles()}
              <form className={styles.chatInputForm} onSubmit={sendMessage}>
                <input
                  className={styles.chatInput}
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button
                  className={styles.chatSendBtn}
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseChat;
