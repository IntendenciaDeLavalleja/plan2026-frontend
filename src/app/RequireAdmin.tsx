import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingState } from '@/components/common/LoadingState';

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState fullscreen label="Verificando sesión…" />;
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
