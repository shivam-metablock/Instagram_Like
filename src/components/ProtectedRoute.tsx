import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Logged in but not admin when admin required
    if (requireAdmin && user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
                    <a href="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white inline-block">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
