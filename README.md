# Delivery Route Planner

A full-stack delivery management web application built for IFN636 Assessment 1.2. The system supports three user roles (Customer, Driver, Dispatcher) with role-based access control, delivery CRUD operations, route management with map visualization, and automated CI/CD deployment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 4.17, MongoDB (Mongoose 6) |
| Frontend | React 18.2, React Router 6, Tailwind CSS 3.4 |
| Map | Leaflet + react-leaflet (OpenStreetMap) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Testing | Mocha, Chai, chai-http, Sinon |
| CI/CD | GitHub Actions, AWS EC2, PM2 |

## Project Structure

```
├── backend/
│   ├── server.js                  # Express entry point (port 5001)
│   ├── config/db.js               # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema (name, email, password, role, phone)
│   │   ├── Delivery.js            # Delivery schema (receiver, address, status, customer/driver refs)
│   │   └── Route.js               # Route schema (routeId, stops, status, transportType)
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile CRUD
│   │   ├── deliveryController.js  # Delivery CRUD (role-based)
│   │   └── routeController.js     # Route CRUD (role-based)
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protect + role authorise middleware
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── deliveryRoutes.js      # /api/deliveries/*
│   │   └── routeRoutes.js         # /api/routes/*
│   └── test/
│       ├── auth.test.js           # Auth & role tests (9 tests)
│       ├── delivery.test.js       # Delivery CRUD tests (14 tests)
│       └── route.test.js          # Route CRUD tests (15 tests)
├── frontend/
│   ├── src/
│   │   ├── App.js                 # Router with role-based protected routes
│   │   ├── axiosConfig.jsx        # Centralized API config
│   │   ├── context/AuthContext.js  # Auth state management
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx # Sidebar + header layout (responsive)
│   │   │   ├── MapView.jsx         # Leaflet map with stop markers
│   │   │   ├── LoadingSpinner.jsx  # Reusable loading component
│   │   │   └── ProtectedRoute.jsx  # Role-based route guard
│   │   └── pages/
│   │       ├── Login.jsx / Register.jsx
│   │       ├── Dashboard.jsx       # Role dispatcher → per-role dashboard
│   │       ├── CustomerDashboard.jsx
│   │       ├── DispatcherDashboard.jsx
│   │       ├── DriverDashboard.jsx
│   │       ├── Profile.jsx
│   │       ├── CreateDelivery.jsx / DeliveryList.jsx / DeliveryDetail.jsx
│   │       └── CreateRoute.jsx / RouteList.jsx / RouteDetail.jsx
│   └── tailwind.config.js         # Custom dark theme palette
└── .github/workflows/ci.yml       # CI/CD pipeline
```

## User Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Create delivery requests, view own deliveries, edit pending deliveries |
| **Driver** | View assigned deliveries/routes, mark stops as complete, track progress |
| **Dispatcher** | View all deliveries/routes, assign drivers, update status, create/delete routes, regenerate routes |

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register with name, email, password, role, phone |
| POST | `/login` | Public | Login, returns JWT token |
| GET | `/profile` | Protected | Get user profile |
| PUT | `/profile` | Protected | Update user profile |

### Deliveries (`/api/deliveries`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Customer | Create delivery request |
| GET | `/` | Protected | List deliveries (filtered by role) |
| GET | `/:id` | Protected | Get delivery details (ownership check) |
| PUT | `/:id` | Customer, Dispatcher | Update delivery (role-based fields) |
| DELETE | `/:id` | Dispatcher | Delete delivery |

### Routes (`/api/routes`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Dispatcher | Create route with stops |
| GET | `/` | Dispatcher, Driver | List routes (filtered by role) |
| GET | `/:id` | Dispatcher, Driver | Get route details |
| PUT | `/:id` | Dispatcher, Driver | Update route / mark stops complete |
| DELETE | `/:id` | Dispatcher | Delete route |

## Setup

### Prerequisites
- Node.js 18+
- MongoDB instance
- npm

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, PORT
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env with your REACT_APP_API_BASE_URL
npm install
npm start
```

### Run Tests
```bash
cd backend
npm test
# 38 tests (auth: 9, delivery: 14, route: 15)
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to main:

1. **Backend job** - Install dependencies, run 38 Mocha tests
2. **Frontend job** - Install dependencies, build React app
3. **Deploy job** (push to main only) - Sync to EC2, install deps, build, restart PM2 services

## Branching Strategy

Development followed a feature-branch workflow:

- `feature/role-auth` - Phase 1: Role-based authentication
- `feature/delivery-crud` - Phase 2: Delivery CRUD + dark dashboard UI
- `feature/route-management` - Phase 3: Route CRUD + Leaflet map
- `feature/dashboards` - Phase 4: Role-based dashboards
- `feature/responsive-ui` - Phase 5: Responsive layout + polish
- `feature/devops` - Phase 6: Documentation

Each feature branch was merged into `main` via pull request.

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PORT=5001
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_BASE_URL=http://localhost:5001
```
