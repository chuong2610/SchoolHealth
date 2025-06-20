import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthToken, clearAuthToken, hasValidToken } from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // State lưu thông tin user và trạng thái loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Hàm decode JWT token để lấy thông tin user
     * @param {string} token
     * @returns {Object|null}
     */
    const decodeToken = useCallback((token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('🔓 Decoded token payload:', payload);

            return {
                id: payload.sub,
                email: payload.email,
                role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase(),
                exp: payload.exp // Token expiration time
            };
        } catch (e) {
            console.error('❌ Failed to decode token:', e);
            return null;
        }
    }, []);

    /**
     * Hàm kiểm tra token có còn hợp lệ không (chưa expired)
     * @param {string} token
     * @returns {boolean}
     */
    const isTokenValid = useCallback((token) => {
        if (!token) return false;

        const decoded = decodeToken(token);
        if (!decoded) return false;

        // Kiểm tra token có expired chưa (thêm buffer 30 giây)
        const currentTime = Math.floor(Date.now() / 1000);
        const isValid = decoded.exp > (currentTime + 30);

        if (!isValid) {
            console.warn('⏰ Token has expired');
        }

        return isValid;
    }, [decodeToken]);

    /**
     * Hàm chuyển hướng dựa vào role
     * @param {string} role
     */
    const redirectBasedOnRole = useCallback((role) => {
        if (!role) return;

        const normalizedRole = role.toLowerCase();
        const currentPath = location.pathname;

        console.log('🔄 Redirecting based on role:', { role: normalizedRole, currentPath });

        // Chỉ redirect nếu đang ở /, /login, /unauthorized hoặc không đúng role path
        const shouldRedirect =
            currentPath === '/' ||
            currentPath === '/login' ||
            currentPath === '/unauthorized' ||
            !currentPath.startsWith(`/${normalizedRole}`);

        if (shouldRedirect) {
            const targetPath = `/${normalizedRole}`;
            console.log('🎯 Redirecting to:', targetPath);
            navigate(targetPath, { replace: true });
        }
    }, [navigate, location.pathname]);

    /**
     * useEffect tự động khôi phục session nếu có token hợp lệ
     */
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('🔄 Initializing authentication...');

            try {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');
                const userId = localStorage.getItem('userId');

                if (!token) {
                    console.log('📝 No token found, user not authenticated');
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Kiểm tra token có hợp lệ không
                if (!isTokenValid(token)) {
                    console.warn('⚠️ Token is invalid or expired, clearing auth data');
                    clearAuthToken();
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Decode token để lấy thông tin user
                const decodedUser = decodeToken(token);
                if (!decodedUser) {
                    console.error('❌ Failed to decode token, clearing auth data');
                    clearAuthToken();
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Tạo user object từ token và localStorage
                const userData = {
                    id: decodedUser.id || userId,
                    email: decodedUser.email,
                    role: decodedUser.role || role?.toLowerCase(),
                    exp: decodedUser.exp
                };

                console.log('✅ Auth initialized successfully:', userData);

                // Set auth token vào axios instance
                setAuthToken(token);
                setUser(userData);

                // Redirect based on role
                redirectBasedOnRole(userData.role);

            } catch (error) {
                console.error('❌ Auth initialization failed:', error);
                clearAuthToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []); // Empty dependency array - chỉ chạy 1 lần khi mount

    /**
     * Hàm đăng nhập: lưu token, decode user info và chuyển hướng
     * @param {string} token
     * @param {string} role
     * @param {number} userId
     */
    const login = useCallback(async (token, role, userId) => {
        console.log('🔐 Logging in with:', { role, userId });

        try {
            // Validate token
            if (!isTokenValid(token)) {
                throw new Error('Invalid or expired token');
            }

            // Decode token
            const decodedUser = decodeToken(token);
            if (!decodedUser) {
                throw new Error('Failed to decode token');
            }

            const normalizedRole = role.toLowerCase();

            // Lưu vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', normalizedRole);
            localStorage.setItem('userId', userId.toString());

            // Set token vào axios instance
            setAuthToken(token);

            // Create user object
            const userData = {
                id: decodedUser.id || userId,
                email: decodedUser.email,
                role: normalizedRole,
                exp: decodedUser.exp
            };

            setUser(userData);

            console.log('✅ Login successful:', userData);

            // Redirect based on role
            redirectBasedOnRole(normalizedRole);

        } catch (error) {
            console.error('❌ Login failed:', error);
            clearAuthToken();
            setUser(null);
            throw error;
        }
    }, [isTokenValid, decodeToken, redirectBasedOnRole]);

    /**
     * Hàm đăng xuất: xóa tất cả auth data và chuyển về login
     */
    const logout = useCallback(() => {
        console.log('🚪 Logging out...');

        // Clear all auth data
        clearAuthToken();
        setUser(null);

        // Redirect to login
        navigate('/login', { replace: true });

        console.log('✅ Logout successful');
    }, [navigate]);

    /**
     * Kiểm tra đã đăng nhập chưa
     * @returns {boolean}
     */
    const isAuthenticated = useCallback(() => {
        const result = !!user && hasValidToken() && isTokenValid(localStorage.getItem('token'));
        console.log('🔍 Checking authentication:', {
            hasUser: !!user,
            hasToken: hasValidToken(),
            tokenValid: isTokenValid(localStorage.getItem('token')),
            result
        });
        return result;
    }, [user, isTokenValid]);

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
    const hasRole = useCallback((role) => {
        return user?.role?.toLowerCase() === role.toLowerCase();
    }, [user]);

    const contextValue = {
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        getUserRole,
        getUserId,
        hasRole
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
