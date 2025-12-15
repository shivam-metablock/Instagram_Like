import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail } from 'lucide-react';

export const AdminLogin: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);

            // Check the user from localStorage immediately after login
            const storedUser = localStorage.getItem('user');

            if (!storedUser) {
                setError('Login failed. Please try again.');
                setLoading(false);
                return;
            }

            const userData = JSON.parse(storedUser);

            // Verify admin role
            if (userData.role !== 'ADMIN') {
                setError('Access denied. Admin credentials required.');
                // Logout non-admin user
                logout();
                setLoading(false);
                return;
            }

            // Success - redirect to admin panel
            navigate('/admin');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                        <Shield className="text-red-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-400">Secure admin access only</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <Mail size={16} className="inline mr-2" />
                                Admin Email
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                <Lock size={16} className="inline mr-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-500"
                        >
                            {loading ? 'Authenticating...' : 'Admin Login'}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="text-center">
                            <p className="text-sm text-gray-400 mb-2">Not an admin?</p>
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
                                User Login →
                            </Link>
                        </div>
                    </div>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Default admin: admin@example.com / admin123
                    </p>
                </div>
            </div>
        </div>
    );
};
