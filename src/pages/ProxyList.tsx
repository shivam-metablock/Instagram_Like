import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { proxyAPI } from '../services/api';
import { Plus, Trash2, Globe, Edit2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Proxy {
    _id: string;
    ip: string;
    port: string;
    country: string;
    status: string;
}

export const ProxyList: React.FC = () => {
    const { user } = useAuth();
    const [proxies, setProxies] = useState<Proxy[]>([]);
    const [showAddProxy, setShowAddProxy] = useState(false);
    const [editingProxyId, setEditingProxyId] = useState<string | null>(null);
    const [proxyFormData, setProxyFormData] = useState({
        ip: '',
        port: '',
        country: '',
        status: 'Active',
    });

    useEffect(() => {
        fetchProxies();
    }, []);

    const fetchProxies = async () => {
        try {
            const data = await proxyAPI.getAll();
            setProxies(data);
        } catch (error) {
            console.error('Error fetching proxies:', error);
        }
    };

    const handleProxySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProxyId) {
                await proxyAPI.update(editingProxyId, proxyFormData);
                alert('Proxy updated successfully!');
            } else {
                await proxyAPI.create(proxyFormData);
                alert('Proxy added successfully!');
            }
            fetchProxies();
            resetForm();
        } catch (error) {
            console.error('Error saving proxy:', error);
            alert('Failed to save proxy');
        }
    };

    const handleEditClick = (proxy: Proxy) => {
        setProxyFormData({
            ip: proxy.ip,
            port: proxy.port,
            country: proxy.country,
            status: proxy.status,
        });
        setEditingProxyId(proxy._id);
        setShowAddProxy(true);
    };

    const handleProxyDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this proxy?')) {
            try {
                await proxyAPI.delete(id);
                fetchProxies();
            } catch (error) {
                console.error('Error deleting proxy:', error);
                alert('Failed to delete proxy');
            }
        }
    };

    const resetForm = () => {
        setProxyFormData({ ip: '', port: '', country: '', status: 'Active' });
        setEditingProxyId(null);
        setShowAddProxy(false);
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Proxy List</h2>
                        <p className="text-gray-400">View and manage available proxies for YouTube views simulation</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">{proxies.length}</div>
                            <div className="text-sm text-gray-400">Total Proxies</div>
                        </div>
                        <Globe className="text-blue-400" size={48} />
                    </div>
                </div>

                {/* Proxy Management Section - Admin Only */}
                {isAdmin && (
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {editingProxyId ? 'Edit Proxy' : 'Manage Proxies'}
                            </h3>
                            {!showAddProxy && (
                                <Button onClick={() => setShowAddProxy(true)} className="flex items-center gap-2">
                                    <Plus size={20} /> Add New Proxy
                                </Button>
                            )}
                        </div>

                        {showAddProxy && (
                            <form onSubmit={handleProxySubmit} className="mb-6 p-6 bg-white/5 rounded-lg border border-white/10">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">IP Address</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                                            value={proxyFormData.ip}
                                            onChange={(e) => setProxyFormData({ ...proxyFormData, ip: e.target.value })}
                                            placeholder="192.168.1.1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Port</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                                            value={proxyFormData.port}
                                            onChange={(e) => setProxyFormData({ ...proxyFormData, port: e.target.value })}
                                            placeholder="8080"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                                            value={proxyFormData.country}
                                            onChange={(e) => setProxyFormData({ ...proxyFormData, country: e.target.value })}
                                            placeholder="United States"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                        <select
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                                            value={proxyFormData.status}
                                            onChange={(e) => setProxyFormData({ ...proxyFormData, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Rotating">Rotating</option>
                                            <option value="Idle">Idle</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" className="flex items-center gap-2">
                                        {editingProxyId ? 'Update Proxy' : 'Add Proxy'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm} className="flex items-center gap-2">
                                        <X size={16} /> Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>
                )}

                {/* Proxy List Table */}
                <Card>
                    <h3 className="text-xl font-bold text-white mb-6">Available Proxies</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">IP Address</th>
                                    <th className="px-4 py-3">Port</th>
                                    <th className="px-4 py-3">Country</th>
                                    <th className="px-4 py-3">Status</th>
                                    {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {proxies.map((proxy) => (
                                    <tr key={proxy._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 text-white font-mono">{proxy.ip}</td>
                                        <td className="px-4 py-3 text-gray-400">{proxy.port}</td>
                                        <td className="px-4 py-3 text-gray-400">{proxy.country}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={proxy.status === 'Active' ? 'success' : proxy.status === 'Rotating' ? 'warning' : 'default'}>
                                                {proxy.status}
                                            </Badge>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(proxy)}
                                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all"
                                                        title="Edit Proxy"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleProxyDelete(proxy._id)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                                                        title="Delete Proxy"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {proxies.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <Globe className="mx-auto mb-4 opacity-20" size={48} />
                                <p>No proxies available yet.</p>
                                {isAdmin && <p className="text-sm mt-2">Add one above to get started!</p>}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};
