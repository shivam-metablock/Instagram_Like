import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
// import { LiveCounter } from '../components/simulation/LiveCounter';
// import { GrowthChart } from '../components/simulation/GrowthChart';
// import { ProxyTable } from '../components/simulation/ProxyTable';
import { useSimulation } from '../hooks/useSimulation';
import { postAPI, orderAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Play, AlertCircle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyPlans } from './MyPlans';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [activePlan, setActivePlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState<any>([]);

    const isAdmin = user?.role === 'ADMIN';

    // Calculate limits from active plan
    const limits = React.useMemo(() => {
        if (!activePlan) return {};
        return {
            views: activePlan.viewsCount || 0,
            likes: activePlan.likesCount || 0,
            followers: activePlan.followersCount || 0
        };
    }, [activePlan]);

    const { startSimulation } = useSimulation(0, limits);

    useEffect(() => {
        checkActivePlan();
        AllUsers();
    }, []);

    const AllUsers = async () => {
        const users = await userAPI.getAll();
        setUsers(users);
    }
    const checkActivePlan = async () => {
        try {
            const orders = await orderAPI.getAll();
            // Check if user has any VIEWS/BUNDLE plan
            const validPlan = orders.find((order: any) =>
                (order.status === 'COMPLETED' || order.status === 'APPROVED') &&
                (order.planId?.type === 'VIEWS' || order.planId?.type === 'BUNDLE')
            );

            if (validPlan) {
                setActivePlan(validPlan.planId);
            }
        } catch (error) {
            console.error('Error checking plan:', error);
        }
    };

    const handleStartBoost = async () => {
        if (!url) {
            setMessage('Please enter an Instagram Post URL');
            return;
        }

        if (!activePlan) {
            setMessage('You need to purchase a Reach Boost plan first!');
            setTimeout(() => navigate('/plans'), 2000);
            return;
        }

        setLoading(true);
        try {
            // Save post to database
            await postAPI.create({ url, title: 'Instagram Post' });
            startSimulation();
            setMessage('Boost started! (Simulation only)');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Failed to start boost');
        } finally {
            setLoading(false);
        }
    };

    // Render admin view
    if (isAdmin) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
                        <Button onClick={() => navigate('/admin')} variant="outline">
                            Go to Admin Panel
                        </Button>
                    </div>
                    <Card className="p-8 text-center border-purple-500/30 bg-purple-500/10">
                        <p className="text-gray-300 text-lg">
                            Admin users do not have access to Reach Boost simulation.
                            <br />
                            <br />
                            Please use the <strong className="text-white">Admin Panel</strong> to manage plans, proxies, and view analytics.
                        </p>
                    </Card>
                </div>
            </Layout>
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const accountLink = e.currentTarget.accountLink.value;
        const accountName = e.currentTarget.accountName.value;
        const data = await userAPI.create({ accountLink, accountName })
        if (data) {
            AllUsers()
        }
    }
    // Render user view
    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Instagram Reach Boost</h2>
                        <p className="text-gray-400">Enter your post URL and start the simulation</p>
                    </div>
                </div>

                {/* URL Input & Status */}
                <Card className="p-6">
                    <div className="space-y-4">
                        {users?.data?.AccountLink ? <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Paste Instagram Post Link..."
                                className="flex-1 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div> : <div className="flex items-center gap-2">
                            <p className="text-white">Please add your account link first</p>
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input type="text" name="accountLink" placeholder='Account Link' className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700" required />
                                <input type="text" name="accountName" placeholder='Account Name' className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700" required />
                                <Button type="submit">Add Account Link</Button>
                            </form>
                        </div>}
                        {
                            users?.data?.AccountLink && (
                                <div className="flex items-center gap-2 text-white">
                                   Selected Account <a href={users?.data?.AccountLink} target="_blank" className="text-white"> {users?.data?.AccountName}</a>
  
                                </div>
                            )
                        }

                        {!activePlan && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
                                <AlertCircle className="text-yellow-400" size={20} />
                                <div className="flex-1">
                                    <p className="text-yellow-400 font-medium">No Active Reach Plan</p>
                                    <p className="text-yellow-400/70 text-sm">Purchase a Reach Boost plan to start boosting</p>
                                </div>
                                <Button
                                    onClick={() => navigate('/plans')}
                                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500"
                                >
                                    <ShoppingCart size={16} /> Buy Plan
                                </Button>
                            </div>
                        )}

                        {message && (
                            <div className={`p - 3 rounded - lg text - sm ${message.includes('success') || message.includes('started')
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                } `}>
                                {message}
                            </div>
                        )}

                        <div className="flex gap-4">

                            {users?.data?.AccountLink && <Button
                                onClick={handleStartBoost}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                                disabled={loading}
                            >
                                <Play size={20} /> {loading ? 'Starting...' : 'Start Reach Boost'}
                            </Button>}


                        </div>
                    </div>
                </Card>

                {/* Analytics Cards */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="flex flex-col items-center justify-center py-8">
                        <div className="mb-2 p-3 bg-blue-500/10 rounded-full text-blue-400">
                            <TrendingUp size={24} />
                        </div>
                        <LiveCounter value={state.views} label="Total Reach" color="text-blue-400" />
                    </Card>
                    <Card className="flex flex-col items-center justify-center py-8">
                        <div className="mb-2 p-3 bg-pink-500/10 rounded-full text-pink-400">
                            <Heart size={24} />
                        </div>
                        <LiveCounter value={state.likes} label="Likes" color="text-pink-400" />
                    </Card>
                    <Card className="flex flex-col items-center justify-center py-8">
                        <div className="mb-2 p-3 bg-purple-500/10 rounded-full text-purple-400">
                            <Users size={24} />
                        </div>
                        <LiveCounter value={state.followers || 0} label="Followers" color="text-purple-400" />
                    </Card>
                    <Card className="flex flex-col items-center justify-center py-8">
                        <div className="mb-2 p-3 bg-green-500/10 rounded-full text-green-400">
                            <MousePointerClick size={24} />
                        </div>
                        <div className="text-4xl font-bold text-green-400">{state.ctr}%</div>
                        <span className="text-sm text-gray-400 uppercase tracking-wider mt-1">Engagement</span>
                    </Card>
                </div>

                {/* Main Simulation Panel */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <GrowthChart data={state.chartData} />
                    </div>
                    <div className="lg:col-span-1">
                        <ProxyTable />
                    </div>
                </div> */}

                {/* Disclaimer 
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                        <strong>⚠️ SIMULATION ONLY:</strong> This is a demonstration platform. No real Instagram reach is generated. All metrics are simulated for educational purposes.
                    </p>
                </div> */}
                <MyPlans />
            </div>
        </Layout>
    );
};
