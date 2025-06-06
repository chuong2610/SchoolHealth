import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // State lưu thông tin user và trạng thái loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Hàm kiểm tra token hợp lệ (tạm thời chỉ kiểm tra tồn tại)
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    const validateToken = useCallback(async (token) => {
        console.log('Validating token:', token);
        // TODO: Thay thế bằng gọi API thực sự nếu cần
        return !!token;
    }, []);

    /**
     * Hàm chuyển hướng dựa vào role
     * @param {string} role
     */
    const redirectBasedOnRole = useCallback((role) => {
        if (!role) return;
        const normalizedRole = role.toLowerCase();
        const currentPath = location.pathname;

        // Chỉ redirect nếu đang ở / hoặc /login hoặc /unauthorized
        if (
            currentPath === '/' ||
            currentPath === '/login' ||
            currentPath === '/unauthorized'
        ) {
            const targetPath = `/${normalizedRole}`;
            navigate(targetPath, { replace: true });
        }
    }, [navigate, location.pathname]);


    /**
     * useEffect tự động đăng nhập lại nếu đã có token và role trong localStorage
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                let role = localStorage.getItem('role');
                let userId = localStorage.getItem('userId');
                let user = null;
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        console.log('Decoded token payload:', payload);
                        user = {
                            id: payload.sub,
                            email: payload.email,
                            role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase() || role,
                        };
                    } catch (e) {
                        console.warn('Failed to decode token payload:', e);
                    }
                }
                if (!user?.id && userId) user = { ...(user || {}), id: Number(userId), role };
                if (user && user.id && user.role) {
                    setUser(user);
                    redirectBasedOnRole(user.role);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('userId');
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('userId');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, [validateToken, redirectBasedOnRole]);

    /**
     * Hàm đăng nhập: lưu token, role (đã normalize), set user và chuyển hướng
     * @param {string} token
     * @param {string} role
     */
    const login = useCallback(async (token, role, userId) => {
        try {
            const isValid = await validateToken(token);
            const normalizedRole = role.toLowerCase();

            if (isValid) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', normalizedRole);
                localStorage.setItem('userId', userId); // 👈 Thêm dòng này
                setUser({ role: normalizedRole, userId }); // 👈 Thêm userId vào user
                redirectBasedOnRole(normalizedRole);
            } else {
                throw new Error('Invalid token');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }, [validateToken, redirectBasedOnRole]);


    /**
     * Hàm đăng xuất: xóa token, role và chuyển về trang login
     */
    const logout = useCallback(() => {
        console.log('Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setUser(null);
        navigate('/login', { replace: true });
    }, [navigate]);

    /**
     * Kiểm tra đã đăng nhập chưa
     * @returns {boolean}
     */
    const isAuthenticated = useCallback(() => {
        const result = !!user;
        console.log('Checking authentication:', { user, result });
        return result;
    }, [user]);

    /**
     * Kiểm tra user có đúng role không
     * @param {string} role
     * @returns {boolean}
     */
    const hasRole = useCallback((role) => {
        const result = user?.role === role.toLowerCase();
        console.log('Checking role:', { userRole: user?.role, requestedRole: role, result });
        return result;
    }, [user]);

    // Loading UI khi đang kiểm tra đăng nhập lại
    if (loading) {
        return <div>Loading...</div>;
    }

    // Cung cấp context cho toàn bộ app
    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook để sử dụng AuthContext
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
