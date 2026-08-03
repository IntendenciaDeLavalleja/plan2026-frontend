import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Body1,
  Body1Strong,
  Button,
  Card,
  CardHeader,
  Caption1,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Subtitle1,
  Text,
  Title2,
} from '@fluentui/react-components';
import { LockClosed24Regular, Shield24Regular } from '@fluentui/react-icons';
import { useAuth } from '@/providers/AuthProvider';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const {
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
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!captcha) refreshCaptcha();
  }, [captcha, refreshCaptcha]);

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password, captchaInput);
      setCaptchaInput('');
    } catch {
      // error already in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;
    setSubmitting(true);
    try {
      await verify2FA(fullCode);
    } catch {
      // error already in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 1);
    const newCode = [...code];
    newCode[index] = digits;
    setCode(newCode);
    if (digits && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  if (loading) {
    return (
      <CenteredShell>
        <Spinner size="large" />
      </CenteredShell>
    );
  }

  return (
    <CenteredShell>
      <div className="af-row" style={{ justifyContent: 'flex-end', marginBottom: 12 }}>
        <ThemeToggle />
      </div>
      <Card style={{ width: '100%', maxWidth: 460, borderRadius: 20, padding: 24 }} className="af-fade-in">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'var(--af-brand-gradient)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <LockClosed24Regular />
          </div>
          <div>
            <Title2 style={{ margin: 0 }}>Panel administrativo</Title2>
            <Text className="af-muted">Amnistía Financiera · Intendencia de Lavalleja</Text>
          </div>
        </div>

        {!needs2FA ? (
          <form className="af-stack" onSubmit={handleLogin}>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(_, d) => setEmail(d.value)}
                placeholder="admin@lavalleja.gub.uy"
                required
                autoComplete="email"
              />
            </Field>
            <Field label="Contraseña">
              <Input
                type="password"
                value={password}
                onChange={(_, d) => setPassword(d.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </Field>
            <Field
              label="Verificación de seguridad"
              hint={captcha?.question ?? 'Cargando…'}
              validationState={captchaInput && Number(captchaInput) !== captcha?.answer ? 'error' : undefined}
              validationMessage={
                captchaInput && Number(captchaInput) !== captcha?.answer
                  ? 'Respuesta incorrecta'
                  : undefined
              }
            >
              <Input
                value={captchaInput}
                onChange={(_, d) => setCaptchaInput(d.value)}
                placeholder="Resultado"
                inputMode="numeric"
                required
              />
            </Field>
            {error && (
              <MessageBar intent="error">
                <MessageBarBody>
                  <Body1>{error}</Body1>
                </MessageBarBody>
              </MessageBar>
            )}
            <div className="af-row" style={{ justifyContent: 'space-between' }}>
              <Button
                type="button"
                appearance="subtle"
                onClick={() => {
                  clearError();
                  refreshCaptcha();
                }}
                disabled={captchaLoading}
              >
                Nuevo captcha
              </Button>
              <Button type="submit" appearance="primary" disabled={submitting}>
                {submitting ? 'Validando…' : 'Ingresar'}
              </Button>
            </div>
          </form>
        ) : (
          <form className="af-stack" onSubmit={handleVerify2FA}>
            <div className="af-text-block-tight">
              <Subtitle1>Verificación en dos pasos</Subtitle1>
              <Text>
                Ingresá el código de 6 dígitos que enviamos a {pendingEmailPreview}.
              </Text>
              <Body1Strong>{pendingEmailPreview}</Body1Strong>
              <Text>El código expira en 10 minutos.</Text>
            </div>
            <div className="af-row" style={{ gap: 8, justifyContent: 'space-between' }}>
              {code.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => {
                    codeRefs.current[i] = el;
                  }}
                  value={digit}
                  onChange={(_, d) => handleCodeChange(i, d.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && i > 0) {
                      codeRefs.current[i - 1]?.focus();
                    }
                  }}
                  maxLength={1}
                  inputMode="numeric"
                  style={{ width: 48, textAlign: 'center', fontSize: 24, fontWeight: 700 }}
                  aria-label={`Dígito ${i + 1}`}
                />
              ))}
            </div>
            {error && (
              <MessageBar intent="error">
                <MessageBarBody>
                  <Body1>{error}</Body1>
                </MessageBarBody>
              </MessageBar>
            )}
            <div className="af-row" style={{ justifyContent: 'space-between' }}>
              <Button
                type="button"
                appearance="subtle"
                onClick={() => {
                  setCode(['', '', '', '', '', '']);
                  clearError();
                  refreshCaptcha();
                }}
              >
                Cambiar de cuenta
              </Button>
              <Button
                type="submit"
                appearance="primary"
                icon={<Shield24Regular />}
                disabled={submitting || code.join('').length !== 6}
              >
                {submitting ? 'Verificando…' : 'Validar código'}
              </Button>
            </div>
          </form>
        )}
        <CardHeader
          header={<Caption1 className="af-muted">Acceso restringido a personal autorizado.</Caption1>}
        />
      </Card>
    </CenteredShell>
  );
}

function CenteredShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="af-page"
      style={{
        minHeight: '100vh',
        background: 'var(--af-auth-shell-bg)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 520 }}>{children}</div>
    </div>
  );
}
