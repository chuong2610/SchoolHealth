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
    console.log('🔔 Clearing unread messages (user entered chat page)');
    setHasUnreadMessages(false);

    // Also clear unassigned messages for nurses when they enter chat page
    const currentRole = localStorage.getItem('role');
    if (currentRole?.toLowerCase() === 'nurse') {
      console.log('👩‍⚕️ Also clearing unassigned messages for nurse');
      setHasUnassignedMessages(false);
    }

    console.log('🔔 hasUnreadMessages set to FALSE (cleared)');
  }, []);

  /**
   * Clear unassigned messages (khi nurse assign message)
   */
  const clearUnassignedMessages = useCallback(() => {
    console.log('👩‍⚕️ Clearing unassigned messages (nurse assigned message)');
    setHasUnassignedMessages(false);
  }, []);

  /**
   * Kiểm tra tin nhắn chưa đọc
   */
  const checkUnreadMessages = useCallback(async (userId) => {
    if (!userId) return;

    try {
      console.log('🔔 Checking unread messages for user:', userId);
      const response = await axiosInstance.get(`/Node/has-unread-message/${userId}`);
      const hasUnread = response.data?.hasUnreadMessage || false;

      console.log('🔔 Unread check result:', hasUnread);
      setHasUnreadMessages(hasUnread);

      return hasUnread;
    } catch (error) {
      console.error('❌ Error checking unread messages:', error);
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
      console.log('👩‍⚕️ Checking unassigned messages for nurse...');
      const response = await simpleChatAPI.getUnassignedConversations();

      if (response.success && response.data && response.data.length > 0) {
        console.log('👩‍⚕️ Found unassigned conversations:', response.data.length);
        setHasUnassignedMessages(true);
      } else {
        console.log('👩‍⚕️ No unassigned conversations');
        setHasUnassignedMessages(false);
      }
    } catch (error) {
      console.error('❌ Error checking unassigned messages:', error);
    }
  }, []);

  /**
   * Setup global SignalR connection for ALL users (simple logic)
   */
  const setupGlobalSignalR = useCallback(async (userId) => {
    console.log('🚀 setupGlobalSignalR called with userId:', userId);
    console.log('🚀 Current signalRConnected state:', signalRConnected);

    if (!userId || signalRConnected) {
      console.log('🚀 Skipping setup - userId:', userId, 'signalRConnected:', signalRConnected);
      return;
    }

    try {
      console.log('🌐 Setting up global SignalR connection for user:', userId);

      const connected = await simpleSignalR.startConnection(userId);
      if (!connected) {
        console.error('❌ Failed to connect SignalR');
        return;
      }

      setSignalRConnected(true);

      // Global message listener - SIMPLE LOGIC
      const handleGlobalMessageReceived = (messageData) => {
        console.log('🌐 Global MessageReceived:', JSON.stringify(messageData, null, 2));
        console.log('🌐 Message toUserId:', messageData.toUserId, '| Current userId:', userId);
        console.log('🌐 Current page:', location.pathname);
        console.log('🌐 Is on chat page:', isOnChatPage());

        // Check if this message is intended for the current user
        const isMessageForCurrentUser = messageData.toUserId === parseInt(userId) || messageData.toUserId === userId;

        if (!isMessageForCurrentUser) {
          console.log('📭 Message not for current user - ignoring');
          return;
        }

        console.log('📬 Message is for current user!');

        // SIMPLE LOGIC: If user is NOT on chat page → show red dot
        if (!isOnChatPage()) {
          console.log('🔴 User not on chat page - setting hasUnread = true');
          setHasUnreadMessages(true);
        } else {
          console.log('💬 User on chat page - not setting unread (will be handled by page clear)');
        }
      };

      // Global unassigned message listener - FOR NURSES ONLY
      const handleGlobalNewUnassignedMessage = (messageData) => {
        try {
          console.log('🌐 [NEW HANDLER v2] Global NewUnassignedMessage:', JSON.stringify(messageData, null, 2));
          console.log('🔍 [NEW HANDLER v2] DEBUG: handleGlobalNewUnassignedMessage called!');
          console.log('🔍 [NEW HANDLER v2] DEBUG: About to check localStorage...');

          // Get current user from state (avoid stale closure)
          const currentUser = JSON.parse(localStorage.getItem('userId') || 'null');
          const currentRole = localStorage.getItem('role');

          console.log('🌐 [NEW HANDLER v2] Current user from localStorage:', currentUser);
          console.log('🌐 [NEW HANDLER v2] Current role from localStorage:', currentRole);
          console.log('🌐 [NEW HANDLER v2] Role check result:', currentRole?.toLowerCase() === 'nurse');
          console.log('🌐 [NEW HANDLER v2] All localStorage items:', {
            userId: localStorage.getItem('userId'),
            role: localStorage.getItem('role'),
            token: localStorage.getItem('token') ? 'exists' : 'null'
          });

          console.log('🔍 [NEW HANDLER v2] DEBUG: About to check role condition...');

          // Only nurses should see unassigned message notifications
          if (currentRole?.toLowerCase() === 'nurse') {
            console.log('👩‍⚕️ [NEW HANDLER v2] New unassigned message for nurse - setting hasUnassigned = true');
            console.log('🔍 [NEW HANDLER v2] DEBUG: About to call setHasUnassignedMessages(true)...');
            setHasUnassignedMessages(true);
            console.log('🔍 [NEW HANDLER v2] DEBUG: setHasUnassignedMessages(true) called successfully!');
          } else {
            console.log('❌ [NEW HANDLER v2] User is not a nurse, ignoring unassigned message');
            console.log('❌ [NEW HANDLER v2] Role was:', currentRole, 'lowercased:', currentRole?.toLowerCase());
          }

          console.log('🔍 [NEW HANDLER v2] DEBUG: Handler completed successfully');
        } catch (error) {
          console.error('💥 [NEW HANDLER v2] ERROR in handleGlobalNewUnassignedMessage:', error);
          console.error('💥 [NEW HANDLER v2] Error stack:', error.stack);
        }
      };

      // Register listeners
      console.log('🔧 Registering global SignalR listeners...');
      console.log('🔧 Current listeners before register:', {
        messageReceived: simpleSignalR.listeners?.get('messageReceived')?.size || 0,
        newUnassignedMessage: simpleSignalR.listeners?.get('newUnassignedMessage')?.size || 0
      });

      simpleSignalR.addEventListener('messageReceived', handleGlobalMessageReceived);
      console.log('✅ Registered messageReceived listener');

      simpleSignalR.addEventListener('newUnassignedMessage', handleGlobalNewUnassignedMessage);
      console.log('✅ Registered newUnassignedMessage listener');

      console.log('🔧 Current listeners after register:', {
        messageReceived: simpleSignalR.listeners?.get('messageReceived')?.size || 0,
        newUnassignedMessage: simpleSignalR.listeners?.get('newUnassignedMessage')?.size || 0
      });

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up global SignalR listeners...');
        console.log('🧹 Listeners before cleanup:', {
          messageReceived: simpleSignalR.listeners?.get('messageReceived')?.size || 0,
          newUnassignedMessage: simpleSignalR.listeners?.get('newUnassignedMessage')?.size || 0
        });

        simpleSignalR.removeEventListener('messageReceived', handleGlobalMessageReceived);
        simpleSignalR.removeEventListener('newUnassignedMessage', handleGlobalNewUnassignedMessage);

        console.log('🧹 Listeners after cleanup:', {
          messageReceived: simpleSignalR.listeners?.get('messageReceived')?.size || 0,
          newUnassignedMessage: simpleSignalR.listeners?.get('newUnassignedMessage')?.size || 0
        });
        console.log('🧹 Cleanup complete');
      };
    } catch (error) {
      console.error('❌ Error setting up global SignalR:', error);
      setSignalRConnected(false);
    }
  }, [signalRConnected, isOnChatPage, location.pathname]);

  /**
   * Hàm chuyển hướng dựa vào role
   * @param {string} role
   */
  const redirectBasedOnRole = useCallback(
    (role) => {
      if (!role) return;

      const normalizedRole = role.toLowerCase();
      const currentPath = location.pathname;

      // Chỉ redirect nếu đang ở /, /login, /unauthorized hoặc không đúng role path
      const shouldRedirect =
        currentPath === "/" ||
        currentPath === "/login" ||
        currentPath === "/unauthorized" ||
        !currentPath.startsWith(`/${normalizedRole}`);

      if (shouldRedirect) {
        const targetPath = `/${normalizedRole}`;
        console.log(`🔄 Redirecting to: ${targetPath}`);
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
      if (initializeRef.current) return; // Prevent re-initialization
      initializeRef.current = true;

      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");
        const userEmail = localStorage.getItem("userEmail");

        console.log("🔍 Auth initialization - localStorage data:", {
          token: token ? "exists" : "missing",
          role,
          userId,
          userEmail,
        });

        // Improved token validation
        if (!token) {
          console.log("❌ No token found");
          setUser(null);
          setLoading(false);
          return;
        }

        if (!hasValidToken()) {
          console.log("❌ Invalid or expired token found - clearing data");
          clearAuthToken();
          setUser(null);
          setLoading(false);
          return;
        }

        // Validate other required data
        if (!role || !userId) {
          console.log("❌ Missing role or userId - clearing invalid session");
          clearAuthToken();
          setUser(null);
          setLoading(false);
          return;
        }

        // Tạo user object từ localStorage
        const userData = {
          id: parseInt(userId) || userId,
          email: userEmail || '',
          role: role?.toLowerCase(),
        };

        console.log("👤 Created user data:", userData);

        // Set auth token vào axios instance
        setAuthToken(token);
        setUser(userData);

        // Check unread messages after setting user
        await checkUnreadMessages(userData.id);

        // Check unassigned messages for nurses
        if (userData.role === 'nurse') {
          await checkUnassignedMessages();
        }

        // Setup global SignalR for ALL users
        await setupGlobalSignalR(userData.id);

        // Redirect based on role
        redirectBasedOnRole(userData.role);
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

  /**
   * Hàm đăng nhập: lưu token và user info
   * @param {string} token
   * @param {string} role
   * @param {number} userId
   * @param {string} userEmail
   */
  const login = useCallback(
    async (token, role, userId, userEmail = "") => {
      try {
        console.log("🔐 Login attempt:", {
          token: token ? "exists" : "missing",
          role,
          userId,
          userEmail,
        });

        // Validate input parameters
        if (!token || !role || !userId) {
          throw new Error("Missing required login parameters");
        }

        const normalizedRole = role.toLowerCase();

        // Lưu vào localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", normalizedRole);
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("userEmail", userEmail || '');

        console.log("💾 Saved to localStorage:", {
          token: "saved",
          role: normalizedRole,
          userId: userId.toString(),
          userEmail: userEmail || '',
        });

        // Set token vào axios instance
        setAuthToken(token);

        // Create user object
        const userData = {
          id: parseInt(userId) || userId,
          email: userEmail || '',
          role: normalizedRole,
        };

        console.log("👤 Created user data in login:", userData);

        setUser(userData);

        // Check unread messages after login
        await checkUnreadMessages(userData.id);

        // Check unassigned messages for nurses
        if (userData.role === 'nurse') {
          await checkUnassignedMessages();
        }

        // Setup global SignalR for ALL users
        await setupGlobalSignalR(userData.id);

        // Redirect based on role
        redirectBasedOnRole(normalizedRole);
      } catch (error) {
        console.error("❌ Login failed:", error);
        clearAuthToken();
        setUser(null);
        throw error;
      }
    },
    [redirectBasedOnRole, checkUnreadMessages, setupGlobalSignalR]
  );

  /**
   * Auto clear unread messages khi user vào trang chat
   */
  useEffect(() => {
    if (user && hasUnreadMessages && isOnChatPage()) {
      console.log('🔔 User entered chat page - auto clearing unread messages');
      clearUnreadMessages();
    }
  }, [user, hasUnreadMessages, isOnChatPage, clearUnreadMessages]);

  /**
   * Force cleanup old SignalR listeners to prevent duplicate handlers
   */
  useEffect(() => {
    console.log('🧹 FORCE CLEANUP useEffect triggered! User ID:', user?.id);
    console.log('🧹 FORCE CLEANUP: Removing all old SignalR listeners...');

    // Force cleanup all listeners to prevent duplicates
    if (simpleSignalR.listeners) {
      const listeners = simpleSignalR.listeners;
      console.log('🧹 FORCE CLEANUP: Current listeners before cleanup:', {
        messageReceived: listeners.get('messageReceived')?.size || 0,
        newUnassignedMessage: listeners.get('newUnassignedMessage')?.size || 0,
        total: listeners.size
      });

      // Clear specific events that might have old handlers
      if (listeners.has('messageReceived')) {
        listeners.get('messageReceived').clear();
        console.log('🧹 FORCE CLEANUP: Cleared messageReceived listeners');
      }

      if (listeners.has('newUnassignedMessage')) {
        listeners.get('newUnassignedMessage').clear();
        console.log('🧹 FORCE CLEANUP: Cleared newUnassignedMessage listeners');
      }

      console.log('🧹 FORCE CLEANUP: Listeners after cleanup:', {
        messageReceived: listeners.get('messageReceived')?.size || 0,
        newUnassignedMessage: listeners.get('newUnassignedMessage')?.size || 0
      });
    }

    console.log('🧹 FORCE CLEANUP: Complete');
  }, [user?.id]); // Run when user changes

  /**
   * Re-setup SignalR listeners after cleanup
   */
  useEffect(() => {
    console.log('🔄 RE-SETUP useEffect triggered!');
    console.log('🔄 RE-SETUP conditions:', {
      'user?.id': user?.id,
      'signalRConnected': signalRConnected,
      'shouldSetup': user?.id && !signalRConnected
    });

    if (user?.id && !signalRConnected) {
      console.log('🔄 RE-SETUP: Setting up fresh SignalR listeners after cleanup...');
      setupGlobalSignalR(user.id);
    } else {
      console.log('🔄 RE-SETUP: Skipping setup - conditions not met');
    }
  }, [user?.id, signalRConnected, setupGlobalSignalR]);

  /**
   * Hàm đăng xuất: xóa tất cả auth data và chuyển về login
   */
  const logout = useCallback(async () => {
    console.log("🚪 Logging out user");

    // Cleanup SignalR connection
    if (signalRConnected) {
      console.log("🛑 Stopping SignalR connection");
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
      console.warn("🔒 User exists but token invalid - auto logout");
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
