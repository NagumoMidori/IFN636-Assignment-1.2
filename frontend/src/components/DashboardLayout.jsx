import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based navigation items
  const navItems = [];

  navItems.push({ to: '/dashboard', label: 'Dashboard', icon: '⌂' });

  if (user?.role === 'customer') {
    navItems.push({ to: '/deliveries', label: 'My Deliveries', icon: '◫' });
    navItems.push({ to: '/deliveries/create', label: 'New Delivery', icon: '+' });
  }

  if (user?.role === 'dispatcher') {
    navItems.push({ to: '/deliveries', label: 'All Deliveries', icon: '◫' });
    navItems.push({ to: '/routes', label: 'Routes', icon: '⊙' });
  }

  if (user?.role === 'driver') {
    navItems.push({ to: '/deliveries', label: 'Assigned', icon: '◫' });
    navItems.push({ to: '/routes', label: 'My Routes', icon: '⊙' });
  }

  navItems.push({ to: '/profile', label: 'Profile', icon: '◉' });

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent-purple/20 text-accent-purple'
        : 'text-gray-400 hover:bg-navy-600 hover:text-gray-200'
    }`;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top header — full width */}
      <header className="h-14 bg-navy-800 border-b border-navy-500 flex items-center justify-between px-6 shrink-0">
        <h1 className="text-lg font-bold text-white tracking-wide">
          Delivery Planner
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <div className="w-8 h-8 rounded-full bg-accent-purple/30 flex items-center justify-center text-accent-purple font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-navy-800 border-r border-navy-500 flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/dashboard'}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User / Logout */}
          <div className="px-4 py-4 border-t border-navy-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-accent-purple/30 flex items-center justify-center text-accent-purple font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-sm text-gray-400 hover:text-red-400 hover:bg-navy-600 px-4 py-2 rounded-lg transition-colors text-left"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
