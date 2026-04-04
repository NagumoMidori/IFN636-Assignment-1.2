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

const DeliveryList = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axiosInstance.get('/api/deliveries', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDeliveries(response.data);
      } catch (error) {
        console.error('Failed to fetch deliveries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Loading deliveries..." />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {user.role === 'customer' ? 'My Deliveries' : user.role === 'driver' ? 'Assigned Deliveries' : 'All Deliveries'}
        </h1>
        {user.role === 'customer' && (
          <Link
            to="/deliveries/create"
            className="px-4 py-2.5 bg-accent-purple hover:bg-accent-purple/80 text-white text-sm font-medium rounded-lg transition-colors"
          >
            + New Delivery
          </Link>
        )}
      </div>

      {deliveries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-gray-400">No deliveries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <Link
              key={delivery._id}
              to={`/deliveries/${delivery._id}`}
              className="block bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-accent-purple/50 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-accent-purple/15 flex items-center justify-center text-accent-purple font-bold text-sm">
                    {delivery.receiverName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-800 font-medium truncate">{delivery.receiverName}</p>
                    <p className="text-sm text-gray-400 truncate">{delivery.pickupAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-13 sm:pl-0">
                  <span className="text-xs text-gray-400">
                    {new Date(delivery.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${statusBadge[delivery.status]}`}>
                    {delivery.status}
                  </span>
                </div>
              </div>

              {user.role === 'dispatcher' && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
                  <span>Customer: {delivery.customer?.name || '-'}</span>
                  <span>Driver: {delivery.driver?.name || 'Unassigned'}</span>
                  <span>Package: {delivery.packageType}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryList;
