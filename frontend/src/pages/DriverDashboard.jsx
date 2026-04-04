import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import LoadingSpinner from '../components/LoadingSpinner';

const statusBadge = {
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const DriverDashboard = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routeRes, delRes] = await Promise.all([
          axiosInstance.get('/api/routes', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/deliveries', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setRoutes(routeRes.data);
        setDeliveries(delRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const currentRoute = routes.find((r) => r.status === 'active');
  const nextStop = currentRoute?.stops?.find((s) => !s.completed);
  const completedCount = deliveries.filter((d) => d.status === 'delivered').length;
  const pendingCount = deliveries.filter((d) => d.status === 'pending').length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Good morning, {user.name}!
        </h1>
        <p className="text-gray-400 text-sm mt-1">Your driving overview</p>
      </div>

      {/* Current Route Card */}
      {currentRoute ? (
        <Link
          to={`/routes/${currentRoute._id}`}
          className="block bg-accent-purple rounded-xl p-5 mb-4 hover:bg-accent-purple/90 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-xs font-medium mb-1">Current Route</p>
              <p className="text-white text-lg font-bold">{currentRoute.routeId}</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs">Stops</p>
              <p className="text-white text-lg font-bold">{currentRoute.stops?.length || 0}</p>
            </div>
          </div>
        </Link>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-4 text-center">
          <p className="text-gray-400">No active route assigned</p>
        </div>
      )}

      {/* Next Stop Highlight */}
      {nextStop && (
        <div className="bg-status-delivered rounded-xl p-5 mb-4">
          <p className="text-green-100 text-xs font-medium mb-1">Next Stop</p>
          <p className="text-white text-xl font-bold">{nextStop.city}</p>
          <p className="text-green-100 text-sm mt-1">{nextStop.address}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-status-delivered">{completedCount}</p>
          <p className="text-xs text-gray-400 mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-status-pending">{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1">Pending</p>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">Recent Deliveries</h2>
        {deliveries.length === 0 ? (
          <p className="text-gray-400 text-sm">No deliveries assigned.</p>
        ) : (
          <div className="space-y-2">
            {deliveries.slice(0, 5).map((delivery) => (
              <Link
                key={delivery._id}
                to={`/deliveries/${delivery._id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-accent-purple/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent-purple/15 flex items-center justify-center text-accent-purple font-bold text-xs">
                    {delivery.receiverName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{delivery.receiverName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[delivery.status]}`}>
                  {delivery.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
