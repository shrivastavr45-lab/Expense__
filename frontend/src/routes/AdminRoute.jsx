import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminRoute() {
  const user = useAuthStore(s => s.user);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
