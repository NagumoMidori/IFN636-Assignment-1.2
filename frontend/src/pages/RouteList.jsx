import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusBadge = {
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const RouteList = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axiosInstance.get('/api/routes', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRoutes(response.data);
      } catch (error) {
        console.error('Failed to fetch routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [user]);

  if (loading) {
    return <div className="text-gray-400">Loading routes...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {user.role === 'driver' ? 'My Routes' : 'All Routes'}
        </h1>
      </div>

      {routes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-gray-400">No routes found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map((route) => {
            const completedStops = route.stops?.filter((s) => s.completed).length || 0;
            const totalStops = route.stops?.length || 0;

            return (
              <Link
                key={route._id}
                to={`/routes/${route._id}`}
                className="block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-accent-purple/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-blue/15 flex items-center justify-center text-accent-blue font-bold text-xs">
                      {route.transportType === 'bike' ? '🚲' : route.transportType === 'train' ? '🚆' : '🚗'}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{route.routeId}</p>
                      <p className="text-sm text-gray-400">
                        {completedStops}/{totalStops} stops completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">
                      {new Date(route.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[route.status]}`}>
                      {route.status}
                    </span>
                  </div>
                </div>

                {/* Driver info for dispatcher */}
                {user.role === 'dispatcher' && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6 text-sm text-gray-400">
                    <span>Driver: {route.driver?.name || 'Unassigned'}</span>
                    <span>Transport: {route.transportType}</span>
                    {route.distance && <span>Distance: {route.distance}</span>}
                    {route.duration && <span>Duration: {route.duration}</span>}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RouteList;
