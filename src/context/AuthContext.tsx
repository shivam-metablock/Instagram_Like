import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
    _id: string;
    name: string;
    role: string;
    number: string;
    password?: string;
    helpCenter?: HelpCenter[];
    walletBalance: number;
}
interface HelpCenter {
    _id: string;
    title: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (name: string, password: string, number: string) => Promise<User>;
    logout: () => void;
    updateMe: (data: { name: string; number: string ,currentPassword: string}) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount

        getSelf();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const data = await authAPI.login({ email, password });
            const userData: User = {
                _id: data._id,
                name: data.name,
                number: data.number,
                role: data.role,
                walletBalance: data.walletBalance || 0
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, password: string, number: string) => {
        try {
            setLoading(true);
            const data = await authAPI.register({ name, password, number });
            const userData: User = {
                _id: data._id,
                name: data.name,
                number: data.number,
                role: data.role,
                walletBalance: data.walletBalance || 0
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const getSelf = async () => {
        try {
            const data = await authAPI.getMe();
            if (data && !data.message) {
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error: any) {
            setUser(null);
            // If it's a 401, we just stay logged out
            if (error.response?.status === 401) {
                // Navigate to login if we are on a protected route? 
                // ProtectedRoute handles this already if user is null.
            }
        } finally {
            setLoading(false);
        }
    };
    const updateMe = async (data: { name: string; number: string, currentPassword: string }) => {
        const response = await authAPI.updateMe(data);
        setUser(response);
        setLoading(false);
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateMe }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
