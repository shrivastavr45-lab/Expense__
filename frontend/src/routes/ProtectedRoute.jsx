import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  const { token } = useAuthStore();
  const location  = useLocation();
  return token
    ? <Outlet />
    : <Navigate to="/signin" state={{ from: location }} replace />;
}
