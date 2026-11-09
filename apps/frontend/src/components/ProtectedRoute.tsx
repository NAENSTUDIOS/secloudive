import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ adminOnly = false }: { adminOnly?: boolean }) {
  const { loading, user, role } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-[50vh] place-items-center text-slate-400">Loading secure workspace…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
