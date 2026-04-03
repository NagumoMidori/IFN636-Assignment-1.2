import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-700 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Delivery Route Planner</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/deliveries">Deliveries</Link>
            {(user.role === 'dispatcher' || user.role === 'driver') && (
              <Link to="/routes">Routes</Link>
            )}
            <Link to="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
