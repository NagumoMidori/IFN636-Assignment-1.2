import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CreateDelivery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiverName: '',
    receiverPhone: '',
    pickupAddress: '',
    packageType: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/api/deliveries', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/deliveries');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create delivery.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Delivery</h1>
      <p className="text-gray-400 mb-6">Start your delivery task</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Receiver Name</label>
            <input
              type="text"
              value={formData.receiverName}
              onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Receiver Phone</label>
            <input
              type="tel"
              value={formData.receiverPhone}
              onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
              placeholder="04XX XXX XXX"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Pickup Address</label>
            <input
              type="text"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
              placeholder="123 Main St, Brisbane"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Package Type</label>
            <input
              type="text"
              value={formData.packageType}
              onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
              placeholder="Parcel, Document, Fragile..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 bg-accent-purple hover:bg-accent-purple/80 text-white font-medium rounded-lg transition-colors"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CreateDelivery;
