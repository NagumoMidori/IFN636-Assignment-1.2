import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CreateRoute = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    routeId: '',
    transportType: 'car',
    distance: '',
    duration: '',
  });
  const [stops, setStops] = useState([
    { address: '', city: '', lat: '', lng: '' },
  ]);
  const [error, setError] = useState('');

  const addStop = () => {
    setStops([...stops, { address: '', city: '', lat: '', lng: '' }]);
  };

  const removeStop = (index) => {
    if (stops.length <= 1) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index, field, value) => {
    const updated = [...stops];
    updated[index][field] = value;
    setStops(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...formData,
        stops: stops.map((s) => ({
          address: s.address,
          city: s.city,
          lat: s.lat ? parseFloat(s.lat) : undefined,
          lng: s.lng ? parseFloat(s.lng) : undefined,
        })),
      };
      await axiosInstance.post('/api/routes', payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/routes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create route.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Route</h1>
      <p className="text-gray-400 mb-6">Set up a new delivery route</p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Route Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Route Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Route ID</label>
              <input
                type="text"
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                placeholder="Route-1532"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Transport Type</label>
              <div className="flex gap-2">
                {['bike', 'car', 'train'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, transportType: type })}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                      formData.transportType === type
                        ? 'bg-accent-purple text-white'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'bike' ? '🚲 ' : type === 'train' ? '🚆 ' : '🚗 '}
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Distance</label>
              <input
                type="text"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                placeholder="120 km"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                placeholder="1h 30m"
              />
            </div>
          </div>
        </div>

        {/* Stops */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-400">Stops</h2>
            <button
              type="button"
              onClick={addStop}
              className="px-3 py-1.5 bg-accent-purple hover:bg-accent-purple/80 text-white text-xs rounded-lg transition-colors"
            >
              + Add Stop
            </button>
          </div>

          <div className="space-y-4">
            {stops.map((stop, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Stop {index + 1}</span>
                  {stops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStop(index)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={stop.address}
                    onChange={(e) => updateStop(index, 'address', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                    placeholder="Address"
                    required
                  />
                  <input
                    type="text"
                    value={stop.city}
                    onChange={(e) => updateStop(index, 'city', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                    placeholder="City"
                    required
                  />
                  <input
                    type="text"
                    value={stop.lat}
                    onChange={(e) => updateStop(index, 'lat', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                    placeholder="Latitude (optional)"
                  />
                  <input
                    type="text"
                    value={stop.lng}
                    onChange={(e) => updateStop(index, 'lng', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-accent-purple"
                    placeholder="Longitude (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-accent-purple hover:bg-accent-purple/80 text-white font-medium rounded-lg transition-colors"
        >
          Create Route
        </button>
      </form>
    </div>
  );
};

export default CreateRoute;
