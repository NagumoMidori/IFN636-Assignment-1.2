import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import DeliveryList from './pages/DeliveryList';
import DeliveryDetail from './pages/DeliveryDetail';
import CreateDelivery from './pages/CreateDelivery';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes — no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — with sidebar layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div className="text-gray-400">Dashboard coming soon...</div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveries"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DeliveryList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveries/create"
          element={
            <ProtectedRoute roles={['customer']}>
              <DashboardLayout>
                <CreateDelivery />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deliveries/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DeliveryDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
