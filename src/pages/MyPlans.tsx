import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
// import { Badge } from '../components/ui/Badge';
import { orderAPI } from '../services/api';
import { ShoppingBag, TrendingUp, Calendar, Instagram, Facebook, Send, Youtube, InstagramIcon, YoutubeIcon, FacebookIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Order {
    _id: string;
    planId: {
        _id: string;
        name: string;
        type: string;
        price: number;
        platform?: string;
        viewsCount?: number;
        likesCount?: number;
        followersCount?: number;
        features: string[];
    };
    amount: number;
    status: string;
    createdAt: string;
}

type PlatformType = 'ALL' | 'INSTAGRAM' | 'FACEBOOK' | 'TELEGRAM' | 'YOUTUBE';

export const MyPlans: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('ALL');
    const location = useLocation().pathname;
    useEffect(() => {
        fetchMyOrders();
    }, [location]);

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

    // Filter orders by platform
    const filteredOrders = selectedPlatform === 'ALL'
        ? orders
        : orders.filter(order => order.planId?.platform === selectedPlatform);

    const totalSpent = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

    // Get platform icon and color
    // const getPlatformDetails = (platform?: string) => {
    //     switch (platform) {
    //         case 'INSTAGRAM':
    //             return { icon: Instagram, color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/30' };
    //         case 'FACEBOOK':
    //             return { icon: Facebook, color: 'text-blue-500', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
    //         case 'TELEGRAM':
    //             return { icon: Send, color: 'text-sky-400', bgColor: 'bg-sky-500/20', borderColor: 'border-sky-500/30' };
    //         case 'YOUTUBE':
    //             return { icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
    //         default:
    //             return { icon: ShoppingBag, color: 'text-gray-400', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30' };
    //     }
    // };

    // Count plans per platform
    const platformCounts = {
        ALL: orders.length,
        INSTAGRAM: orders.filter(o => o.planId?.platform === 'INSTAGRAM').length,
        FACEBOOK: orders.filter(o => o.planId?.platform === 'FACEBOOK').length,
        TELEGRAM: orders.filter(o => o.planId?.platform === 'TELEGRAM').length,
        YOUTUBE: orders.filter(o => o.planId?.platform === 'YOUTUBE').length,
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar - Platform Filter */}

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white">My Plans</h2>
                            <p className="text-gray-400 mt-1">
                                {selectedPlatform === 'ALL'
                                    ? 'View all your purchased plans'
                                    : `Showing ${selectedPlatform.toLowerCase()} plans`}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{filteredOrders.length}</div>
                                <div className="text-sm text-gray-400">Plans</div>
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
                                        <div className="text-sm text-gray-400">Plans Purchased</div>
                                        <div className="text-2xl font-bold text-white">{filteredOrders.length}</div>
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
                                        <div className="text-2xl font-bold text-green-400">₹{totalSpent.toFixed(2)}</div>
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
                                            {filteredOrders.filter(o => o.status === 'COMPLETED').length}
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
                    ) : filteredOrders.length === 0 ? (
                        <Card className="p-12 text-center">
                            <ShoppingBag className="mx-auto text-gray-600 mb-4" size={64} />
                            <h3 className="text-xl font-bold text-white mb-2">
                                {selectedPlatform === 'ALL' ? 'No Plans Yet' : `No ${selectedPlatform} Plans`}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                {selectedPlatform === 'ALL'
                                    ? "You haven't purchased any plans yet"
                                    : `You haven't purchased any ${selectedPlatform.toLowerCase()} plans yet`}
                            </p>
                            <a
                                href="/plans"
                                className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
                            >
                                Browse Plans
                            </a>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {/* {filteredOrders.map((order) => {
                                const platformDetails = getPlatformDetails(order.planId?.platform);
                                const PlatformIcon = platformDetails.icon;

                                return (
                                    <Card key={order._id}>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h3 className="text-xl font-bold text-white">{order.planId.name}</h3>
                                                        <Badge variant={order.status === 'COMPLETED' ? 'success' : 'warning'}>
                                                            {order.status}
                                                        </Badge>
                                                        <Badge variant={order.planId.type === 'VIEWS' ? 'success' : 'default'}>
                                                            {order.planId.type}
                                                        </Badge>
                                                       
                                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${platformDetails.bgColor} ${platformDetails.borderColor}`}>
                                                            <PlatformIcon size={14} className={platformDetails.color} />
                                                            <span className={`text-xs font-medium ${platformDetails.color}`}>
                                                                {order.planId?.platform || 'INSTAGRAM'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-400">
                                                        Purchased on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-2xl font-bold text-green-400">₹{order.amount}</div>
                                                    <div className="text-xs text-gray-400">Order #{order._id.slice(-8)}</div>
                                                </div>
                                            </div>

                                          
                                            {(order.planId.viewsCount || order.planId.likesCount || order.planId.followersCount) && (
                                                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {order.planId.viewsCount && (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-400">Reach</span>
                                                                <span className="text-lg font-bold text-blue-400">
                                                                    {order.planId.viewsCount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.planId.likesCount && (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-400">Likes</span>
                                                                <span className="text-lg font-bold text-pink-400">
                                                                    {order.planId.likesCount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {order.planId.followersCount && (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm text-gray-400">Followers</span>
                                                                <span className="text-lg font-bold text-purple-400">
                                                                    {order.planId.followersCount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                          
                                            {order.planId.features && order.planId.features.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Features:</h4>
                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {order.planId.features.map((feature, idx) => (
                                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                                <span className="text-green-400">✓</span>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })} */}
                        </div>
                    )}
                </div>


            </div>
            {/* Filter Card */}
            <Card className="sticky top-4">
                <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-4">Filter by Platform</h3>
                    <div className="space-y-2">
                        {/* All Platforms */}
                        <button
                            onClick={() => setSelectedPlatform('ALL')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedPlatform === 'ALL'
                                ? 'bg-purple-500/20 border border-purple-500/40 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <ShoppingBag size={20} />
                            <span className="flex-1 text-left font-medium">All Platforms</span>
                            <span className="text-sm">{platformCounts.ALL}</span>
                        </button>

                        {/* Instagram */}
                        <button
                            onClick={() => setSelectedPlatform('INSTAGRAM')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedPlatform === 'INSTAGRAM'
                                ? 'bg-pink-500/20 border border-pink-500/40 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Instagram size={20} className={selectedPlatform === 'INSTAGRAM' ? 'text-pink-400' : ''} />
                            <span className="flex-1 text-left font-medium">Instagram</span>
                            <span className="text-sm">{platformCounts.INSTAGRAM}</span>
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => setSelectedPlatform('FACEBOOK')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedPlatform === 'FACEBOOK'
                                ? 'bg-blue-500/20 border border-blue-500/40 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Facebook size={20} className={selectedPlatform === 'FACEBOOK' ? 'text-blue-500' : ''} />
                            <span className="flex-1 text-left font-medium">Facebook</span>
                            <span className="text-sm">{platformCounts.FACEBOOK}</span>
                        </button>

                        {/* Telegram */}
                        <button
                            onClick={() => setSelectedPlatform('TELEGRAM')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedPlatform === 'TELEGRAM'
                                ? 'bg-sky-500/20 border border-sky-500/40 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Send size={20} className={selectedPlatform === 'TELEGRAM' ? 'text-sky-400' : ''} />
                            <span className="flex-1 text-left font-medium">Telegram</span>
                            <span className="text-sm">{platformCounts.TELEGRAM}</span>
                        </button>

                        {/* YouTube */}
                        <button
                            onClick={() => setSelectedPlatform('YOUTUBE')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${selectedPlatform === 'YOUTUBE'
                                ? 'bg-red-500/20 border border-red-500/40 text-white'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Youtube size={20} className={selectedPlatform === 'YOUTUBE' ? 'text-red-500' : ''} />
                            <span className="flex-1 text-left font-medium">YouTube</span>
                            <span className="text-sm">{platformCounts.YOUTUBE}</span>
                        </button>
                    </div>
                </div>
            </Card>
            {/* Buy Plans Card */}
            <Card className="sticky top-4  mt-4">
                <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-4">Buy Plans</h3>
                    <div className="space-y-2">
                        <Link
                            to="/plans?platform=INSTAGRAM"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border border-pink-500/40"
                        >
                            <InstagramIcon size={18} />
                            <span className="flex-1 text-left font-medium text-sm">Buy Instagram Plans</span>
                        </Link>

                        <Link
                            to="/plans?platform=FACEBOOK"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500/40"
                        >
                            <FacebookIcon size={18} />
                            <span className="flex-1 text-left font-medium text-sm">Buy Facebook Plans</span>
                        </Link>

                        <Link
                            to="/plans?platform=TELEGRAM"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white border border-sky-500/40"
                        >
                            <Send size={18} />
                            <span className="flex-1 text-left font-medium text-sm">Buy Telegram Plans</span>
                        </Link>


                        <Link
                            to="/plans?platform=YOUTUBE"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-500/40"
                        >
                            <YoutubeIcon size={18} />
                            <span className="flex-1 text-left font-medium text-sm">Buy YouTube Plans</span>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};
