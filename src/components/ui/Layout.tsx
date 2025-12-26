import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, Settings, Menu, User, LogOut, LogIn, Plus, Users, List, Instagram, Facebook, Send, Youtube, LucideCopySlash, ListOrderedIcon, HelpingHandIcon, Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    // Initialize based on screen width
    const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 1024);

    // Conditional navigation items
    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        // Regular USER gets: Dashboard, My Posts, My Plans, Buy Plans, Settings
        ...(user?.role !== 'ADMIN' ? [{ icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }] : []),
        // ...(user?.role !== 'ADMIN' ? [{ icon: Video, label: 'My Posts', path: '/posts' }] : []),
        // ...(user?.role !== 'ADMIN' ? [{ icon: Package, label: 'My Plans', path: '/my-plans' }] : []),
        // ...(user?.role !== 'ADMIN' ? [{ icon: ShoppingBag, label: 'Buy Plans', path: '/plans' }] : []),
        ...(user?.role !== 'ADMIN' ? [{ icon: Wallet, label: 'Add Funds', path: '/wallet' }] : []),

        // ADMIN gets: Dashboard (top), Proxy List, Create Plans, Manage Users, Settings
        ...(user?.role === 'ADMIN' ? [{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: List, label: 'Proxy List', path: '/proxies' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: Plus, label: 'Create Plans', path: '/admin/create-plans' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: Users, label: 'Manage Users', path: '/admin/users' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: LucideCopySlash, label: 'Products', path: '/admin/videos' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: ListOrderedIcon, label: 'Orders', path: '/admin/orders' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: Wallet, label: 'Wallet Requests', path: '/admin/wallet-requests' }] : []),

        // Everyone gets Settings
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform lg:translate-x-0 lg:static flex flex-col",
                !sidebarOpen ? "-translate-x-full lg:w-20" : "translate-x-0"
            )}>
                <div className="h-16 flex items-center justify-center border-b border-white/10">
                    <img src="/logo.png" className='hidden lg:block' onClick={() => navigate('/')} width={150} alt="LOGO" />

                    <span className={cn("text-xl font-bold text-blue-500 absolute transition-opacity duration-300", sidebarOpen ? "opacity-0" : "opacity-100 hidden lg:block")}>IG</span>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                location.pathname === item.path
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon size={20} className="min-w-[20px]" />
                            <span className={cn("whitespace-nowrap transition-all duration-300", !sidebarOpen && "lg:opacity-0 lg:w-0 lg:hidden")}>{item.label}</span>
                            {/* Tooltip for collapsed mode */}
                            {!sidebarOpen && (
                                <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity lg:block hidden z-50 whitespace-nowrap border border-white/10">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    ))}
                    {
                        user?.role !== 'ADMIN' && (
                            <div className='mx-5'>
                                <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors flex gap-4">
                                    <HelpingHandIcon size={20} className="min-w-[20px]" /> Get Help
                                </a>
                            </div>
                        )
                    }
                    {/* Platform Buy Plans - Only for regular users */}
                    {user?.role !== 'ADMIN' && (
                        <>
                            <div className={cn("border-t border-white/10 my-2", !sidebarOpen && "lg:hidden")} />
                            <div className={cn("text-xs text-gray-500 uppercase px-4 py-2", !sidebarOpen && "lg:hidden")}>Buy Plans</div>

                            {/* Instagram */}
                            <Link
                                to="/plans?platform=INSTAGRAM"
                                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group bg-gradient-to-r from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 text-pink-400 border border-pink-500/20"
                            >
                                <Instagram size={20} className="min-w-[20px]" />
                                <span className={cn("whitespace-nowrap transition-all duration-300", !sidebarOpen && "lg:opacity-0 lg:w-0 lg:hidden")}>Instagram</span>
                                {!sidebarOpen && (
                                    <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity lg:block hidden z-50 whitespace-nowrap border border-white/10">
                                        Buy Instagram Plans
                                    </div>
                                )}
                            </Link>

                            {/* Facebook */}
                            <Link
                                to="/plans?platform=FACEBOOK"
                                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 text-blue-400 border border-blue-500/20"
                            >
                                <Facebook size={20} className="min-w-[20px]" />
                                <span className={cn("whitespace-nowrap transition-all duration-300", !sidebarOpen && "lg:opacity-0 lg:w-0 lg:hidden")}>Facebook</span>
                                {!sidebarOpen && (
                                    <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity lg:block hidden z-50 whitespace-nowrap border border-white/10">
                                        Buy Facebook Plans
                                    </div>
                                )}
                            </Link>

                            {/* Telegram */}
                            <Link
                                to="/plans?platform=TELEGRAM"
                                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group bg-gradient-to-r from-sky-600/20 to-cyan-600/20 hover:from-sky-600/30 hover:to-cyan-600/30 text-sky-400 border border-sky-500/20"
                            >
                                <Send size={20} className="min-w-[20px]" />
                                <span className={cn("whitespace-nowrap transition-all duration-300")}>Telegram</span>

                            </Link>

                            {/* YouTube */}
                            <Link
                                to="/plans?platform=YOUTUBE"
                                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 text-red-400 border border-red-500/20"
                            >
                                <Youtube size={20} className="min-w-[20px]" />
                                <span className={cn("whitespace-nowrap transition-all duration-300", !sidebarOpen && "lg:opacity-0 lg:w-0 lg:hidden")}>YouTube</span>
                                {!sidebarOpen && (
                                    <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity lg:block hidden z-50 whitespace-nowrap border border-white/10">
                                        Buy YouTube Plans
                                    </div>
                                )}
                            </Link>
                        </>
                    )}

                    <div className="border-t border-white/10 my-2" />

                    {/* Logout/Login Button */}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full group overflow-hidden"
                        >
                            <LogOut size={20} className="min-w-[20px]" />
                            <span className={cn("whitespace-nowrap transition-all duration-300", !sidebarOpen && "lg:opacity-0 lg:w-0 lg:hidden")}>Logout</span>
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-400 hover:bg-green-500/10 hover:text-green-300 transition-all overflow-hidden"
                        >
                            <LogIn size={20} className="min-w-[20px]" />
                            <span className={cn("whitespace-nowrap transition-all duration-300", !sidebarOpen && "lg:opacity-0 lg:w-0 lg:hidden")}>Login</span>
                        </Link>
                    )}

                    <div className={cn("mt-auto p-4 border-t border-white/10 flex items-center gap-4", !sidebarOpen && "flex-col")}>

                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                            <Instagram size={25} className="min-w-[20px]" />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                            <Facebook size={25} className="min-w-[20px]" />
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                            <Youtube size={25} className="min-w-[20px]" />
                        </a>
                        <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                            <Send size={25} className="min-w-[20px]" />
                        </a>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white lg:hidden">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        {user && (
                            <div className="flex items-center gap-4">
                                {user.role !== 'ADMIN' && (
                                    <Link to="/wallet" className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-all">
                                        <Wallet size={16} className="text-purple-400" />
                                        <span className="text-purple-400 font-bold">₹{user.walletBalance || 0}</span>
                                    </Link>
                                )}
                                <div className="flex items-center gap-2">
                                    <div className="text-right mr-2">
                                        <div className="text-sm font-medium text-white">{user.name}</div>
                                        <div className="text-xs text-gray-400">{user.role}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                                        <User size={16} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {!user && (
                            <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm transition-colors">
                                Login
                            </Link>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>

                <footer className="p-4 text-center text-xs text-gray-500 border-t border-white/5">
                    DISCLAIMER: This platform is a simulation. No real Instagram reach/engagement is generated.
                </footer>
            </div>
        </div>
    );
};
