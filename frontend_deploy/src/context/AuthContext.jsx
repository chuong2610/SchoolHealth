import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  setAuthToken,
  clearAuthToken,
  hasValidToken,
} from "../api/axiosInstance";
import axiosInstance from "../api/axiosInstance";
import simpleSignalR from "../services/simpleSignalR";
import simpleChatAPI from "../api/simpleChatApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State lưu thông tin user và trạng thái loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasUnassignedMessages, setHasUnassignedMessages] = useState(false); // For nurses only
  const [signalRConnected, setSignalRConnected] = useState(false);
  const initializeRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Kiểm tra user có đang ở trang chat không
   */
  const isOnChatPage = useCallback(() => {
    const path = location.pathname.toLowerCase();
    return path.includes('/chat') || path.endsWith('/chat');
  }, [location.pathname]);

  /**
   * Clear unread messages (khi user vào trang chat)
   */
  const clearUnreadMessages = useCallback(() => {

    setHasUnreadMessages(false);

    // Also clear unassigned messages for nurses when they enter chat page
    const currentRole = localStorage.getItem('role');
    if (currentRole?.toLowerCase() === 'nurse') {
      setHasUnassignedMessages(false);
    }

  }, []);

  /**
   * Clear unassigned messages (khi nurse assign message)
   */
  const clearUnassignedMessages = useCallback(() => {
    setHasUnassignedMessages(false);
  }, []);

  /**
   * Kiểm tra tin nhắn chưa đọc
   */
  const checkUnreadMessages = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const response = await axiosInstance.get(`/Node/has-unread-message/${userId}`);
      const hasUnread = response.data?.hasUnreadMessage || false;

      setHasUnreadMessages(hasUnread);

      return hasUnread;
    } catch (error) {
      setHasUnreadMessages(false);
      return false;
    }
  }, []);

  /**
   * Check for unassigned messages (chỉ cho nurse)
   */
  const checkUnassignedMessages = useCallback(async () => {
    // Only check for nurses
    const currentRole = localStorage.getItem('role');
    if (currentRole?.toLowerCase() !== 'nurse') {
      return;
    }

    try {
      const response = await simpleChatAPI.getUnassignedConversations();

      if (response.success && response.data && response.data.length > 0) {
        setHasUnassignedMessages(true);
      } else {
        setHasUnassignedMessages(false);
      }
    } catch (error) {
    }
  }, []);

  /**
   * Setup global SignalR connection for ALL users (simple logic)
   */
  const setupGlobalSignalR = useCallback(async (userId) => {

    if (!userId || signalRConnected) {
      return;
    }

    try {

      const connected = await simpleSignalR.startConnection(userId);
      if (!connected) {
        return;
      }

      setSignalRConnected(true);

      // Global message listener - SIMPLE LOGIC
      const handleGlobalMessageReceived = (messageData) => {

        // Check if this message is intended for the current user
        const isMessageForCurrentUser = messageData.toUserId === parseInt(userId) || messageData.toUserId === userId;

        if (!isMessageForCurrentUser) {
          return;
        }

        // SIMPLE LOGIC: If user is NOT on chat page → show red dot
        if (!isOnChatPage()) {
          setHasUnreadMessages(true);
        } else {
        }
      };

      // Global unassigned message listener - FOR NURSES ONLY
      const handleGlobalNewUnassignedMessage = (messageData) => {
        try {
          // Get current user from state (avoid stale closure)
          const currentUser = JSON.parse(localStorage.getItem('userId') || 'null');
          const currentRole = localStorage.getItem('role');


          // Only nurses should see unassigned message notifications
          if (currentRole?.toLowerCase() === 'nurse') {
            setHasUnassignedMessages(true);
          } else {
          }

        } catch (error) {
        }
      };

      // Register listeners
      simpleSignalR.addEventListener('messageReceived', handleGlobalMessageReceived);

      simpleSignalR.addEventListener('newUnassignedMessage', handleGlobalNewUnassignedMessage);

      // Cleanup function
      return () => {
        simpleSignalR.removeEventListener('messageReceived', handleGlobalMessageReceived);
        simpleSignalR.removeEventListener('newUnassignedMessage', handleGlobalNewUnassignedMessage);

      };
    } catch (error) {
      setSignalRConnected(false);
    }
  }, [signalRConnected, isOnChatPage, location.pathname]);

  /**
   * Hàm chuyển hướng dựa vào role
   * @param {string} role
   */
  const redirectBasedOnRole = useCallback(
    (role) => {
      if (!role) {
        return;
      }

      const normalizedRole = role.toLowerCase();
      const currentPath = location.pathname;

      // Chỉ redirect nếu đang ở /, /login, /unauthorized
      const shouldRedirect =
        currentPath === "/" ||
        currentPath === "/login" ||
        currentPath === "/unauthorized";

      if (shouldRedirect) {
        const targetPath = `/${normalizedRole}`;
        navigate(targetPath, { replace: true });
      }
    },
    [navigate, location.pathname]
  );

  /**
   * useEffect tự động khôi phục session nếu có token hợp lệ
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');

      const valid = hasValidToken();

      if (token && valid && role && userId) {
        setAuthToken(token);
        setUser({ id: parseInt(userId) || userId, role: role?.toLowerCase(), email: userEmail });
        setLoading(false);
      } else {
        clearAuthToken();
        setUser(null);
        setLoading(false);
      }
    };
    initializeAuth();
  }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

  /**
   * Hàm đăng nhập: lưu token và user info
   */
  const login = useCallback(
    async (token, role, userId, userEmail = "") => {
      try {
        setLoading(true); // Bắt đầu login thì loading
        setAuthToken(token); // Đặt token NGAY LẬP TỨC

        setUser({ id: parseInt(userId) || userId, role: role?.toLowerCase(), email: userEmail });
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!token || !role || !userId) {
          throw new Error("Missing required login parameters");
        }

        const normalizedRole = role.toLowerCase();
        localStorage.setItem("token", token);
        localStorage.setItem("role", normalizedRole);
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("userEmail", userEmail || '');

        const userData = {
          id: parseInt(userId) || userId,
          email: userEmail || '',
          role: normalizedRole,
        };
        setUser(userData);
        await checkUnreadMessages(userData.id);
        if (userData.role === 'nurse') {
          await checkUnassignedMessages();
        }
        await setupGlobalSignalR(userData.id);
        redirectBasedOnRole(normalizedRole);
      } catch (error) {
        clearAuthToken();
        setUser(null);
        throw error;
      } finally {
        setLoading(false); // Đảm bảo luôn set loading về false
      }
    },
    [redirectBasedOnRole, checkUnreadMessages, setupGlobalSignalR]
  );

  /**
   * Auto clear unread messages khi user vào trang chat
   */
  useEffect(() => {
    if (user && hasUnreadMessages && isOnChatPage()) {
      clearUnreadMessages();
    }
  }, [user, hasUnreadMessages, isOnChatPage, clearUnreadMessages]);

  /**
   * Force cleanup old SignalR listeners to prevent duplicate handlers
   */
  useEffect(() => {


    // Force cleanup all listeners to prevent duplicates
    if (simpleSignalR.listeners) {
      const listeners = simpleSignalR.listeners;


      // Clear specific events that might have old handlers
      if (listeners.has('messageReceived')) {
        listeners.get('messageReceived').clear();
      }

      if (listeners.has('newUnassignedMessage')) {
        listeners.get('newUnassignedMessage').clear();
      }

    }

  }, [user?.id]); // Run when user changes

  /**
   * Re-setup SignalR listeners after cleanup
   */
  useEffect(() => {

    if (user?.id && !signalRConnected) {
      setupGlobalSignalR(user.id);
    } else {
    }
  }, [user?.id, signalRConnected, setupGlobalSignalR]);

  /**
   * Hàm đăng xuất: xóa tất cả auth data và chuyển về login
   */
  const logout = useCallback(async () => {

    // Cleanup SignalR connection
    if (signalRConnected) {
      await simpleSignalR.stopConnection();
      setSignalRConnected(false);
    }

    // Clear all auth data
    clearAuthToken();
    setUser(null);
    setHasUnreadMessages(false);
    setHasUnassignedMessages(false);

    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate, signalRConnected]);

  /**
   * Kiểm tra đã đăng nhập chưa
   * @returns {boolean}
   */
  const isAuthenticated = useCallback(() => {
    const result = !!user && hasValidToken();
    if (!result && user) {
      // User exists but token is invalid - auto logout
      logout();
    }
    return result;
  }, [user, logout]);

  /**
   * Lấy role của user hiện tại
   * @returns {string|null}
   */
  const getUserRole = useCallback(() => {
    return user?.role || null;
  }, [user]);

  /**
   * Lấy ID của user hiện tại
   * @returns {string|number|null}
   */
  const getUserId = useCallback(() => {
    return user?.id || null;
  }, [user]);

  /**
   * Kiểm tra user có role cụ thể không
   * @param {string} role
   * @returns {boolean}
   */
  const hasRole = useCallback(
    (role) => {
      return user?.role?.toLowerCase() === role.toLowerCase();
    },
    [user]
  );

  const contextValue = {
    user,
    loading,
    hasUnreadMessages,
    hasUnassignedMessages,
    signalRConnected,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    getUserId,
    hasRole,
    checkUnreadMessages,
    checkUnassignedMessages,
    clearUnreadMessages,
    isOnChatPage,
    clearUnassignedMessages,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
