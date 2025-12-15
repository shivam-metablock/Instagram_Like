# YT View Simulator

A full-stack simulation platform for YouTube view growth demonstration. Features a modern React frontend with glassmorphism UI and a Node.js/MongoDB backend.

## ⚠️ Important Disclaimer

**This is a SIMULATION ONLY platform.** It does not:
- Generate real YouTube views
- Violate YouTube Terms of Service
- Interact with the YouTube API for view manipulation

All metrics shown are simulated for demonstration and educational purposes.

## 🚀 Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)

### 1. Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

**Frontend** - Create `.env` in root:
```
VITE_API_URL=http://localhost:5000/api
```

**Backend** - Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yt-simulator
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

### 3. Seed Database (Optional)

```bash
cd server
npm run seed
```

This creates test accounts:
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📂 Project Structure

```
yt-view-simulator/
├── src/                    # Frontend source
│   ├── components/
│   │   ├── simulation/     # LiveCounter, ProxyTable, GrowthChart
│   │   └── ui/             # Card, Button, Badge, Layout
│   ├── context/            # AuthContext
│   ├── hooks/              # useSimulation
│   ├── pages/              # Landing, Dashboard, Auth, etc.
│   ├── services/           # API service layer
│   └── utils/              # Utility functions
├── server/                 # Backend source
│   └── src/
│       ├── config/         # DB connection, JWT
│       ├── controllers/    # Business logic
│       ├── middleware/     # Auth middleware
│       ├── models/         # Mongoose schemas
│       └── routes/         # Express routes
└── dist/                   # Production  build
```

## 🎯 Features

### User Features
- **Simulation Dashboard**: Real-time animated counters for views, likes, CTR
- **Proxy Network Visualization**: Fake proxy status table
- **Growth Charts**: Line charts showing simulated growth
- **Auth System**: JWT-based login/register

### Admin Features
- **Plan Management**: Create/edit/delete service plans
- **User Overview**: View registered users
- **Order Tracking**: Monitor purchases

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Videos
- `GET /api/videos` - Get user's videos (protected)
- `POST /api/videos` - Add new video (protected)
- `PUT /api/videos/:id` - Update video (protected)
- `DELETE /api/videos/:id` - Delete video (protected)

### Plans
- `GET /api/plans` - Get all plans (public)
- `POST /api/plans` - Create plan (admin only)
- `PUT /api/plans/:id` - Update plan (admin only)
- `DELETE /api/plans/:id` - Delete plan (admin only)

### Orders
- `GET /api/orders` - Get user's orders (protected)
- `POST /api/orders` - Create order (protected)

## 🛠️ Development

### Build for Production

```bash
# Frontend
npm run build

# Backend (no build needed, runs on Node.js)
cd server
npm start
```

## 📝 License

This project is for educational and demonstration purposes only.
