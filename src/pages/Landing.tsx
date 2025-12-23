import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Zap, BarChart, CheckCircle, Star, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { planAPI } from '../services/api';

interface Plan {
    _id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    type: string;
    viewsCount?: number;
    likesCount?: number;
    followersCount?: number;
}

export const Landing: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const fetchPlans = async () => {
        try {
            const data = await planAPI.getAll();

            setPlans(data);
        } catch (error) {
            console.error('Failed to fetch plans', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">IG Simulator</span>
                    </div> */}
                    <img src="/logo.png" width={150} alt="LOGO" />

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
                        <a href="#reviews" className="hover:text-blue-600 transition-colors">Reviews</a>
                        <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                    </div>

                    <div className="hidden md:flex gap-4 items-center">
                        {user ? (
                            <>
                                <Link to={user.role === 'ADMIN' ? "/admin" : "/dashboard"}>
                                    <Button variant="outline" className="flex border-gray-200 text-slate-700 hover:bg-gray-50 hover:text-slate-900">Dashboard</Button>
                                </Link>
                                <Button onClick={handleLogout} variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors hidden md:block">Log in</Link>
                                <Link to="/register">
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-6 rounded-full font-semibold">Get Started</Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed right-0 top-0 overflow-y-auto  h-full w-[280px] bg-white shadow-2xl p-6 flex flex-col animate-slide-in-right transform transition-transform duration-300 ease-in-out">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                            <img src="/logo.png" width={120} alt="LOGO" />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1">
                            {[
                                { label: 'Features', href: '#features' },
                                { label: 'How it Works', href: '#how-it-works' },
                                { label: 'Reviews', href: '#reviews' },
                                { label: 'Pricing', href: '#pricing' }
                       
                            ].map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-4 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors"
                        >
                            {item.label}
                        </a>
                            ))}
                              
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
                            {
                                    user?(
                                    <>
                                        <Link to={user.role === 'ADMIN' ? "/admin" : "/dashboard"}>
                                            <Button variant="outline" className="flex border-gray-200 text-slate-700 hover:bg-gray-50 hover:text-slate-900">Dashboard</Button>
                                        </Link>
                                        <Button onClick={handleLogout} variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none">
                                            Logout
                                        </Button>
                                    </>
                        ) : (
                        <>
                            <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors hidden md:block">Log in</Link>
                            <Link to="/register">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-6 rounded-full font-semibold">Get Started</Button>
                            </Link>
                        </>
                                )}
                    </div>
                </div>
                </div>
    )
}

{/* Hero Section */ }
<main className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-semibold mb-8 animate-fade-in-up shadow-sm">
                    <div className="flex gap-0.5 text-green-500">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <span>Rated #1 Instagram Growth Simulator</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-slate-900">
                    The Smartest Way to <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Simulate Growth</span>
                </h1>
                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                    Experience exponential Instagram growth with our AI-powered simulation engine. Visualize likes, followers, and engagement in real-time, risk-free.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to={user ? (user.role === 'ADMIN' ? "/admin" : "/dashboard") : "/login"}>
                        <Button className="text-lg px-8 py-4 h-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-full transition-all hover:scale-105 min-w-[200px]">
                            Start For Free <ArrowRight size={20} />
                        </Button>
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 px-6 py-4">
                        <CheckCircle size={18} className="text-green-500" /> Format: Web App
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden`}>
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <div className="text-sm">
                        <div className="font-bold text-slate-900">10,000+</div>
                        <div className="text-slate-500">Happy Users</div>
                    </div>
                </div>
            </div>

            {/* Hero Image/Visual */}
            <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                        </div>
                        <div className="text-xs text-slate-400 font-mono ml-2">dashboard.ig-simulator.com</div>
                    </div>
                    <div className="p-8 aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center relative overflow-hidden">
                        {/* Abstract Dashboard UI */}
                        <div className="absolute inset-0 p-8 grid grid-cols-2 gap-4 opacity-50">
                            <div className="bg-blue-50 rounded-xl h-32 w-full animate-pulse mx-auto"></div>
                            <div className="bg-purple-50 rounded-xl h-32 w-full animate-pulse mx-auto"></div>
                            <div className="col-span-2 bg-slate-50 rounded-xl h-48 w-full"></div>
                        </div>
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-4 shadow-xl shadow-blue-600/30 flex items-center justify-center text-white">
                                <Zap size={40} fill="currentColor" />
                            </div>
                            <div className="text-2xl font-bold text-slate-900 mb-2">Active Simulation</div>
                            <div className="text-blue-600 font-mono text-lg">+1,240 Followers/hr</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/10 rounded-full blur-[64px] -z-10"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-400/10 rounded-full blur-[64px] -z-10"></div>
            </div>
        </div>
    </div>
</main>

{/* Social Proof Strip */ }
<div className="py-12 border-y border-slate-100 bg-slate-50/50">
    <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Trusted by Creators from</p>
        <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50">
            {/* Placeholder text for logos since we don't have SVGs handy, usually simulated with text or icons */}
            <span className="text-xl font-bold font-serif text-slate-600">VOGUE</span>
            <span className="text-xl font-bold text-slate-600">Forbes</span>
            <span className="text-xl font-bold font-mono text-slate-600">WIRED</span>
            <span className="text-xl font-bold font-sans italic text-slate-600">TechCrunch</span>
            <span className="text-xl font-bold text-slate-600">BuzzFeed</span>
        </div>
    </div>
</div>

{/* Alternating Features Section */ }
<section id="features" className="py-24 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 space-y-32">
        {/* Feature 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 order-2 lg:order-1">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform rotate-3 scale-95 -z-10"></div>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                        {/* Mock UI */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <div className="font-bold text-slate-900">Growth Analytics</div>
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">+125%</div>
                        </div>
                        <div className="space-y-4">
                            {[85, 92, 78, 95].map((h, i) => (
                                <div key={i} className="bg-slate-50 rounded-lg p-3">
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Metric {i + 1}</span>
                                        <span>{h}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${h}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
                    <BarChart size={24} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Real-time Analytics Dashboard</h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                    Stop flying blind. Our advanced dashboard gives you deep insights into your simulated growth metrics, helping you visualize success before it happens.
                </p>
                <ul className="space-y-4">
                    {['Live Follower Count', 'Engagement Rate Tracking', 'Virality Prediction', 'Audience Demographics'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle size={14} />
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-600/20">
                    <Zap size={24} />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">AI-Powered Optimization</h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                    Our proprietary AI algorithms analyze millions of data points to simulate the most realistic organic growth patterns for your niche.
                </p>
                <Button variant="outline" className="border-slate-200 hover:border-indigo-600 hover:text-indigo-600">
                    Explore Technology
                </Button>
            </div>
            <div className="flex-1">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tl from-indigo-100 to-blue-100 rounded-3xl transform -rotate-3 scale-95 -z-10"></div>
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex items-center justify-center min-h-[300px]">
                        <div className="text-center">
                            <div className="inline-block p-4 rounded-full bg-indigo-50 text-indigo-600 mb-4 animate-bounce">
                                <Zap size={32} fill="currentColor" />
                            </div>
                            <div className="font-bold text-xl text-slate-900">AI Optimization Active</div>
                            <div className="text-slate-500">Processing simulation patterns...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{/* How It Works Section */ }
<section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wide">Simple Process</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">How It Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Start your growth journey in 3 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 border-t border-dashed border-slate-300 z-0"></div>

            {[
                { step: "1", title: "Connect Account", desc: "Simply create your account. No password required." },
                { step: "2", title: "Select Plan", desc: "Choose the growth speed that matches your goals." },
                { step: "3", title: "Watch Growth", desc: "See real-time results in your dashboard." }
            ].map((item, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                    <div className="w-24 h-24 bg-white rounded-2xl shadow-xl shadow-blue-900/5 flex items-center justify-center text-2xl font-bold mb-8 border border-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                        <span className="text-blue-600">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                </div>
            ))}
        </div>
    </div>
</section>

{/* Reviews (Revices) Section */ }
<section id="reviews" className="py-24 bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
                <div className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">Testimonials</div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Rated Excellent by Creators</h2>
                <p className="text-slate-500 text-lg">Join 10,000+ creators who trust IG Simulator.</p>
            </div>
            <div className="flex flex-col items-start md:items-end">
                <div className="flex text-yellow-400 mb-2">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
                </div>
                <div className="font-bold text-slate-900">4.9/5 Average Rating</div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { name: "Jessica M.", role: "Fashion Blogger", text: "The growth simulation is incredibly realistic. It helps me pitch to brands by showing projected reach.", date: "2 days ago" },
                { name: "David K.", role: "Digital Marketer", text: "I've tried many tools, but this is the safest way to visualize growth strategies without risking my account.", date: "1 week ago" },
                { name: "Sarah L.", role: "Influencer", text: "Absolutely love the dashboard. Simple, clean, and the results are instant. Highly recommended!", date: "3 weeks ago" },
                { name: "Ryan P.", role: "Content Creator", text: "Game changer for my content planning. Seeing the numbers go up is so motivating.", date: "1 month ago" },
                { name: "Emily W.", role: "Small Business", text: "We use this to train our social media team on engagement metrics. Fantastic tool.", date: "1 month ago" },
                { name: "Michael B.", role: "Agency Owner", text: "The API integration is smooth and the reporting features are exactly what we needed.", date: "2 months ago" }
            ].map((review, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold">
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{review.name}</div>
                                <div className="text-xs text-slate-500">{review.role}</div>
                            </div>
                        </div>
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                    </div>
                    <p className="text-slate-600 mb-6 leading-relaxed">"{review.text}"</p>
                    <div className="text-xs text-slate-400 border-t border-gray-50 pt-4 flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-500" /> Verified User • {review.date}
                    </div>
                </div>
            ))}
        </div>
    </div>
</section>

{/* Pricing Section */ }
<section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <div className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2">Pricing</div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Choose the perfect plan for your simulation needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {loading ? (
                <div className="col-span-3 text-center text-slate-500">Loading plans...</div>
            ) : plans.length > 0 ? (
                plans.map((plan, idx) => {
                    const isPopular = idx === 1; // Assuming 2nd plan is popular
                    return (
                        <div key={plan._id} className={`relative p-8 rounded-3xl flex flex-col transition-transform duration-300 ${isPopular ? 'bg-white border-2 border-blue-600 shadow-2xl scale-105 z-10' : 'bg-white border border-gray-200 shadow-lg hover:-translate-y-2'}`}>
                            {isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-600/30">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2 text-slate-900">{plan.name}</h3>
                                <p className="text-slate-500 text-sm h-10">{plan.description || "Perfect for getting started."}</p>
                            </div>

                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-bold text-slate-900 tracking-tight">₹{plan.price}</span>
                                <span className="text-slate-500 ml-2 font-medium">/total</span>
                            </div>

                            <div className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <CheckCircle size={12} fill="currentColor" className="text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium">{feat}</span>
                                    </div>
                                ))}
                                {/* Add static filler features if generic to make list look fuller */}
                                {plan.features.length < 4 && (
                                    <>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><CheckCircle size={12} fill="currentColor" /></div>
                                            <span className="text-sm font-medium">24/7 Support</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><CheckCircle size={12} fill="currentColor" /></div>
                                            <span className="text-sm font-medium">Instant Start</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <Link to="/register" className="mt-auto">
                                <Button className={`w-full py-6 text-lg rounded-xl font-bold transition-all ${isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30' : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'}`}>
                                    Choose {plan.name}
                                </Button>
                            </Link>
                        </div>
                    );
                })
            ) : (
                <div className="col-span-3 text-center text-slate-500">No plans available at the moment.</div>
            )}
        </div>
    </div>
</section>

{/* FAQ Section */ }
<section className="py-24 bg-white">
    <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
            {[
                { q: "Is this real Instagram traffic?", a: "No. This is strictly a simulation tool for educational and visualization purposes. No real views/likes are generated on Instagram." },
                { q: "Do I need to give my Instagram password?", a: "Never. We do not require any access to your Instagram account since this is a simulation. We only need your username to fetch public profile data for the simulation context." },
                { q: "Can I cancel my subscription?", a: "Yes, you can cancel your simulation plan at any time from your dashboard." },
                { q: "How fast is the delivery?", a: "Simulation starts instantly after payment approval. You can control the speed of the simulation from your dashboard settings." }
            ].map((faq, idx) => (
                <div key={idx} className="group border border-gray-200 rounded-2xl hover:border-blue-500 transition-colors overflow-hidden">
                    <details className="p-6 cursor-pointer">
                        <summary className="font-bold text-lg text-slate-900 list-none flex justify-between items-center">
                            {faq.q}
                            <span className="text-blue-500 group-open:rotate-180 transition-transform">
                                <ArrowRight className="rotate-90" size={20} />
                            </span>
                        </summary>
                        <div className="pt-4 text-slate-600 leading-relaxed border-t border-gray-100 mt-4">
                            {faq.a}
                        </div>
                    </details>
                </div>
            ))}
        </div>
    </div>
</section>

{/* CTA Section */ }
<section className="py-20 bg-slate-50">
    <div className="max-w-5xl mx-auto px-6">
        <div className="bg-blue-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to Boost Your Presence?</h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
                    Join 10,000+ creators and start your Instagram growth simulation today.
                </p>
                <Link to="/register">
                    <Button className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 font-bold shadow-lg rounded-full">
                        Get Started Now <ArrowRight className="ml-2 inline" size={20} />
                    </Button>
                </Link>
                <p className="mt-6 text-sm text-blue-200">No credit card required for free trial.</p>
            </div>
        </div>
    </div>
</section>

{/* Footer */ }
<footer className="bg-white border-t border-gray-100 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                        <Zap size={18} fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold text-slate-900">IG Simulator</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    The world's #1 Instagram growth simulation platform. Safe, secure, and instant visual results for creators and agencies.
                </p>
                <div className="flex gap-4">
                    {/* Social Icons Placeholder */}
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"><Star size={14} /></div>
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"><Zap size={14} /></div>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Success Stories</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-blue-600 transition-colors">Refund Policy</a></li>
                </ul>
            </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
                © 2024 IG Simulator. All rights reserved.
            </p>
            <p className="text-slate-400 text-xs max-w-md text-center md:text-right">
                DISCLAIMER: This website is a simulation platform for educational purposes only.
                We do not sell real Instagram views or engagement. Not affiliated with Instagram/Meta.
            </p>
        </div>
    </div>
</footer>
        </div >
    );
};
