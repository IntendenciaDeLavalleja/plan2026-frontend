import { createElement } from 'react';
import {
  Badge,
  Body1Strong,
  Card,
  CardHeader,
  Subtitle1,
  Text,
} from '@fluentui/react-components';
import { CalendarMonth24Regular, Clock24Regular, Person24Regular } from '@fluentui/react-icons';
import dayjs from 'dayjs';
import type { Slot, TributeType } from '@/types/api';
import { getIcon } from '@/theme/iconMap';

interface Props {
  tributeType: TributeType;
  slot: Slot;
  citizenName?: string;
}

export function ConfirmationSummary({ tributeType, slot, citizenName }: Props) {
  const iconElement = createElement(getIcon(tributeType.icon_key));
  return (
    <Card style={{ borderRadius: 16, padding: 16 }}>
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
            {iconElement}
          </div>
        }
        header={<Body1Strong>Resumen de la reserva</Body1Strong>}
        description={
          <Text className="af-muted">Verificá los datos antes de confirmar.</Text>
        }
      />
      <div
        className="af-stack"
        style={{ gap: 12, marginTop: 12 }}
      >
        <Row label="Tributo" value={tributeType.name} />
        <Row
          label="Fecha"
          value={
            <span>
              <CalendarMonth24Regular style={{ marginRight: 4, verticalAlign: 'middle' }} />
              {dayjs(slot.date).format('dddd D [de] MMMM YYYY')}
            </span>
          }
        />
        <Row
          label="Hora"
          value={
            <span>
              <Clock24Regular style={{ marginRight: 4, verticalAlign: 'middle' }} />
              {slot.start_time} – {slot.end_time}
            </span>
          }
        />
        {slot.location_name && <Row label="Sede" value={slot.location_name} />}
        {citizenName && (
          <Row
            label="Titular"
            value={
              <span>
                <Person24Regular style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {citizenName}
              </span>
            }
          />
        )}
        <Row
          label="Duración estimada"
          value={<Badge appearance="outline">{tributeType.default_duration_minutes} minutos</Badge>}
        />
      </div>
      <div className="af-text-block-tight" style={{ marginTop: 16 }}>
        <Subtitle1>Requisitos</Subtitle1>
        <Text>{tributeType.requirements_text || tributeType.description}</Text>
      </div>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="af-detail-row">
      <Text className="af-detail-label" style={{ minWidth: 120 }}>
        {label}
      </Text>
      <Body1Strong className="af-detail-value" style={{ fontWeight: 500 }}>{value}</Body1Strong>
    </div>
  );
}
