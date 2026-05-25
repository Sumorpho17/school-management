import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, getRoleDashboardPath } from '../../store/authStore';

interface RequireAuthProps {
    allowedRoles?: string[];
}

export default function RequireAuth({ allowedRoles }: RequireAuthProps) {
    const { user, role, profile, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner-lg" />
                <p>Loading...</p>
            </div>
        );
    }

    // Not authenticated → redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated but wrong role → redirect to correct dashboard
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return <Navigate to={getRoleDashboardPath(role)} replace />;
    }

    // Admin without a school → redirect to onboarding (unless already there)
    if (
        role === 'admin' &&
        profile &&
        !profile.school_id &&
        location.pathname !== '/onboarding/school-setup'
    ) {
        return <Navigate to="/onboarding/school-setup" replace />;
    }

    return <Outlet />;
}
