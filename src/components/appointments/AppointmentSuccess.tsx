import { Body1, Body1Strong, Button, Card, CardHeader, CardPreview, MessageBar, MessageBarBody, Subtitle1, Text } from '@fluentui/react-components';
import { CheckmarkCircle24Regular, Print24Regular } from '@fluentui/react-icons';
import type { AppointmentPublic } from '@/types/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface Props {
  appointment: AppointmentPublic;
  receiptFooter: string;
  returnTo?: string;
  returnLabel?: string;
}

export function AppointmentSuccess({
  appointment,
  receiptFooter,
  returnTo = '/',
  returnLabel = 'Volver al inicio',
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="af-stack-lg af-fade-in">
      <div className="af-row" style={{ gap: 12, alignItems: 'center' }}>
        <CheckmarkCircle24Regular style={{ color: 'var(--af-success)', fontSize: 32 }} />
        <Subtitle1>¡Reserva registrada con éxito!</Subtitle1>
      </div>
      <Card style={{ borderRadius: 16 }}>
        <CardPreview
          style={{
            background: 'linear-gradient(135deg, #1f3a8a 0%, #4338ca 100%)',
            color: '#fff',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Comprobante oficial</Text>
          <Text size={800} weight="bold" style={{ color: '#fff', letterSpacing: 2, fontFamily: 'Consolas, monospace' }}>
            {appointment.reservation_code}
          </Text>
        </CardPreview>
        <CardHeader
          header={<Body1Strong>{appointment.tribute_type?.name ?? 'Tributo'}</Body1Strong>}
          description={
            <Body1>
              {appointment.date
                ? dayjs(appointment.date).format('dddd D [de] MMMM YYYY')
                : '—'}
              {' · '}
              {appointment.start_time} – {appointment.end_time}
            </Body1>
          }
        />
        <div className="af-stack" style={{ padding: 16, gap: 8 }}>
          {appointment.location && (
            <Row label="Sede" value={`${appointment.location.name} · ${appointment.location.address}`} />
          )}
          <Row label="Titular" value={appointment.citizen.name} />
          <Row label="Cédula" value={appointment.citizen.document} />
          {appointment.citizen.email && <Row label="Email" value={appointment.citizen.email} />}
          <Row label="Teléfono" value={appointment.citizen.phone} />
          <Row label="Estado" value={appointment.status} />
        </div>
        {appointment.email_delivery === 'sent' && appointment.citizen.email && (
          <MessageBar intent="success" style={{ margin: '0 16px 16px' }}>
            <MessageBarBody>Enviamos el comprobante a {appointment.citizen.email}.</MessageBarBody>
          </MessageBar>
        )}
        {appointment.email_delivery === 'failed' && appointment.citizen.email && (
          <MessageBar intent="warning" style={{ margin: '0 16px 16px' }}>
            <MessageBarBody>La reserva fue registrada, pero no pudimos enviar el comprobante por correo. Conservá el código mostrado.</MessageBarBody>
          </MessageBar>
        )}
        <div
          style={{
            borderTop: '1px dashed var(--af-border)',
            padding: 16,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          <Text className="af-muted">{receiptFooter}</Text>
          <div className="af-row" style={{ gap: 8 }}>
            <Button
              appearance="outline"
              icon={<Print24Regular />}
              onClick={() => window.print()}
            >
              Imprimir comprobante
            </Button>
            <Button appearance="primary" onClick={() => navigate(returnTo)}>
              {returnLabel}
            </Button>
          </div>
        </div>
      </Card>
      <Text className="af-muted">
        Conserve este código para consultar o cancelar su turno. Lo esperamos en
        la fecha y hora indicadas. Ante cualquier duda comuníquese con la
        Intendencia.
      </Text>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="af-detail-row">
      <Text className="af-detail-label">
        {label}
      </Text>
      <Body1Strong className="af-detail-value" style={{ fontWeight: 500 }}>{value}</Body1Strong>
    </div>
  );
}
