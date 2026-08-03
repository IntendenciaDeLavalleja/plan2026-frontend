import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Button, Caption1, Subtitle1, Text } from '@fluentui/react-components';
import { CalendarMonth24Regular, Clock24Regular } from '@fluentui/react-icons';
import { publicApi } from '@/services/publicApi';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import type { AvailableDate, Slot } from '@/types/api';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const EMPTY_DATES: AvailableDate[] = [];

interface Props {
  tributeTypeId: number;
  selectedDate: string | null;
  selectedSlotId: number | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: Slot) => void;
}

export function CalendarAvailability({
  tributeTypeId,
  selectedDate,
  selectedSlotId,
  onSelectDate,
  onSelectSlot,
}: Props) {
  const availabilityQuery = useQuery({
    queryKey: ['availability', tributeTypeId],
    queryFn: () => publicApi.availability(tributeTypeId, 60),
  });

  const slotsQuery = useQuery({
    queryKey: ['slots', tributeTypeId, selectedDate],
    queryFn: () => (selectedDate ? publicApi.slots(tributeTypeId, selectedDate) : Promise.resolve(null)),
    enabled: Boolean(selectedDate),
  });

  const dates: AvailableDate[] = availabilityQuery.data?.dates ?? EMPTY_DATES;
  const grouped = useMemo(() => groupByMonth(dates), [dates]);

  // Auto-pick the first available date if none selected
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      onSelectDate(dates[0].date);
    }
  }, [selectedDate, dates, onSelectDate]);

  if (availabilityQuery.isLoading) return <LoadingState label="Cargando disponibilidad…" />;
  if (availabilityQuery.isError) {
    return <ErrorState onRetry={() => availabilityQuery.refetch()} />;
  }
  if (dates.length === 0) {
    return (
      <EmptyState
        icon={<CalendarMonth24Regular />}
        title="Sin disponibilidad"
        description="No tenemos días disponibles para este tributo en los próximos 60 días. Probá nuevamente más tarde o comunicate con la Intendencia."
      />
    );
  }

  return (
    <div className="af-stack-lg">
      <div className="af-stack">
        <Subtitle1>
          <CalendarMonth24Regular style={{ marginRight: 8, verticalAlign: 'middle' }} />
          1. Elegí el día
        </Subtitle1>
        <div className="af-stack">
          {grouped.map((month) => (
            <div key={month.key} className="af-stack" style={{ gap: 8 }}>
              <Caption1 className="af-muted" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {month.label}
              </Caption1>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(86px, 1fr))',
                  gap: 8,
                }}
              >
                {month.dates.map((d) => {
                  const day = dayjs(d.date);
                  const isSelected = selectedDate === d.date;
                  const isLow = d.remaining > 0 && d.remaining <= 3;
                  const isFull = d.remaining <= 0;
                  return (
                    <Button
                      key={d.date}
                      appearance={isSelected ? 'primary' : 'outline'}
                      disabled={isFull}
                      onClick={() => onSelectDate(d.date)}
                      style={{
                        height: 72,
                        flexDirection: 'column',
                        gap: 2,
                        borderColor: isSelected ? undefined : isLow ? 'var(--af-warning)' : undefined,
                        color: isFull ? 'var(--af-muted)' : undefined,
                      }}
                    >
                      <Text size={200} weight="regular">
                        {day.format('ddd').toUpperCase()}
                      </Text>
                      <Text size={500} weight="bold">
                        {day.format('D')}
                      </Text>
                      <Caption1 style={{ opacity: 0.85 }}>
                        {isFull
                          ? 'Sin cupos'
                          : isLow
                            ? `Pocos (${d.remaining})`
                            : `${d.remaining} libres`}
                      </Caption1>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="af-stack">
          <Subtitle1>
            <Clock24Regular style={{ marginRight: 8, verticalAlign: 'middle' }} />
            2. Elegí el horario
          </Subtitle1>
          {slotsQuery.isLoading && <LoadingState label="Cargando horarios…" />}
          {slotsQuery.isError && <ErrorState onRetry={() => slotsQuery.refetch()} />}
          {slotsQuery.data && slotsQuery.data.slots.length === 0 && (
            <EmptyState
              icon={<Clock24Regular />}
              title="Sin horarios disponibles"
              description="Para la fecha seleccionada no quedan cupos. Probá con otro día."
            />
          )}
          {slotsQuery.data && slotsQuery.data.slots.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 8,
              }}
            >
              {slotsQuery.data.slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <Button
                    key={slot.id}
                    appearance={isSelected ? 'primary' : 'outline'}
                    onClick={() => onSelectSlot(slot)}
                    style={{
                      height: 64,
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Text size={500} weight="bold">
                      {slot.start_time}
                    </Text>
                    <Caption1 style={{ opacity: 0.85 }}>
                      {slot.remaining === slot.capacity
                        ? 'Libre'
                        : `${slot.remaining}/${slot.capacity}`}
                    </Caption1>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MonthGroup {
  key: string;
  label: string;
  dates: AvailableDate[];
}

function groupByMonth(dates: AvailableDate[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const d of dates) {
    const day = dayjs(d.date);
    const key = day.format('YYYY-MM');
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: day.format('MMMM YYYY'),
        dates: [],
      });
    }
    map.get(key)!.dates.push(d);
  }
  return Array.from(map.values());
}
