import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = ['admin'] }) => {
    const { isAuthenticated, user } = useAuth();

    console.log('ProtectedRoute:', {
        isAuthenticated: isAuthenticated(),
        user,
        allowedRoles,
        currentPath: window.location.pathname
    });

    if (!isAuthenticated()) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.role?.toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());

    console.log('Role check:', {
        userRole,
        allowed,
        isAllowed: allowed.includes(userRole)
    });

    if (!allowed.includes(userRole)) {
        console.log('Role not allowed, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
