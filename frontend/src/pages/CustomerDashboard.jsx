import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusBadge = {
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const CustomerDashboard = () => {
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

  const latestDelivery = deliveries[0];

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
        <p className="text-gray-400 text-sm mt-1">Here's your delivery overview</p>
      </div>

      {/* Latest Delivery Highlight */}
      {latestDelivery ? (
        <Link
          to={`/deliveries/${latestDelivery._id}`}
          className="block bg-accent-purple rounded-xl p-5 mb-4 hover:bg-accent-purple/90 transition-colors"
        >
          <p className="text-purple-200 text-xs font-medium mb-1">Current Delivery</p>
          <p className="text-white text-lg font-bold">
            Delivery — {latestDelivery.receiverName}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-purple-200 text-sm">{latestDelivery.pickupAddress}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              latestDelivery.status === 'delivered'
                ? 'bg-green-400/20 text-green-100'
                : latestDelivery.status === 'cancelled'
                ? 'bg-red-400/20 text-red-100'
                : 'bg-yellow-400/20 text-yellow-100'
            }`}>
              {latestDelivery.status}
            </span>
          </div>
        </Link>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-4 text-center">
          <p className="text-gray-400">No deliveries yet</p>
        </div>
      )}

      {/* Create Delivery Button */}
      <Link
        to="/deliveries/create"
        className="block w-full py-3 mb-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-accent-purple font-medium hover:bg-gray-50 transition-colors"
      >
        + Create Delivery
      </Link>

      {/* Delivery History */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">History</h2>
        {deliveries.length === 0 ? (
          <p className="text-gray-400 text-sm">No delivery history.</p>
        ) : (
          <div className="space-y-2">
            {deliveries.map((delivery) => (
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

export default CustomerDashboard;
