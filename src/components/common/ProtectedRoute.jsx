import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = getCurrentUser(); // This reads from localStorage
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;