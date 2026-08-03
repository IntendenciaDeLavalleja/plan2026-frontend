import { useQuery } from '@tanstack/react-query';
import { Body1, Body1Strong, Card, CardHeader, type CardProps, Subtitle1, Text } from '@fluentui/react-components';
import { getIcon } from '@/theme/iconMap';
import { publicApi } from '@/services/publicApi';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Tag24Regular } from '@fluentui/react-icons';

interface Props {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function TributeTypeStep({ selectedId, onSelect }: Props) {
  const tributesQuery = useQuery({
    queryKey: ['tribute-types'],
    queryFn: () => publicApi.tributeTypes(),
  });

  if (tributesQuery.isLoading) return <LoadingState label="Cargando tributos…" />;
  if (tributesQuery.isError)
    return <ErrorState onRetry={() => tributesQuery.refetch()} />;
  const tributes = tributesQuery.data ?? [];
  if (tributes.length === 0)
    return (
      <EmptyState
        icon={<Tag24Regular />}
        title="No hay tributos disponibles"
        description="La Intendencia aún no publicó tributos para reservar. Vuelve a intentarlo más tarde."
      />
    );

  return (
    <div className="af-stack">
      <Subtitle1>1. Elegí el tributo o adeudo</Subtitle1>
      <Text className="af-muted">
        Seleccioná el motivo por el cual necesitás atención. La duración y los
        requisitos pueden variar según el tributo.
      </Text>
      <div
        className="af-grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {tributes.map((t) => {
          const isSelected = selectedId === t.id;
          return (
            <Card
              key={t.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => onSelect(t.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(t.id);
                }
              }}
              style={{
                cursor: 'pointer',
                borderRadius: 14,
                borderColor: isSelected ? 'var(--af-primary)' : 'var(--af-border)',
                boxShadow: isSelected
                  ? 'var(--af-brand-shadow)'
                  : 'var(--af-shadow-sm)',
                transition: 'transform 120ms ease, box-shadow 120ms ease',
              }}
            >
              <CardHeader
                image={
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      display: 'grid',
                      placeItems: 'center',
                      color: isSelected ? '#fff' : 'var(--af-primary)',
                      background: isSelected
                        ? 'var(--af-brand-gradient)'
                        : 'var(--af-brand-soft)',
                    }}
                  >
                    {(() => {
                      const Icon = getIcon(t.icon_key);
                      return <Icon />;
                    })()}
                  </div>
                }
                header={<Body1Strong>{t.name}</Body1Strong>}
                description={
                  <Body1 style={{ whiteSpace: 'normal' }}>{t.description}</Body1>
                }
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export type TributeTypeCardProps = CardProps;
