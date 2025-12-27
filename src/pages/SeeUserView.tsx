import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { orderAPI } from '../services/api';
import { getTypeColor } from '../utils/color';


interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    AccountName?: string;
}

export interface Order {
    _id: string;
    userId: User;
    planId: {
        _id: string;
        name: string;
        type: string;
        price: number;
    };

    video: string
    amount: number;
    status: string;
    createdAt: string;
    isCompleted: boolean;
}



export const UsersVideo: React.FC = () => {
    const [usersData, setUsersData] = useState<Order[]>([]);
    const [copyData,setCopyData]=useState<Order[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllUsersAndOrders();
    }, []);

    const fetchAllUsersAndOrders = async () => {
        try {
            setLoading(true);
            const orders: Order[] = await orderAPI.getAll();
            console.log('Orders fetched:', orders);

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
            setUsersData(orders);
            setCopyData(orders)
        } catch (error) {
            console.error('Error fetching users and orders:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleCompleteOrder = async (orderId: string, isCompleted: boolean) => {
        if (!confirm("are you sure you want to change this order status?")) return;
        await orderAPI.updateOrder(orderId, { isCompleted })
        fetchAllUsersAndOrders()
    }
    return (
        <Layout>



            {loading ? (
                <Card className="p-8 text-center">
                    <p className="text-gray-400">Loading users...</p>
                </Card>
            ) : usersData.length === 0 && (
                <Card className="p-8 text-center">
                    <p className="text-gray-400">No users found</p>
                </Card>
            )}
            {usersData.length > 0 && (
                <Card className="border-yellow-500/30">
                    <div className=" flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">Orders
                        </h3>
                        <div className="flex items-center gap-2">
                            <select
                            
                                onChange={(e) =>e.target.value===""?setUsersData(copyData):setUsersData(copyData.filter((order) => String(order.isCompleted) === e.target.value)) }
                                className="bg-slate-800 text-white text-xs border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-purple-500"
                            >
                                <option value="">All</option>
                                <option value="false">Pending</option>
                                <option value="true">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Plan</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-3 text-center">Video</th>
                                    <th className="px-4 py-3">Order Completed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {usersData.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="hover:bg-white/5">
                                            <td className="px-4 py-3 text-white">{order.userId?.name || 'Unknown'}</td>
                                            <td className="px-4 py-3 text-gray-400">{order.planId?.name || 'N/A'}</td>
                                            <td className="px-4 py-3 text-white font-bold">₹{order.amount}</td>

                                            <td className={`px-4 py-3 text-white `}><div className={`${getTypeColor(order.status)} text-center py-1 px-2 rounded-full`}>{order.status || 'Unknown'}</div></td>
                                            <td className="px-4 py-2">
                                                <Badge variant={order.planId?.type === 'VIEWS' ? 'success' : 'Rotating'}>
                                                    {order.planId?.type || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-2 text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-white">{order.video || 'Unknown'}</td>
                                            <td className="px-4 py-2">
                                                <select
                                                    value={order.isCompleted ? 'true' : 'false'}
                                                    onChange={(e) => handleCompleteOrder(order._id, e.target.value === 'true')}
                                                    className="bg-slate-800 text-white text-xs border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-purple-500"
                                                >
                                                    <option value="false">Pending</option>
                                                    <option value="true">Completed</option>
                                                </select>
                                            </td>



                                        </tr>

                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

        </Layout>
    );
};
