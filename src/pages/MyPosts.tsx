import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { postAPI, orderAPI } from '../services/api';
import { Trash2, ExternalLink, TrendingUp, Heart, Users } from 'lucide-react';

interface Post {
    _id: string;
    url: string;
    title: string;
    simulatedViews: number;
    simulatedLikes: number;
    simulatedFollowers?: number;
    engagementRate?: number;
    proxiesUsed: number;
    createdAt: string;
}

export const MyPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [postsData, ordersData] = await Promise.all([
                postAPI.getAll(),
                orderAPI.getAll()
            ]);
            setPosts(postsData);
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this post?')) {
            try {
                await postAPI.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">My Posts</h2>
                        <p className="text-gray-400 mt-1">Track all your simulated post metrics</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Total Posts</div>
                        <div className="text-2xl font-bold text-white">{posts.length}</div>
                    </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-blue-500/10 border-blue-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{orders.length}</div>
                                <div className="text-sm text-gray-400">Active Plans</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-purple-500/10 border-purple-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {formatNumber(posts.reduce((sum, v) => sum + (v.simulatedViews || 0), 0))}
                                </div>
                                <div className="text-sm text-gray-400">Total Simulated Reach</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-pink-500/10 border-pink-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                                <Heart size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {formatNumber(posts.reduce((sum, v) => sum + (v.simulatedLikes || 0), 0))}
                                </div>
                                <div className="text-sm text-gray-400">Total Simulated Likes</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Posts List */}
                <Card>
                    <h3 className="text-xl font-bold text-white mb-6">Post History</h3>

                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">No posts yet</div>
                            <p className="text-sm text-gray-500">Go to Dashboard to start simulating reach</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div key={post._id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-white font-medium truncate">{post.title || 'Instagram Post'}</h4>
                                                <a
                                                    href={post.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>
                                            <p className="text-sm text-gray-400 truncate mb-3">{post.url}</p>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500">Reach</div>
                                                    <div className="text-white font-medium">{formatNumber(post.simulatedViews || 0)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Likes</div>
                                                    <div className="text-white font-medium">{formatNumber(post.simulatedLikes || 0)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Engagement</div>
                                                    <div className="text-white font-medium">{(post.engagementRate || 0).toFixed(1)}%</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Followers</div>
                                                    <div className="text-white font-medium">{post.simulatedFollowers || 0}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 items-end">
                                            <Badge variant="success">Completed</Badge>
                                            <div className="text-xs text-gray-500">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className="text-red-400 hover:text-red-300 mt-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Recent Orders */}
                {orders.length > 0 && (
                    <Card>
                        <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
                        <div className="space-y-3">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div>
                                        <div className="text-white font-medium">{order.planId?.name || 'Plan'}</div>
                                        <div className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-bold">${order.amount}</div>
                                        <Badge variant={order.status === 'COMPLETED' || order.status === 'APPROVED' ? 'success' : 'warning'}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    );
};
