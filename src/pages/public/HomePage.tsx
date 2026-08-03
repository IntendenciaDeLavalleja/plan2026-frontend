import { useQuery } from '@tanstack/react-query';
import {
  Body1,
  Body1Strong,
  Button,
  Card,
  CardHeader,
  CardPreview,
  Subtitle1,
  Text,
  Title1,
  Title3,
} from '@fluentui/react-components';
import {
  ArrowRight24Regular,
  CalendarMonth24Regular,
  CheckmarkCircle24Regular,
  Clock24Regular,
  Calculator24Regular,
  DocumentBulletList24Regular,
  Info24Regular,
  LockClosed24Regular,
  Search24Regular,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { LoadingState } from '@/components/common/LoadingState';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { publicApi } from '@/services/publicApi';
import { getIcon } from '@/theme/iconMap';
import { AGENDA_CONFIG } from '@/config/agendaConfig';

const PILLARS = [
  {
    icon: <CalendarMonth24Regular />,
    title: 'Atención ordenada',
    description:
      'Reservá día y hora para ser atendido sin filas ni esperas innecesarias.',
  },
  {
    icon: <DocumentBulletList24Regular />,
    title: 'Tributo específico',
    description:
      'Elegí el motivo por el cual necesitás atención: adeudos, convenios o tributos departamentales.',
  },
  {
    icon: <CheckmarkCircle24Regular />,
    title: 'Confirmación inmediata',
    description:
      'Recibí un código de reserva al instante y conservalo para presentarte en la oficina.',
  },
];

export function HomePage() {
  const tributesQuery = useQuery({
    queryKey: ['tribute-types'],
    queryFn: () => publicApi.tributeTypes(),
  });
  const officeHours = AGENDA_CONFIG.officeHours;

  return (
    <PublicLayout>
      <div className="af-fade-in">
        <section className="af-hero">
          <div className="af-container af-hero-inner af-stack-lg" style={{ gap: 40 }}>
            <div className="af-row" style={{ gap: 8, color: 'rgba(255,255,255,0.85)' }}>
              <LockClosed24Regular />
              <Text weight="semibold">Plataforma oficial de la Intendencia de Lavalleja</Text>
            </div>
            <div className="af-stack" style={{ gap: 22, maxWidth: 820 }}>
              <Text
                size={500}
                weight="bold"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  textTransform: 'uppercase',
                  letterSpacing: 4,
                }}
              >
                Plan 2026
              </Text>
              <Title1
                style={{
                  color: '#fff',
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.03em',
                }}
              >
                Agenda electrónica para regularizar tus adeudos con Lavalleja
              </Title1>
              <Text
                size={500}
                style={{ color: 'rgba(255,255,255,0.9)', maxWidth: 720, lineHeight: 1.6 }}
              >
                Reservá día y hora para consultar o regularizar adeudos,
                convenios y tributos departamentales de forma simple, accesible
                y segura.
              </Text>
            </div>
            <div className="af-row" style={{ gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <Link to="/agendar" style={{ textDecoration: 'none' }}>
                <Button
                  size="large"
                  appearance="primary"
                  icon={<ArrowRight24Regular />}
                  iconPosition="after"
                  style={{ background: '#fff', color: '#1f3a8a' }}
                >
                  Reservar turno
                </Button>
              </Link>
              <Link to="/requisitos" style={{ textDecoration: 'none' }}>
                <Button
                  size="large"
                  appearance="subtle"
                  icon={<Info24Regular />}
                  style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  Consultar requisitos
                </Button>
              </Link>
              <Link to="/simulador" style={{ textDecoration: 'none' }}>
                <Button
                  size="large"
                  appearance="subtle"
                  icon={<Calculator24Regular />}
                  style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  Simulador
                </Button>
              </Link>
            </div>
            <div className="af-row" style={{ gap: 32, flexWrap: 'wrap', marginTop: 8 }}>
              <Pill icon={<Clock24Regular />} label="Horario" value={officeHours} />
              <Pill icon={<DocumentBulletList24Regular />} label="Atención" value="Sólo con turno previo" />
              <Pill icon={<Search24Regular />} label="Sin costo" value="Reservá sin pagar" />
            </div>
          </div>
        </section>

        <section className="af-section">
          <div className="af-container af-stack-lg">
            <div className="af-stack" style={{ gap: 8, maxWidth: 720 }}>
              <Text className="af-muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                ¿Cómo funciona?
              </Text>
              <Title3>Una experiencia simple en 4 pasos</Title3>
              <Body1 className="af-muted">
                El sistema te guía paso a paso para reservar un turno dentro
                del régimen de regularización del Plan 2026 de la Intendencia
                de Lavalleja.
              </Body1>
            </div>
            <div className="af-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
              {PILLARS.map((p) => (
                <Card key={p.title} style={{ borderRadius: 16, padding: 4 }}>
                  <CardHeader
                    image={
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg,#1f3a8a,#4338ca)',
                          color: '#fff',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {p.icon}
                      </div>
                    }
                    header={<Subtitle1>{p.title}</Subtitle1>}
                    description={<Body1>{p.description}</Body1>}
                  />
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="af-section" style={{ background: 'var(--af-institutional-gradient-soft)' }}>
          <div className="af-container af-stack-lg">
            <div className="af-row" style={{ gap: 16, alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div className="af-text-block" style={{ maxWidth: 760 }}>
                <Text className="af-muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                  Tributos disponibles
                </Text>
                <Title3>Seleccioná el motivo de tu consulta</Title3>
                <Body1 className="af-muted">
                  {tributesQuery.data?.length ?? 0} trámites publicados. Todos
                  pueden administrarse desde el panel institucional.
                </Body1>
              </div>
              <Link to="/agendar" style={{ textDecoration: 'none' }}>
                <Button appearance="primary" icon={<ArrowRight24Regular />} iconPosition="after">
                  Iniciar reserva
                </Button>
              </Link>
            </div>
            {tributesQuery.isLoading ? (
              <LoadingState label="Cargando tributos…" />
            ) : (
              <div className="af-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {(tributesQuery.data ?? []).slice(0, 9).map((t) => {
                  const Icon = getIcon(t.icon_key);
                  return (
                    <Card key={t.id} style={{ borderRadius: 14 }}>
                      <CardPreview
                        style={{
                          height: 6,
                          background: 'linear-gradient(90deg,#1f3a8a,#4338ca)',
                        }}
                      />
                      <CardHeader
                        image={
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: 'rgba(31,58,138,0.08)',
                              color: 'var(--af-primary)',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <Icon />
                          </div>
                        }
                        header={<Body1Strong>{t.name}</Body1Strong>}
                        description={
                          <Body1 style={{ minHeight: 40 }}>{t.description}</Body1>
                        }
                      />
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="af-section">
          <div className="af-container af-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <div
              className="af-card-elevated af-text-block"
              style={{ background: 'linear-gradient(135deg,#1f3a8a,#4338ca)', color: '#fff' }}
            >
              <Subtitle1 style={{ color: '#fff' }}>¿Tenés tu código de reserva?</Subtitle1>
              <Body1 style={{ color: 'rgba(255,255,255,0.9)' }}>
                Consultá el estado de tu turno o solicitá la cancelación con tu
                código y cédula.
              </Body1>
              <div style={{ marginTop: 12 }}>
                <Link to="/consultar" style={{ textDecoration: 'none' }}>
                  <Button appearance="primary" icon={<Search24Regular />}>
                    Consultar mi reserva
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

function Pill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 12,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: '#fff',
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.85)' }}>{icon}</div>
      <div className="af-text-block-tight">
        <Text size={200} style={{ color: 'rgba(255,255,255,0.7)' }}>
          {label}
        </Text>
        <Body1Strong style={{ color: '#fff' }}>{value}</Body1Strong>
      </div>
    </div>
  );
}
