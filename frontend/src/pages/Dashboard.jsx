import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import DispatcherDashboard from './DispatcherDashboard';
import DriverDashboard from './DriverDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'dispatcher') return <DispatcherDashboard />;
  if (user?.role === 'driver') return <DriverDashboard />;
  return <CustomerDashboard />;
};

export default Dashboard;
