import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Body1,
  Body1Strong,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Subtitle1,
  Text,
  Title2,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { LoadingState } from '@/components/common/LoadingState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { publicApi } from '@/services/publicApi';
import { ApiError } from '@/services/apiClient';
import { getIcon } from '@/theme/iconMap';
import dayjs from 'dayjs';

export function AppointmentLookupPage() {
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState<{ code: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookupQuery = useQuery({
    queryKey: ['lookup', submitted?.code],
    queryFn: () => publicApi.lookupAppointment(submitted!.code),
    enabled: Boolean(submitted?.code),
    retry: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setError(null);
    setSubmitted({ code: code.trim().toUpperCase() });
  };

  const appointment = lookupQuery.data;

  return (
    <PublicLayout>
      <div className="af-container" style={{ padding: '48px 16px', maxWidth: 720 }}>
        <div className="af-stack-lg">
          <div className="af-text-block">
            <Title2>Consultar mi reserva</Title2>
            <Text className="af-muted">
              Ingresá tu código de reserva para ver el estado del turno.
              La información es confidencial.
            </Text>
          </div>
          <Card style={{ borderRadius: 16 }}>
            <CardHeader
              header={<Subtitle1>Buscar reserva</Subtitle1>}
              description={
                <Body1>
                  El código se encuentra en el comprobante que recibiste al
                  finalizar la reserva.
                </Body1>
              }
            />
            <form
              onSubmit={handleSubmit}
              className="af-stack"
              style={{ padding: 16 }}
            >
              <Field label="Código de reserva">
                <Input
                  value={code}
                  onChange={(_, d) => setCode(d.value)}
                  placeholder="IDL-AF-2026-XXXXXX"
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
              {lookupQuery.isError && (
                <MessageBar intent="error">
                  <MessageBarBody>
                    <Body1>
                      {(lookupQuery.error as ApiError | undefined)?.message ??
                        'No encontramos ninguna reserva con esos datos.'}
                    </Body1>
                  </MessageBarBody>
                </MessageBar>
              )}
              <Button
                type="submit"
                appearance="primary"
                icon={<Search24Regular />}
                disabled={!code || !document}
              >
                Buscar reserva
              </Button>
            </form>
          </Card>

          {lookupQuery.isLoading && <LoadingState label="Buscando reserva…" />}

          {appointment && (
            <Card style={{ borderRadius: 16 }} className="af-fade-in">
              <CardHeader
                image={
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                        background: 'var(--af-brand-soft)',
                      color: 'var(--af-primary)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {(() => {
                      const Icon = getIcon(appointment.tribute_type?.icon_key);
                      return <Icon />;
                    })()}
                  </div>
                }
                header={<Body1Strong>{appointment.tribute_type?.name}</Body1Strong>}
                description={
                  <Body1>
                    {appointment.date
                      ? dayjs(appointment.date).format('dddd D [de] MMMM YYYY')
                      : '—'}
                    {appointment.start_time && ` · ${appointment.start_time} – ${appointment.end_time}`}
                  </Body1>
                }
                action={<StatusBadge status={appointment.status} />}
              />
              <div className="af-stack" style={{ padding: 16, gap: 8 }}>
                <Row label="Código" value={appointment.reservation_code} />
                {appointment.location && <Row label="Sede" value={appointment.location.name} />}
                <Row label="Titular" value={appointment.citizen.name} />
                <Row label="Cédula" value={appointment.citizen.document} />
                {appointment.citizen.email && <Row label="Email" value={appointment.citizen.email} />}
                <Row label="Teléfono" value={appointment.citizen.phone} />
                {appointment.citizen.reference_value && <Row label="Referencia" value={appointment.citizen.reference_value} />}
              </div>
            </Card>
          )}
        </div>
      </div>
    </PublicLayout>
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
