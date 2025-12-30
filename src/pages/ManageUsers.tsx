import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { orderAPI } from '../services/api';
import { Users, Eye, ShoppingBag, X } from 'lucide-react';
import axios from 'axios';

interface User {
    _id: string;
    name: string;
    email: string;
    number :string,
    role: string;
    AccountName?: string;
}

interface Order {
    _id: string;
    userId: string | User;
    planId: {
        _id: string;
        name: string;
        type: string;
        price: number;
    };
    amount: number;
    status: string;
    createdAt: string;
    isCompleted: boolean;
}

interface UserWithOrders {
    user: User;
    orders: Order[];
    totalSpent: number;
}

export const ManageUsers: React.FC = () => {
    const [usersData, setUsersData] = useState<UserWithOrders[]>([]);
    const [usersDataCP, setUsersDataCP] = useState<UserWithOrders[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserWithOrders | null>(null);
    const [showPlansModal, setShowPlansModal] = useState(false);

    useEffect(() => {
        fetchAllUsersAndOrders();
    }, []);

    const fetchAllUsersAndOrders = async () => {
        try {
            setLoading(true);

            // Fetch all users
            const token = localStorage.getItem('token');
            const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const users: User[] = usersResponse.data;

            // Fetch all orders
            const orders: Order[] = await orderAPI.getAll();
            console.log('Orders fetched:', orders);

            // Group orders by user
            const userOrdersMap: { [key: string]: Order[] } = {};
            orders.forEach((order: Order) => {
                // Backend returns populated 'userId' field, or just ID if not populated
                if (!order.userId) return; // Skip if no user attached

                const userId = typeof order.userId === 'string' ? order.userId : order.userId._id;
                if (!userOrdersMap[userId]) {
                    userOrdersMap[userId] = [];
                }
                userOrdersMap[userId].push(order);
            });

            // Combine users with their orders - Filter out admin users
            const usersWithOrders: UserWithOrders[] = users
                .filter(user => user.role !== 'ADMIN')  // Exclude admin users
                .map((user) => {
                    const userOrders = userOrdersMap[user._id] || [];
                    const totalSpent = userOrders.reduce((sum, o) => sum + o.amount, 0);
                    return {
                        user,
                        orders: userOrders,
                        totalSpent
                    };
                });

            setUsersData(usersWithOrders);
            setUsersDataCP(usersWithOrders);
        } catch (error) {
            console.error('Error fetching users and orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPlans = (userData: UserWithOrders) => {
        setSelectedUser(userData);
        setShowPlansModal(true);
    };

    const closeModal = () => {
        setShowPlansModal(false);
        setSelectedUser(null);
    };
    const handleCompleteOrder = async (orderId: string) => {
        await orderAPI.updateOrder(orderId, { isCompleted: true })
        fetchAllUsersAndOrders()
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const searchValue = e.currentTarget.value;
        const filteredUsers = usersDataCP.filter(user => user.user.name.toLowerCase().includes(searchValue.toLowerCase()));
        setUsersData(filteredUsers);
    }
    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Manage Users</h2>
                        <p className="text-gray-400 mt-1">View all users and their purchased plans</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">{usersData.length}</div>
                            <div className="text-sm text-gray-400">Total Users</div>
                        </div>
                        <Users className="text-blue-400" size={48} />
                    </div>
                </div>
                <div className='flex justify-end'>
                 
                     <input type="search" placeholder="Search users" onChange={(e) => handleSearch(e)} className="p-2 border border-gray-400 focus:border-blue-400 bg-transparent text-white rounded" />
                   
                </div>

                {loading ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-400">Loading users...</p>
                    </Card>
                ) : usersData.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-400">No users found</p>
                    </Card>
                ) : (
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-xs uppercase text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Number</th>
                                        <th className="px-4 py-3">Instagram Account</th>
                                        <th className="px-4 py-3">Total Orders</th>
                                        <th className="px-4 py-3">Total Spent</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {usersData.length > 0 ? (
                                        usersData.map((userData) => (
                                            <tr key={userData.user._id} className="hover:bg-white/5">
                                                <td className="px-4 py-3 text-white font-medium">{userData.user.name}</td>
                                                <td className="px-4 py-3 text-gray-400">{userData.user.number}</td>
                                                <td className="px-4 py-3 text-gray-300">{userData.user.AccountName || '-'}</td>
                                                <td className="px-4 py-3 text-white">{userData.orders.length}</td>
                                                <td className="px-4 py-3 text-green-400 font-bold">
                                                    ${userData.totalSpent.toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Button
                                                        onClick={() => handleViewPlans(userData)}
                                                        variant="outline"
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <Eye size={16} /> View Plans
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Plans Modal */}
                {showPlansModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-white/10 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedUser.user.name}'s Plans</h3>
                                    <p className="text-sm text-gray-400 mt-1">{selectedUser.user.email}</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {selectedUser.orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingBag className="mx-auto text-gray-600 mb-4" size={64} />
                                        <p className="text-gray-400 text-lg">No plans purchased yet</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                                <div className="text-sm text-gray-400 mb-1">Total Orders</div>
                                                <div className="text-3xl font-bold text-white">{selectedUser.orders.length}</div>
                                            </div>
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                                <div className="text-sm text-gray-400 mb-1">Total Spent</div>
                                                <div className="text-3xl font-bold text-green-400">
                                                    ${selectedUser.totalSpent.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Orders Table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-white/5 text-xs uppercase text-gray-400">
                                                    <tr>
                                                        <th className="px-4 py-2">Order ID</th>
                                                        <th className="px-4 py-2">Plan Name</th>
                                                        <th className="px-4 py-2">Type</th>
                                                        <th className="px-4 py-2">Amount</th>
                                                        <th className="px-4 py-2">Status</th>
                                                        <th className="px-4 py-2">Date</th>
                                                        <th>Completed</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {selectedUser.orders.map((order) => (
                                                        <tr key={order._id} className="hover:bg-white/5">
                                                            <td className="px-4 py-2 text-white font-mono text-xs">
                                                                {order._id.slice(-8)}
                                                            </td>
                                                            <td className="px-4 py-2 text-white font-medium">
                                                                {order.planId?.name || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <Badge variant={order.planId?.type === 'VIEWS' ? 'success' : 'default'}>
                                                                    {order.planId?.type || 'N/A'}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-2 text-white font-bold">
                                                                ${order.amount}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <Badge variant={order.status === 'COMPLETED' ? 'success' : 'warning'}>
                                                                    {order.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-2 text-gray-400">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-4 py-2" onClick={() => handleCompleteOrder(order._id)}>
                                                                <Badge variant={order.isCompleted ? 'success' : 'warning'}>
                                                                    {order.isCompleted ? 'Completed' : 'Pending'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-white/10 flex justify-end">
                                <Button onClick={closeModal} variant="outline">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
