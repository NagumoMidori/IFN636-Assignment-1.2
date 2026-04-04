import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import MapView from '../components/MapView';

const statusBadge = {
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const RouteDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dispatcher form state
  const [assignDriver, setAssignDriver] = useState('');
  const [transportType, setTransportType] = useState('');

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await axiosInstance.get(`/api/routes/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRoute(response.data);
        setTransportType(response.data.transportType);
      } catch (error) {
        console.error('Failed to fetch route:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id, user]);

  const handleReassignDriver = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/routes/${id}`,
        { driver: assignDriver },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRoute(response.data);
      setAssignDriver('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reassign driver.');
    }
  };

  const handleRegenerateRoute = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/routes/${id}`,
        { transportType },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRoute(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to regenerate route.');
    }
  };

  const handleMarkStopComplete = async (stopId) => {
    try {
      const response = await axiosInstance.put(
        `/api/routes/${id}`,
        { stopId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRoute(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark stop as complete.');
    }
  };

  const handleMarkRouteComplete = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/routes/${id}`,
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setRoute(response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete route.');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!route) {
    return <div className="text-gray-400">Route not found.</div>;
  }

  const completedStops = route.stops?.filter((s) => s.completed).length || 0;
  const totalStops = route.stops?.length || 0;
  const nextStop = route.stops?.find((s) => !s.completed);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Route Details</h1>
          <p className="text-sm text-gray-400 mt-1">{route.routeId}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${statusBadge[route.status]}`}>
          {route.status}
        </span>
      </div>

      {/* Map */}
      <div className="mb-6">
        <MapView stops={route.stops || []} />
      </div>

      <div className="space-y-4">
        {/* Route Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Route Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoField label="Route ID" value={route.routeId} />
            <InfoField label="Driver" value={route.driver?.name || 'Unassigned'} />
            <InfoField label="Total Stops" value={totalStops} />
            <InfoField label="Completed" value={completedStops} />
            <InfoField label="Pending" value={totalStops - completedStops} />
            <InfoField label="Transport" value={route.transportType} capitalize />
            <InfoField label="Distance" value={route.distance || '-'} />
            <InfoField label="Duration" value={route.duration || '-'} />
          </div>
        </div>

        {/* Driver: Next Stop highlight */}
        {user.role === 'driver' && nextStop && (
          <div className="bg-accent-purple/5 rounded-xl border border-accent-purple/20 p-6">
            <h2 className="text-sm font-medium text-accent-purple mb-3">Next Stop</h2>
            <p className="text-xl font-bold text-gray-800">{nextStop.city}</p>
            <p className="text-sm text-gray-400 mt-1">{nextStop.address}</p>
          </div>
        )}

        {/* Driver: Progress */}
        {user.role === 'driver' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-400">Progress</h2>
              <span className="text-sm font-medium text-gray-600">
                {completedStops} / {totalStops} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-accent-purple h-2.5 rounded-full transition-all"
                style={{ width: totalStops > 0 ? `${(completedStops / totalStops) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )}

        {/* Stops List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Stops</h2>
          {route.stops?.length === 0 ? (
            <p className="text-gray-400 text-sm">No stops added.</p>
          ) : (
            <div className="space-y-3">
              {route.stops.map((stop, index) => (
                <div
                  key={stop._id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    stop.completed ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{stop.city}</p>
                      <p className="text-xs text-gray-400">{stop.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {stop.completed ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Completed
                      </span>
                    ) : (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                        {user.role === 'driver' && route.status === 'active' && (
                          <button
                            onClick={() => handleMarkStopComplete(stop._id)}
                            className="px-3 py-1 bg-accent-purple hover:bg-accent-purple/80 text-white text-xs rounded-lg transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dispatcher: Reassign & Regenerate */}
        {user.role === 'dispatcher' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Dispatcher Actions</h2>

            {/* Mark as Complete toggle */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-600">Marked as Complete</span>
              <button
                onClick={handleMarkRouteComplete}
                disabled={route.status === 'completed'}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  route.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    route.status === 'completed' ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Reassign Driver */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">Reassign Driver (User ID)</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={assignDriver}
                  onChange={(e) => setAssignDriver(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                  placeholder="Enter driver ID"
                />
                <button
                  onClick={handleReassignDriver}
                  className="px-5 py-2.5 bg-accent-purple hover:bg-accent-purple/80 text-white text-sm rounded-lg transition-colors"
                >
                  Reassign Driver
                </button>
              </div>
            </div>

            {/* Regenerate Route */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Transport Type</label>
              <div className="flex gap-3 mb-3">
                {['bike', 'car', 'train'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTransportType(type)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                      transportType === type
                        ? 'bg-accent-purple text-white'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'bike' ? '🚲 ' : type === 'train' ? '🚆 ' : '🚗 '}
                    {type}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRegenerateRoute}
                className="w-full py-2.5 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Regenerate Route
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoField = ({ label, value, capitalize }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-sm text-gray-800 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
  </div>
);

export default RouteDetail;
