import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusBadge = {
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const DeliveryDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axiosInstance.get(`/api/deliveries/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDelivery(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch delivery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [id, user]);

  const handleUpdate = async (updateData) => {
    try {
      const response = await axiosInstance.put(`/api/deliveries/${id}`, updateData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setDelivery({ ...delivery, ...response.data });
      setEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update delivery.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this delivery?')) return;
    try {
      await axiosInstance.delete(`/api/deliveries/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/deliveries');
    } catch (error) {
      alert('Failed to delete delivery.');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (!delivery) {
    return <div className="text-gray-400">Delivery not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Delivery Details</h1>
          <p className="text-sm text-gray-400 mt-1">
            Created {new Date(delivery.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${statusBadge[delivery.status]}`}>
          {delivery.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Receiver Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Receiver Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Name" value={delivery.receiverName} />
            <InfoField label="Phone" value={delivery.receiverPhone} />
            <InfoField label="Pickup Address" value={delivery.pickupAddress} />
            <InfoField label="Package Type" value={delivery.packageType} />
          </div>
        </div>

        {/* Customer & Driver Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Customer" value={delivery.customer?.name || '-'} />
            <InfoField label="Customer Email" value={delivery.customer?.email || '-'} />
            <InfoField label="Driver" value={delivery.driver?.name || 'Unassigned'} />
            <InfoField label="Driver Phone" value={delivery.driver?.phone || '-'} />
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Actions</h2>

          {/* Customer: edit own pending delivery */}
          {user.role === 'customer' && delivery.status === 'pending' && (
            editing ? (
              <div className="space-y-4">
                {[
                  { label: 'Receiver Name', key: 'receiverName' },
                  { label: 'Receiver Phone', key: 'receiverPhone' },
                  { label: 'Pickup Address', key: 'pickupAddress' },
                  { label: 'Package Type', key: 'packageType' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                    <input
                      type="text"
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                ))}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate({
                      receiverName: formData.receiverName,
                      receiverPhone: formData.receiverPhone,
                      pickupAddress: formData.pickupAddress,
                      packageType: formData.packageType,
                    })}
                    className="px-5 py-2 bg-accent-purple hover:bg-accent-purple/80 text-white text-sm rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2 bg-accent-purple hover:bg-accent-purple/80 text-white text-sm rounded-lg transition-colors"
              >
                Edit Delivery
              </button>
            )
          )}

          {/* Dispatcher: update status, assign driver, delete */}
          {user.role === 'dispatcher' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select
                    value={formData.status || delivery.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-accent-purple"
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Assign Driver (User ID)</label>
                  <input
                    type="text"
                    value={formData.driver || ''}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                    placeholder="Driver ID"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdate({ status: formData.status, driver: formData.driver || undefined })}
                  className="px-5 py-2 bg-accent-purple hover:bg-accent-purple/80 text-white text-sm rounded-lg transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded-lg transition-colors"
                >
                  Delete Delivery
                </button>
              </div>
            </div>
          )}

          {/* Driver / Customer with non-pending: read-only */}
          {(user.role === 'driver' || (user.role === 'customer' && delivery.status !== 'pending')) && (
            <p className="text-sm text-gray-400">No actions available for this delivery.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm text-gray-800">{value}</p>
  </div>
);

export default DeliveryDetail;
