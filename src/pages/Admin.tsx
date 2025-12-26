import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { orderAPI, proxyAPI, userAPI } from '../services/api';
import { Users, ShoppingBag, Globe, IndianRupee} from 'lucide-react';

export const Admin: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [proxies, setProxies] = useState<any[]>([]);
    const [userLength, setUserLength] = useState(0);

    useEffect(() => {
        fetchData();
        getuserLength()
    }, []);

    const getuserLength=async()=>{
        try {
            const userLength=await userAPI.getLength()
            setUserLength(userLength.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchData = async () => {
        try {
            const [ordersData, proxiesData] = await Promise.all([
                orderAPI.getAll(),
                proxyAPI.getAll()
            ]);
            setOrders(ordersData);
            setProxies(proxiesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

  


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-500/20 text-green-400';
            case 'REJECTED': return 'bg-red-500/20 text-red-400';
            case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };


    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{userLength}</div>
                                <div className="text-sm text-gray-400">Total Users</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-green-500/10 border-green-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{orders.length}</div>
                                <div className="text-sm text-gray-400">Total Orders</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-purple-500/10 border-purple-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                <IndianRupee size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    ₹{orders.reduce((sum, o) => sum + (o.status === 'APPROVED' ? o.amount : 0), 0).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-400">Revenue (Approved)</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-yellow-500/10 border-yellow-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
                                <Globe size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{proxies.length}</div>
                                <div className="text-sm text-gray-400">Proxies Count</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Pending Orders Section */}
              

                {/* All Orders */}
                <Card>
                    <h3 className="text-xl font-bold text-white mb-4">All Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">Order ID</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Plan</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5">
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                            {order._id.slice(-8)}
                                        </td>
                                        <td className="px-4 py-3 text-white">
                                            {order.userId?.name || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {order.planId?.name || 'Wallet'}
                                        </td>
                                        <td className="px-4 py-3 text-white font-bold">
                                            ₹{order.amount}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && (
                            <div className="text-center py-8 text-gray-400">No orders yet</div>
                        )}
                    </div>
                </Card>

                {/* Modals */}
             

             
            </div>
        </Layout>
    );
};
