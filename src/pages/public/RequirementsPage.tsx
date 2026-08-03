import { useQuery } from '@tanstack/react-query';
import {
  Body1,
  Body1Strong,
  Card,
  CardHeader,
  Subtitle1,
  Text,
  Title2,
} from '@fluentui/react-components';
import { DocumentBulletList24Regular } from '@fluentui/react-icons';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { publicApi } from '@/services/publicApi';
import { LoadingState } from '@/components/common/LoadingState';
import { getIcon } from '@/theme/iconMap';

export function RequirementsPage() {
  const tributesQuery = useQuery({
    queryKey: ['tribute-types'],
    queryFn: () => publicApi.tributeTypes(),
  });
  const tributes = tributesQuery.data ?? [];

  return (
    <PublicLayout>
      <div className="af-container" style={{ padding: '48px 16px', maxWidth: 960 }}>
        <div className="af-stack-lg">
          <div className="af-stack">
            <Text className="af-muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: 2 }}>
              Requisitos
            </Text>
            <Title2>Documentación por tributo</Title2>
            <Text className="af-muted">
              Revisá los requisitos de cada trámite para llegar a tu turno con
              todo lo necesario. Ante cualquier duda, contactá a la Intendencia.
            </Text>
          </div>
          {tributesQuery.isLoading ? (
            <LoadingState label="Cargando…" />
          ) : (
            <div className="af-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {tributes.map((t) => {
                const Icon = getIcon(t.icon_key);
                return (
                  <Card key={t.id} style={{ borderRadius: 16 }}>
                    <CardHeader
                      image={
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: 'var(--af-brand-soft)',
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
                        <Body1>
                          {t.description || 'Consulte requisitos al momento de la reserva.'}
                        </Body1>
                      }
                    />
                    <div className="af-stack" style={{ padding: 16, gap: 8 }}>
                      {t.requires_padron && <Badge>Required: Padrón / código municipal</Badge>}
                      {t.requires_matricula && <Badge>Required: Matrícula / chapa</Badge>}
                      {t.requires_document && <Badge>Required: Documento de identidad</Badge>}
                      {t.requirements_text && (
                        <div className="af-text-block-tight" style={{ marginTop: 8 }}>
                          <Subtitle1>Requisitos</Subtitle1>
                          <Body1>{t.requirements_text}</Body1>
                        </div>
                      )}
                      <div className="af-row" style={{ gap: 8, color: 'var(--af-muted)' }}>
                        <DocumentBulletList24Regular />
                        <Caption1>Duración aproximada: {t.default_duration_minutes} min</Caption1>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

import { Caption1 } from '@fluentui/react-components';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        background: 'rgba(4,120,87,0.08)',
        color: 'var(--af-success)',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        alignSelf: 'flex-start',
      }}
    >
      {children}
    </span>
  );
}
