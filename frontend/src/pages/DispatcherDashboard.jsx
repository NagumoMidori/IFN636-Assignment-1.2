import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusBadge = {
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const DispatcherDashboard = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [delRes, routeRes] = await Promise.all([
          axiosInstance.get('/api/deliveries', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/routes', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setDeliveries(delRes.data);
        setRoutes(routeRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const completedDeliveries = deliveries.filter((d) => d.status === 'delivered').length;
  const activeRoutes = routes.filter((r) => r.status === 'active').length;

  const filteredDeliveries = deliveries.filter((d) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      d.receiverName?.toLowerCase().includes(term) ||
      d.pickupAddress?.toLowerCase().includes(term) ||
      d.customer?.name?.toLowerCase().includes(term) ||
      d.status?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Good morning, {user.name}!
        </h1>
        <p className="text-gray-400 text-sm mt-1">System overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-accent-purple rounded-xl p-5">
          <p className="text-purple-200 text-xs font-medium mb-1">Completed Deliveries</p>
          <p className="text-white text-3xl font-bold">{completedDeliveries}</p>
        </div>
        <div className="bg-status-delivered rounded-xl p-5">
          <p className="text-green-100 text-xs font-medium mb-1">Active Routes</p>
          <p className="text-white text-3xl font-bold">{activeRoutes}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple shadow-sm"
          placeholder="Search deliveries..."
        />
      </div>

      {/* All Deliveries */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">All Deliveries</h2>
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <p className="text-gray-400">No deliveries found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDeliveries.map((delivery) => (
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
                      {new Date(delivery.createdAt).toLocaleDateString()} · {delivery.customer?.name || '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {delivery.driver?.name || 'Unassigned'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[delivery.status]}`}>
                    {delivery.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DispatcherDashboard;
