import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { orderAPI } from '../services/api';
import { ShoppingBag, TrendingUp, Calendar } from 'lucide-react';

interface Order {
    _id: string;
    planId: {
        _id: string;
        name: string;
        type: string;
        price: number;
        viewsCount?: number;
        features: string[];
    };
    amount: number;
    status: string;
    createdAt: string;
}

export const MyPlans: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const data = await orderAPI.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);

    return (
         <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">My Plans</h2>
                        <p className="text-gray-400 mt-1">View all your purchased plans and usage</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">{orders.length}</div>
                            <div className="text-sm text-gray-400">Total Plans</div>
                        </div>
                        <ShoppingBag className="text-blue-400" size={48} />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Total Plans Purchased</div>
                                    <div className="text-2xl font-bold text-white">{orders.length}</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-green-500/10 border-green-500/20">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Total Spent</div>
                                    <div className="text-2xl font-bold text-green-400">${totalSpent.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-purple-500/10 border-purple-500/20">
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Active Plans</div>
                                    <div className="text-2xl font-bold text-white">
                                        {orders.filter(o => o.status === 'COMPLETED').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Plans List */}
                {loading ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-400">Loading your plans...</p>
                    </Card>
                ) : orders.length === 0 ? (
                    <Card className="p-12 text-center">
                        <ShoppingBag className="mx-auto text-gray-600 mb-4" size={64} />
                        <h3 className="text-xl font-bold text-white mb-2">No Plans Yet</h3>
                        <p className="text-gray-400 mb-4">You haven't purchased any plans yet</p>
                        <a
                            href="/plans"
                            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
                        >
                            Browse Plans
                        </a>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order._id}>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white">{order.planId.name}</h3>
                                                <Badge variant={order.status === 'COMPLETED' ? 'success' : 'warning'}>
                                                    {order.status}
                                                </Badge>
                                                <Badge variant={order.planId.type === 'VIEWS' ? 'success' : 'default'}>
                                                    {order.planId.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                Purchased on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-400">${order.amount}</div>
                                            <div className="text-xs text-gray-400">Order #{order._id.slice(-8)}</div>
                                        </div>
                                    </div>

                                    {/* Plan Details */}
                                    {order.planId.type === 'VIEWS' && order.planId.viewsCount && (
                                        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">Views Included</span>
                                                <span className="text-lg font-bold text-blue-400">
                                                    {order.planId.viewsCount.toLocaleString()} views
                                                </span>
                                            </div>
                                            {/* Usage Bar - Placeholder for now */}
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                    <span>Usage</span>
                                                    <span>0% used</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">Features:</h4>
                                        <ul className="grid grid-cols-2 gap-2">
                                            {order.planId.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                    <span className="text-green-400">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
    );
};
