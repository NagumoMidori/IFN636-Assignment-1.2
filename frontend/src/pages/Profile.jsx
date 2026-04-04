import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(response.data);
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          university: response.data.university || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
        });
      } catch (error) {
        alert('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfile({ ...profile, ...formData });
      setEditing(false);
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-400">Loading...</div>;
  }

  const roleBadgeColor = {
    customer: 'bg-blue-100 text-blue-700',
    driver: 'bg-green-100 text-green-700',
    dispatcher: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Profile header */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple font-bold text-2xl">
            {profile?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{profile?.name}</h2>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${roleBadgeColor[profile?.role] || 'bg-gray-100 text-gray-600'}`}>
              {profile?.role}
            </span>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Phone', key: 'phone', type: 'tel' },
              { label: 'University', key: 'university', type: 'text' },
              { label: 'Address', key: 'address', type: 'text' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-accent-purple"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/80 text-white font-medium rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: profile?.name },
                { label: 'Role', value: profile?.role, capitalize: true },
                { label: 'Email', value: profile?.email },
                { label: 'Phone', value: profile?.phone || '-' },
                { label: 'University', value: profile?.university || '-' },
                { label: 'Address', value: profile?.address || '-' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className={`text-sm text-gray-800 ${item.capitalize ? 'capitalize' : ''}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 px-6 py-2.5 bg-accent-purple hover:bg-accent-purple/80 text-white font-medium rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
