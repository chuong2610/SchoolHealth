import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    // Chờ context khôi phục xong mới kiểm tra
    if (loading) {
        return <div>Loading...</div>; // Có thể thay bằng spinner đẹp hơn nếu muốn
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.role?.toLowerCase();
    const currentPath = window.location.pathname;

    // Kiểm tra quyền truy cập dựa trên role và path
    if (currentPath.startsWith('/admin') && userRole !== 'admin') {
        return <Navigate to="/unauthorized" replace />;
    }

    if (currentPath.startsWith('/nurse') && userRole !== 'nurse') {
        return <Navigate to="/unauthorized" replace />;
    }

    if (currentPath.startsWith('/parent') && userRole !== 'parent') {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
