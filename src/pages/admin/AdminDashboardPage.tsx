import { useQuery } from '@tanstack/react-query';
import {
  Body1,
  Body1Strong,
  Button,
  Caption1,
  Card,
  CardHeader,
  Subtitle1,
  Text,
  Title3,
} from '@fluentui/react-components';
import {
  CalendarMonth24Regular,
  CheckmarkCircle24Regular,
  Clock24Regular,
  DismissCircle24Regular,
  Tag24Regular,
  Warning24Regular,
  ArrowRight24Regular,
  Add24Regular,
  CalendarLtr24Regular,
} from '@fluentui/react-icons';
import dayjs from 'dayjs';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/adminApi';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const dashboardQuery = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard(),
    refetchInterval: 60_000,
  });

  return (
    <AdminLayout
      pageTitle="Panel general"
      pageSubtitle="Resumen operativo de la Amnistía Financiera"
    >
      {dashboardQuery.isLoading && <LoadingState label="Cargando métricas…" />}
      {dashboardQuery.isError && (
        <ErrorState onRetry={() => dashboardQuery.refetch()} />
      )}
      {dashboardQuery.data && (
        <div className="af-stack-lg">
          <div className="af-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <MetricCard
              icon={<CalendarMonth24Regular />}
              label="Turnos de hoy"
              value={dashboardQuery.data.metrics.today}
              tone="brand"
            />
            <MetricCard
              icon={<Clock24Regular />}
              label="Próximos turnos"
              value={dashboardQuery.data.metrics.upcoming}
              tone="neutral"
            />
            <MetricCard
              icon={<Warning24Regular />}
              label="Pendientes"
              value={dashboardQuery.data.metrics.pending}
              tone="warning"
            />
            <MetricCard
              icon={<CheckmarkCircle24Regular />}
              label="Cupos disponibles (7d)"
              value={dashboardQuery.data.metrics.weekly_capacity}
              tone="success"
            />
            <MetricCard
              icon={<DismissCircle24Regular />}
              label="Cancelados"
              value={dashboardQuery.data.metrics.cancelled}
              tone="danger"
            />
            <MetricCard
              icon={<Tag24Regular />}
              label="Tributos activos"
              value={dashboardQuery.data.metrics.active_tributes}
              tone="brand"
            />
          </div>

          <div className="af-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <ActionCard
              title="Crear disponibilidad"
              description="Generá slots para los próximos días con un solo formulario."
              icon={<CalendarLtr24Regular />}
              onClick={() => navigate('/admin/disponibilidad')}
            />
            <ActionCard
              title="Crear tipo de tributo"
              description="Agregá un nuevo tributo o adeudo para que los vecinos puedan reservarlo."
              icon={<Add24Regular />}
              onClick={() => navigate('/admin/tributos')}
            />
            <ActionCard
              title="Ver agenda completa"
              description="Filtrá turnos por estado, fecha o tributo."
              icon={<CalendarMonth24Regular />}
              onClick={() => navigate('/admin/turnos')}
            />
          </div>

          <Card style={{ borderRadius: 16 }}>
            <CardHeader
              header={<Subtitle1>Próximos turnos</Subtitle1>}
              description={
                <Text className="af-muted">
                  Los siguientes turnos están reservados. Hacé clic en uno para
                  gestionarlo.
                </Text>
              }
              action={
                <Button
                  appearance="subtle"
                  icon={<ArrowRight24Regular />}
                  iconPosition="after"
                  onClick={() => navigate('/admin/turnos')}
                >
                  Ver agenda
                </Button>
              }
            />
            <div className="af-stack" style={{ padding: 16, gap: 8 }}>
              {dashboardQuery.data.upcoming_appointments.length === 0 && (
                <Text className="af-muted">No hay turnos próximos.</Text>
              )}
              {dashboardQuery.data.upcoming_appointments.map((a) => (
                <div
                  key={a.id}
                  className="af-row"
                  style={{
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: 12,
                    border: '1px solid var(--af-border)',
                    borderRadius: 12,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Body1Strong>{a.citizen.name}</Body1Strong>
                    <Text className="af-muted">{a.tribute_type?.name}</Text>
                    <Caption1>
                      {a.date ? dayjs(a.date).format('ddd D MMM') : ''} · {a.start_time}
                      {a.location ? ` · ${a.location.name}` : ''}
                    </Caption1>
                  </div>
                  <div className="af-row" style={{ gap: 8 }}>
                    <StatusBadge status={a.status} />
                    <Button
                      appearance="subtle"
                      icon={<ArrowRight24Regular />}
                      onClick={() => navigate(`/admin/turnos?code=${a.reservation_code}`)}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
}) {
  const colors: Record<typeof tone, string> = {
    brand: 'var(--af-primary)',
    success: 'var(--af-success)',
    warning: 'var(--af-warning)',
    danger: 'var(--af-danger)',
    neutral: 'var(--af-muted)',
  };
  return (
    <Card style={{ borderRadius: 16, padding: 8 }}>
      <div className="af-row" style={{ gap: 12, alignItems: 'flex-start', padding: 8 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${colors[tone]}15`,
            color: colors[tone],
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {icon}
        </div>
        <div className="af-text-block-tight">
          <Text className="af-muted" style={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}>
            {label}
          </Text>
          <Title3 style={{ margin: 0 }}>{value}</Title3>
        </div>
      </div>
    </Card>
  );
}

function ActionCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Card
      role="button"
      onClick={onClick}
      style={{ borderRadius: 16, cursor: 'pointer' }}
    >
      <CardHeader
        image={
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg,#1f3a8a,#4338ca)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {icon}
          </div>
        }
        header={<Body1Strong>{title}</Body1Strong>}
        description={<Body1>{description}</Body1>}
      />
    </Card>
  );
}
