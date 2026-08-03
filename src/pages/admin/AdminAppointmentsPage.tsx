import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Body1,
  Body1Strong,
  Button,
  Caption1,
  Card,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Option,
  SearchBox,
  Subtitle1,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import {
  CalendarMonth24Regular,
  Dismiss24Regular,
  CheckmarkCircle24Regular,
  Print24Regular,
  Call24Regular,
  Search24Regular,
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/adminApi';
import { ApiError } from '@/services/apiClient';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import type { AppointmentPublic, AppointmentStatus } from '@/types/api';

const STATUS_OPTIONS: AppointmentStatus[] = ['reserved', 'confirmed', 'attended', 'cancelled', 'no_show'];

export function AdminAppointmentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [tributeFilter, setTributeFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selected, setSelected] = useState<AppointmentPublic | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<AppointmentPublic | null>(null);

  const appointmentsQuery = useQuery({
    queryKey: ['admin-appointments', page, status, search, tributeFilter, dateFrom, dateTo],
    queryFn: () =>
      adminApi.listAppointments({
        page,
        per_page: 30,
        status: status || undefined,
        search: search || undefined,
        tribute_type_id: tributeFilter ? Number(tributeFilter) : undefined,
        from: dateFrom || undefined,
        to: dateTo || undefined,
      }),
  });
  const tributesQuery = useQuery({
    queryKey: ['admin-tributes'],
    queryFn: () => adminApi.listTributes({ per_page: 200 }),
  });
  const tributes = tributesQuery.data?.items ?? [];
  const items = appointmentsQuery.data?.items ?? [];
  const total = appointmentsQuery.data?.total ?? 0;
  const pages = appointmentsQuery.data?.pages ?? 1;

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { status?: AppointmentStatus; internal_notes?: string } }) =>
      adminApi.updateAppointment(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setSelected(data);
    },
    onError: (err) => alert(err instanceof ApiError ? err.message : 'No se pudo actualizar'),
  });

  const cancel = useMutation({
    mutationFn: (id: number) => adminApi.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setConfirmCancel(null);
    },
  });

  return (
    <AdminLayout
      pageTitle="Agenda de turnos"
      pageSubtitle="Gestioná, filtrá y actualizá las reservas registradas"
      topActions={
        <Link to="/admin/registrar-turno" style={{ textDecoration: 'none' }}>
          <Button appearance="primary" icon={<Call24Regular />}>
            Registrar por teléfono
          </Button>
        </Link>
      }
    >
      <Card style={{ borderRadius: 16, marginBottom: 16 }}>
        <div
          className="af-row"
          style={{ gap: 12, padding: 12, flexWrap: 'wrap' }}
        >
          <Field label="Buscar">
            <SearchBox
              value={search}
              onChange={(_, d) => setSearch(d.value)}
              placeholder="Nombre, cédula o código"
              contentBefore={<Search24Regular />}
            />
          </Field>
          <Field label="Estado">
            <Dropdown
              value={status || 'Todos'}
              selectedOptions={status ? [status] : []}
              onOptionSelect={(_, d) => setStatus(d.optionValue ? String(d.optionValue) : '')}
            >
              <Option value="">Todos</Option>
              {STATUS_OPTIONS.map((s) => (
                <Option key={s} value={s}>
                  {s}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Tributo">
            <Dropdown
              value={tributes.find((t) => String(t.id) === tributeFilter)?.name ?? 'Todos'}
              selectedOptions={tributeFilter ? [tributeFilter] : []}
              onOptionSelect={(_, d) =>
                setTributeFilter(d.optionValue ? String(d.optionValue) : '')
              }
            >
              <Option value="">Todos</Option>
              {tributes.map((t) => (
                <Option key={t.id} value={String(t.id)}>
                  {t.name}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Desde">
            <Input
              type="date"
              value={dateFrom}
              onChange={(_, d) => setDateFrom(d.value)}
            />
          </Field>
          <Field label="Hasta">
            <Input
              type="date"
              value={dateTo}
              onChange={(_, d) => setDateTo(d.value)}
            />
          </Field>
          <Button
            appearance="subtle"
            onClick={() => {
              setSearch('');
              setStatus('');
              setTributeFilter('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      </Card>

      {appointmentsQuery.isLoading && <LoadingState label="Cargando turnos…" />}
      {appointmentsQuery.isError && <ErrorState onRetry={() => appointmentsQuery.refetch()} />}
      {items.length === 0 && !appointmentsQuery.isLoading && (
        <EmptyState
          icon={<CalendarMonth24Regular />}
          title="No hay turnos con esos filtros"
          description="Probá ajustando los criterios de búsqueda."
        />
      )}
      {items.length > 0 && (
        <Card style={{ borderRadius: 16, overflow: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Código</TableHeaderCell>
                <TableHeaderCell>Vecino</TableHeaderCell>
                <TableHeaderCell>Tributo</TableHeaderCell>
                <TableHeaderCell>Fecha y hora</TableHeaderCell>
                <TableHeaderCell>Sede</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Body1Strong style={{ fontFamily: 'Consolas, monospace' }}>{a.reservation_code}</Body1Strong>
                  </TableCell>
                  <TableCell>
                    <div className="af-stack" style={{ gap: 4 }}>
                      <Body1Strong>{a.citizen.name}</Body1Strong>
                      <Caption1 className="af-muted">{a.citizen.document}</Caption1>
                    </div>
                  </TableCell>
                  <TableCell>{a.tribute_type?.name}</TableCell>
                  <TableCell>
                    <div className="af-stack" style={{ gap: 4 }}>
                      <Body1Strong>{a.date ? dayjs(a.date).format('DD/MM/YYYY') : '—'}</Body1Strong>
                      <Caption1 className="af-muted">{a.start_time} – {a.end_time}</Caption1>
                    </div>
                  </TableCell>
                  <TableCell>{a.location?.name ?? '—'}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell>
                    <div className="af-row" style={{ gap: 4 }}>
                      <Button
                        appearance="subtle"
                        onClick={() => setSelected(a)}
                      >
                        Detalle
                      </Button>
                      {a.status !== 'cancelled' && a.status !== 'attended' && (
                        <Button
                          appearance="subtle"
                          icon={<Dismiss24Regular />}
                          onClick={() => setConfirmCancel(a)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="af-row" style={{ padding: 12, justifyContent: 'space-between' }}>
            <Caption1 className="af-muted">{total} turnos · página {page} de {pages}</Caption1>
            <div className="af-row" style={{ gap: 8 }}>
              <Button
                appearance="subtle"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>
              <Button
                appearance="subtle"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </Card>
      )}

      <AppointmentDetailDialog
        appointment={selected}
        onClose={() => setSelected(null)}
        onUpdate={(payload) => selected && update.mutate({ id: selected.id, payload })}
        updating={update.isPending}
      />

      <ConfirmDialog
        open={!!confirmCancel}
        title="Cancelar turno"
        message={
          confirmCancel
            ? `¿Cancelar la reserva ${confirmCancel.reservation_code}? Se liberará el cupo y se enviará un correo al vecino.`
            : ''
        }
        destructive
        confirmLabel="Cancelar turno"
        onCancel={() => setConfirmCancel(null)}
        onConfirm={() => confirmCancel && cancel.mutate(confirmCancel.id)}
      />
    </AdminLayout>
  );
}

function AppointmentDetailDialog({
  appointment,
  onClose,
  onUpdate,
  updating,
}: {
  appointment: AppointmentPublic | null;
  onClose: () => void;
  onUpdate: (payload: { status?: AppointmentStatus; internal_notes?: string }) => void;
  updating: boolean;
}) {
  const [status, setStatus] = useState<AppointmentStatus>('reserved');
  const [notes, setNotes] = useState('');

  // sync state when opening
  if (appointment && appointment.status !== status && notes === '') {
    setStatus(appointment.status);
    setNotes('');
  }

  return (
    <Dialog open={!!appointment} onOpenChange={(_, d) => (!d.open ? onClose() : null)}>
      <DialogSurface style={{ maxWidth: 640 }}>
        <DialogBody>
          <DialogTitle>Detalle de la reserva</DialogTitle>
          <DialogContent>
            {appointment && (
              <div className="af-stack" style={{ gap: 12 }}>
                <Subtitle1>{appointment.tribute_type?.name}</Subtitle1>
                <div className="af-row" style={{ gap: 8 }}>
                  <StatusBadge status={appointment.status} />
                  <Caption1 className="af-muted">
                    {appointment.date ? dayjs(appointment.date).format('DD/MM/YYYY') : ''} ·{' '}
                    {appointment.start_time}
                  </Caption1>
                </div>
                <div className="af-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  <Row label="Código" value={appointment.reservation_code} />
                  <Row label="Vecino" value={appointment.citizen.name} />
                  <Row label="Cédula" value={appointment.citizen.document} />
                  <Row label="Teléfono" value={appointment.citizen.phone} />
                  {appointment.citizen.email && <Row label="Email" value={appointment.citizen.email} />}
                  {appointment.citizen.reference_value && (
                    <Row label="Referencia" value={appointment.citizen.reference_value} />
                  )}
                  {appointment.location && (
                    <Row label="Sede" value={`${appointment.location.name} · ${appointment.location.address}`} />
                  )}
                </div>
                <Field label="Estado">
                  <Dropdown
                    value={status}
                    selectedOptions={[status]}
                    onOptionSelect={(_, d) => setStatus(String(d.optionValue ?? status) as AppointmentStatus)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <Option key={s} value={s}>
                        {s}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>
                <Field label="Notas internas">
                  <Input
                    value={notes}
                    onChange={(_, d) => setNotes(d.value)}
                    placeholder="Notas para el equipo administrativo"
                  />
                </Field>
                {appointment.comments && (
                  <MessageBar intent="info">
                    <MessageBarBody>
                      <Body1>
                        <strong>Comentarios del vecino:</strong> {appointment.comments}
                      </Body1>
                    </MessageBarBody>
                  </MessageBar>
                )}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="subtle" icon={<Print24Regular />} onClick={() => window.print()}>
              Imprimir
            </Button>
            <Button appearance="subtle" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              appearance="primary"
              icon={<CheckmarkCircle24Regular />}
              disabled={updating}
              onClick={() => onUpdate({ status, internal_notes: notes })}
            >
              Guardar cambios
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="af-stack" style={{ gap: 6 }}>
      <Caption1 className="af-muted" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </Caption1>
      <Body1Strong style={{ fontWeight: 500 }}>{value}</Body1Strong>
    </div>
  );
}
