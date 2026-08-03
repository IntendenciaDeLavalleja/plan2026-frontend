import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { adminApi } from '@/services/adminApi';
import { ApiError } from '@/services/apiClient';
import type { AdminUser } from '@/types/api';

interface CaptchaState {
  question: string;
  answer: number;
}

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  captcha: CaptchaState | null;
  captchaLoading: boolean;
  needs2FA: boolean;
  pendingEmailPreview: string | null;
  error: string | null;
  refreshCaptcha: () => Promise<void>;
  login: (email: string, password: string, captcha: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [captcha, setCaptcha] = useState<CaptchaState | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);
  const [pendingEmailPreview, setPendingEmailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<CaptchaState | null>(null);
  captchaRef.current = captcha;

  const refreshCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const data = await adminApi.captcha();
      setCaptcha(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo obtener la verificación');
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const data = await adminApi.me();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
  }, [refreshMe]);

  const login = useCallback(
    async (email: string, password: string, captchaAnswer: string) => {
      setError(null);
      try {
        const result = await adminApi.login({ email, password, captcha: captchaAnswer });
        setNeeds2FA(true);
        setPendingEmailPreview(result.preview);
        await refreshCaptcha();
      } catch (err) {
        if (err instanceof ApiError && err.code === 'captcha_invalid') {
          await refreshCaptcha();
        }
        const message = err instanceof ApiError ? err.message : 'Error al iniciar sesión';
        setError(message);
        throw err;
      }
    },
    [refreshCaptcha],
  );

  const verify2FA = useCallback(
    async (code: string) => {
      setError(null);
      try {
        const data = await adminApi.verify2FA(code);
        setUser(data.user);
        setNeeds2FA(false);
        setPendingEmailPreview(null);
        setCaptcha(null);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Código inválido';
        setError(message);
        throw err;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setNeeds2FA(false);
      setPendingEmailPreview(null);
      await refreshCaptcha();
    }
  }, [refreshCaptcha]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      captcha,
      captchaLoading,
      needs2FA,
      pendingEmailPreview,
      error,
      refreshCaptcha,
      login,
      verify2FA,
      logout,
      clearError,
    }),
    [
      user,
      loading,
      captcha,
      captchaLoading,
      needs2FA,
      pendingEmailPreview,
      error,
      refreshCaptcha,
      login,
      verify2FA,
      logout,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
