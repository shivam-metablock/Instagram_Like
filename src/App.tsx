import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { ProxyList } from './pages/ProxyList';
import { Plans } from './pages/Plans';
import { MyPosts } from './pages/MyPosts';
import { Settings } from './pages/Settings';
import { Login, Register } from './pages/Auth';
import { AdminLogin } from './pages/AdminLogin';
import { CreatePlans } from './pages/CreatePlans';
import { ManageUsers } from './pages/ManageUsers'; // Added import for ManageUsers
// import { MyPlans } from './pages/MyPlans';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UsersVideo } from './pages/SeeUserView';
import { Orders } from './pages/Orders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
          <Route path="/proxies" element={<ProtectedRoute><ProxyList /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
          {/* <Route path="/my-plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} /> */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Admin Only Route */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
          <Route path="/admin/create-plans" element={<ProtectedRoute requireAdmin={true}><CreatePlans /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin={true}><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/videos" element={<ProtectedRoute requireAdmin={true}><UsersVideo /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requireAdmin={true}><Orders /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
