import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface  User {
    _id: string;
    name: string;
    email: string;
    role: string;
    number:string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (name: string, password: string,number:string) => Promise<User>;
    logout: () => void;
    updateMe: (data: { name: string;number: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate=useNavigate();
    useEffect(() => {
        // Check for stored user on mount
      
        getSelf();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authAPI.login({ email, password });
        // Set user state from the returned data
        const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            number:data.number,
            role: data.role
        };
        setUser(userData);
        // Also ensure localStorage has the correct data
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const register = async (name: string, password: string,number:string) => {
        const data = await authAPI.register({ name, password,number });
        const userData = {
            _id: data._id,
            name: data.name,
            email: data.email,
            number:data.number,
            role: data.role
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const getSelf = async () => {
        const data = await authAPI.getMe();
        if(data.message=="Not authorized, no token"){
            return navigate('/login');
        }
        setUser(data);
        setLoading(false);
    };
    const updateMe = async (data: { name: string;number: string }) => {
        const response = await authAPI.updateMe(data);
        setUser(response);
        setLoading(false);
    };
    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout,updateMe }}>
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
