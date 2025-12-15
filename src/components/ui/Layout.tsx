import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Settings, Menu, User, LogOut, LogIn, Plus, Users, List } from 'lucide-react';
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
        // Regular USER gets: Dashboard, My Posts, My Plans, Buy Plans, Settings
        ...(user?.role !== 'ADMIN' ? [{ icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }] : []),
        // ...(user?.role !== 'ADMIN' ? [{ icon: Video, label: 'My Posts', path: '/posts' }] : []),
        // ...(user?.role !== 'ADMIN' ? [{ icon: Package, label: 'My Plans', path: '/my-plans' }] : []),
        ...(user?.role !== 'ADMIN' ? [{ icon: ShoppingBag, label: 'Buy Plans', path: '/plans' }] : []),

        // ADMIN gets: Dashboard (top), Proxy List, Create Plans, Manage Users, Settings
        ...(user?.role === 'ADMIN' ? [{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: List, label: 'Proxy List', path: '/proxies' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: Plus, label: 'Create Plans', path: '/admin/create-plans' }] : []),
        ...(user?.role === 'ADMIN' ? [{ icon: Users, label: 'Manage Users', path: '/admin/users' }] : []),

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
                "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform lg:translate-x-0 lg:static",
                !sidebarOpen ? "-translate-x-full lg:w-20" : "translate-x-0"
            )}>
                <div className="h-16 flex items-center justify-center border-b border-white/10">
                    <h1 className={cn("font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transition-opacity duration-300", !sidebarOpen && "lg:hidden")}>
                        IG Simulator
                    </h1>
                    <span className={cn("text-xl font-bold text-blue-500 absolute transition-opacity duration-300", sidebarOpen ? "opacity-0" : "opacity-100 hidden lg:block")}>IG</span>
                </div>

                <nav className="p-4 space-y-2">
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
                            <div className="flex items-center gap-2">
                                <div className="text-right mr-2">
                                    <div className="text-sm font-medium text-white">{user.name}</div>
                                    <div className="text-xs text-gray-400">{user.role}</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                                    <User size={16} className="text-white" />
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
