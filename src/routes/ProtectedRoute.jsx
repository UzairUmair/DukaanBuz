import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import LoadingState from '../components/common/LoadingState.jsx';

export default function ProtectedRoute() {
  const { authenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingState label="Restoring your session…" />;
  if (!authenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
