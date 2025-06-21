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
     * Hàm chuyển hướng dựa vào role
     * @param {string} role
     */
    const redirectBasedOnRole = useCallback((role) => {
        if (!role) return;

        const normalizedRole = role.toLowerCase();
        const currentPath = location.pathname;

        // Chỉ redirect nếu đang ở /, /login, /unauthorized hoặc không đúng role path
        const shouldRedirect =
            currentPath === '/' ||
            currentPath === '/login' ||
            currentPath === '/unauthorized' ||
            !currentPath.startsWith(`/${normalizedRole}`);

        if (shouldRedirect) {
            const targetPath = `/${normalizedRole}`;
            navigate(targetPath, { replace: true });
        }
    }, [navigate, location.pathname]);

    /**
     * useEffect tự động khôi phục session nếu có token hợp lệ
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');
                const userId = localStorage.getItem('userId');
                const userEmail = localStorage.getItem('userEmail');

                if (!token || !hasValidToken()) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Tạo user object từ localStorage
                const userData = {
                    id: userId,
                    email: userEmail,
                    role: role?.toLowerCase()
                };

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
     * Hàm đăng nhập: lưu token và user info
     * @param {string} token
     * @param {string} role
     * @param {number} userId
     * @param {string} userEmail
     */
    const login = useCallback(async (token, role, userId, userEmail = '') => {
        try {
            const normalizedRole = role.toLowerCase();

            // Lưu vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', normalizedRole);
            localStorage.setItem('userId', userId.toString());
            localStorage.setItem('userEmail', userEmail);

            // Set token vào axios instance
            setAuthToken(token);

            // Create user object
            const userData = {
                id: userId,
                email: userEmail,
                role: normalizedRole
            };

            setUser(userData);

            // Redirect based on role
            redirectBasedOnRole(normalizedRole);

        } catch (error) {
            console.error('❌ Login failed:', error);
            clearAuthToken();
            setUser(null);
            throw error;
        }
    }, [redirectBasedOnRole]);

    /**
     * Hàm đăng xuất: xóa tất cả auth data và chuyển về login
     */
    const logout = useCallback(() => {
        // Clear all auth data
        clearAuthToken();
        localStorage.removeItem('userEmail');
        setUser(null);

        // Redirect to login
        navigate('/login', { replace: true });
    }, [navigate]);

    /**
     * Kiểm tra đã đăng nhập chưa
     * @returns {boolean}
     */
    const isAuthenticated = useCallback(() => {
        return !!user && hasValidToken();
    }, [user]);

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
