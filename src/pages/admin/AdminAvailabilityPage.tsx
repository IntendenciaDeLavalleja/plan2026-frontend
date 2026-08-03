import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Body1,
  Body1Strong,
  Button,
  Caption1,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Option,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import {
  Add24Regular,
  ArrowExport24Regular,
  CalendarMonth24Regular,
  Delete24Regular,
  LockClosed24Regular,
  Play24Regular,
  Save24Regular,
} from '@fluentui/react-icons';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/adminApi';
import { ApiError } from '@/services/apiClient';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import dayjs from 'dayjs';

const WEEKDAYS = [
  { id: 0, label: 'Lun' },
  { id: 1, label: 'Mar' },
  { id: 2, label: 'Mié' },
  { id: 3, label: 'Jue' },
  { id: 4, label: 'Vie' },
  { id: 5, label: 'Sáb' },
  { id: 6, label: 'Dom' },
];

interface RuleForm {
  name: string;
  start_date: string;
  end_date: string;
  weekdays: number[];
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  capacity_per_slot: number;
  location_id: number | null;
  applies_to_all: boolean;
  tribute_type_ids: number[];
  is_active: boolean;
}

const EMPTY_RULE: RuleForm = {
  name: '',
  start_date: dayjs().format('YYYY-MM-DD'),
  end_date: dayjs().add(30, 'day').format('YYYY-MM-DD'),
  weekdays: [0, 1, 2, 3, 4],
  start_time: '09:00',
  end_time: '12:00',
  slot_duration_minutes: 30,
  capacity_per_slot: 1,
  location_id: null,
  applies_to_all: true,
  tribute_type_ids: [],
  is_active: true,
};

export function AdminAvailabilityPage() {
  const queryClient = useQueryClient();
  const rulesQuery = useQuery({
    queryKey: ['admin-rules'],
    queryFn: () => adminApi.listRules({ per_page: 100 }),
  });
  const tributesQuery = useQuery({
    queryKey: ['admin-tributes'],
    queryFn: () => adminApi.listTributes({ per_page: 200 }),
  });
  const locationsQuery = useQuery({
    queryKey: ['admin-locations'],
    queryFn: () => adminApi.listLocations(),
  });

  const tributes = tributesQuery.data?.items ?? [];
  const locations = locationsQuery.data ?? [];
  const rules = rulesQuery.data?.items ?? [];

  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState<RuleForm>(EMPTY_RULE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const createRule = useMutation({
    mutationFn: (payload: RuleForm) => adminApi.createRule(payload as unknown as Record<string, unknown>),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
      setRuleDialogOpen(false);
      setRuleForm(EMPTY_RULE);
      setSuccessMsg(`Regla "${data.name}" creada con éxito. Generá los slots cuando quieras.`);
    },
    onError: (err) => setErrorMsg(err instanceof ApiError ? err.message : 'Error al crear la regla'),
  });

  const generateRule = useMutation({
    mutationFn: (id: number) => adminApi.generateRuleSlots(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
      setSuccessMsg(`Se generaron ${data.created_slots} turnos a partir de la regla.`);
    },
  });

  const removeRule = useMutation({
    mutationFn: (id: number) => adminApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
      setConfirmDelete(null);
    },
  });

  const bulkGenerate = useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminApi.bulkGenerateSlots(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
      setBulkDialogOpen(false);
      setSuccessMsg(`Se generaron ${data.created_slots} turnos.`);
    },
    onError: (err) => setErrorMsg(err instanceof ApiError ? err.message : 'Error al generar slots'),
  });

  return (
    <AdminLayout
      pageTitle="Disponibilidad"
      pageSubtitle="Reglas recurrentes y generación rápida de turnos"
      topActions={
        <div className="af-row" style={{ gap: 8 }}>
          <Button
            appearance="outline"
            icon={<ArrowExport24Regular />}
            onClick={() => setBulkDialogOpen(true)}
          >
            Generación rápida
          </Button>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={() => {
              setRuleForm({ ...EMPTY_RULE, location_id: locations[0]?.id ?? null });
              setRuleDialogOpen(true);
            }}
          >
            Nueva regla
          </Button>
        </div>
      }
    >
      {(successMsg || errorMsg) && (
        <MessageBar intent={errorMsg ? 'error' : 'success'} style={{ marginBottom: 16 }}>
          <MessageBarBody>
            <Body1>{errorMsg ?? successMsg}</Body1>
          </MessageBarBody>
        </MessageBar>
      )}
      {rulesQuery.isLoading && <LoadingState label="Cargando reglas…" />}
      {rulesQuery.isError && <ErrorState onRetry={() => rulesQuery.refetch()} />}
      {rules.length === 0 && !rulesQuery.isLoading && (
        <EmptyState
          icon={<CalendarMonth24Regular />}
          title="No hay reglas de disponibilidad"
          description="Creá una regla recurrente o generá turnos manualmente para los próximos días."
          action={
            <div className="af-row" style={{ gap: 8 }}>
              <Button
                appearance="outline"
                icon={<ArrowExport24Regular />}
                onClick={() => setBulkDialogOpen(true)}
              >
                Generación rápida
              </Button>
              <Button
                appearance="primary"
                icon={<Add24Regular />}
                onClick={() => {
                  setRuleForm({ ...EMPTY_RULE, location_id: locations[0]?.id ?? null });
                  setRuleDialogOpen(true);
                }}
              >
                Nueva regla
              </Button>
            </div>
          }
        />
      )}
      {rules.length > 0 && (
        <Card style={{ borderRadius: 16, overflow: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nombre</TableHeaderCell>
                <TableHeaderCell>Rango</TableHeaderCell>
                <TableHeaderCell>Días</TableHeaderCell>
                <TableHeaderCell>Horario</TableHeaderCell>
                <TableHeaderCell>Duración · Cupo</TableHeaderCell>
                <TableHeaderCell>Aplica a</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="af-text-block-tight">
                      <Body1Strong>{r.name}</Body1Strong>
                      <Caption1 className="af-muted">{r.location_name ?? 'Sin sede'}</Caption1>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dayjs(r.start_date).format('DD/MM/YYYY')} → {dayjs(r.end_date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {r.weekdays
                      .map((w) => WEEKDAYS.find((d) => d.id === w)?.label ?? w)
                      .join(' · ')}
                  </TableCell>
                  <TableCell>
                    {r.start_time} – {r.end_time}
                  </TableCell>
                  <TableCell>
                    {r.slot_duration_minutes} min · {r.capacity_per_slot} por turno
                  </TableCell>
                  <TableCell>
                    {r.applies_to_all
                      ? 'Todos los tributos'
                      : `${r.tribute_type_ids.length} tributos`}
                  </TableCell>
                  <TableCell>
                    <div className="af-row" style={{ gap: 4 }}>
                      <Button
                        appearance="subtle"
                        icon={<Play24Regular />}
                        onClick={() => generateRule.mutate(r.id)}
                      >
                        Generar slots
                      </Button>
                      <Button
                        appearance="subtle"
                        icon={<Delete24Regular />}
                        onClick={() => setConfirmDelete(r.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <RuleDialog
        open={ruleDialogOpen}
        onClose={() => setRuleDialogOpen(false)}
        form={ruleForm}
        setForm={setRuleForm}
        tributes={tributes}
        locations={locations}
        submitting={createRule.isPending}
        error={errorMsg}
        onSubmit={() => createRule.mutate(ruleForm)}
      />

      <BulkGenerateDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        tributes={tributes}
        locations={locations}
        submitting={bulkGenerate.isPending}
        onSubmit={(payload) => bulkGenerate.mutate(payload)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Eliminar regla"
        message="¿Eliminar la regla seleccionada? Los slots ya generados no se eliminan automáticamente."
        destructive
        confirmLabel="Eliminar"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && removeRule.mutate(confirmDelete)}
      />
    </AdminLayout>
  );
}

function RuleDialog({
  open,
  onClose,
  form,
  setForm,
  tributes,
  locations,
  submitting,
  error,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  form: RuleForm;
  setForm: (updater: (prev: RuleForm) => RuleForm) => void;
  tributes: { id: number; name: string }[];
  locations: { id: number; name: string }[];
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(_, d) => (!d.open ? onClose() : null)}>
      <DialogSurface style={{ maxWidth: 720 }}>
        <DialogBody>
          <DialogTitle>Nueva regla de disponibilidad</DialogTitle>
          <DialogContent>
            <div className="af-stack" style={{ gap: 16 }}>
              <Field label="Nombre *">
                <Input
                  value={form.name}
                  onChange={(_, d) => setForm((f) => ({ ...f, name: d.value }))}
                />
              </Field>
              <div className="af-row" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Field label="Fecha de inicio">
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(_, d) => setForm((f) => ({ ...f, start_date: d.value }))}
                  />
                </Field>
                <Field label="Fecha de fin">
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(_, d) => setForm((f) => ({ ...f, end_date: d.value }))}
                  />
                </Field>
                <Field label="Sede">
                  <Dropdown
                    value={locations.find((l) => l.id === form.location_id)?.name ?? 'Seleccionar'}
                    selectedOptions={form.location_id ? [String(form.location_id)] : []}
                    onOptionSelect={(_, d) =>
                      setForm((f) => ({
                        ...f,
                        location_id: d.optionValue ? Number(d.optionValue) : null,
                      }))
                    }
                  >
                    {locations.map((l) => (
                      <Option key={l.id} value={String(l.id)}>
                        {l.name}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>
              </div>
              <Field label="Días de la semana">
                <div className="af-row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  {WEEKDAYS.map((w) => (
                    <Checkbox
                      key={w.id}
                      label={w.label}
                      checked={form.weekdays.includes(w.id)}
                      onChange={(_, d) =>
                        setForm((f) => ({
                          ...f,
                          weekdays: d.checked
                            ? [...f.weekdays, w.id]
                            : f.weekdays.filter((id) => id !== w.id),
                        }))
                      }
                    />
                  ))}
                </div>
              </Field>
              <div className="af-row" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Field label="Hora inicio">
                  <Input
                    type="time"
                    value={form.start_time}
                    onChange={(_, d) => setForm((f) => ({ ...f, start_time: d.value }))}
                  />
                </Field>
                <Field label="Hora fin">
                  <Input
                    type="time"
                    value={form.end_time}
                    onChange={(_, d) => setForm((f) => ({ ...f, end_time: d.value }))}
                  />
                </Field>
                <Field label="Duración por turno (min)">
                  <Input
                    type="number"
                    min={5}
                    value={String(form.slot_duration_minutes)}
                    onChange={(_, d) => setForm((f) => ({ ...f, slot_duration_minutes: Number(d.value) || 0 }))}
                  />
                </Field>
                <Field label="Cupo por turno">
                  <Input
                    type="number"
                    min={1}
                    value={String(form.capacity_per_slot)}
                    onChange={(_, d) => setForm((f) => ({ ...f, capacity_per_slot: Number(d.value) || 0 }))}
                  />
                </Field>
              </div>
              <div className="af-stack">
                <Checkbox
                  label="Aplica a todos los tributos activos"
                  checked={form.applies_to_all}
                  onChange={(_, d) =>
                    setForm((f) => ({ ...f, applies_to_all: !!d.checked, tribute_type_ids: [] }))
                  }
                />
                {!form.applies_to_all && (
                  <Dropdown
                    multiselect
                    placeholder="Seleccioná tributos"
                    value={
                      form.tribute_type_ids.length
                        ? `${form.tribute_type_ids.length} seleccionados`
                        : ''
                    }
                    selectedOptions={form.tribute_type_ids.map(String)}
                    onOptionSelect={(_, d) => {
                      const value = d.optionValue ? Number(d.optionValue) : null;
                      setForm((f) => ({
                        ...f,
                        tribute_type_ids: value
                          ? f.tribute_type_ids.includes(value)
                            ? f.tribute_type_ids.filter((id) => id !== value)
                            : [...f.tribute_type_ids, value]
                          : f.tribute_type_ids,
                      }));
                    }}
                  >
                    {tributes.map((t) => (
                      <Option key={t.id} value={String(t.id)}>
                        {t.name}
                      </Option>
                    ))}
                  </Dropdown>
                )}
              </div>
              {error && (
                <MessageBar intent="error">
                  <MessageBarBody>
                    <Body1>{error}</Body1>
                  </MessageBarBody>
                </MessageBar>
              )}
              {submitting && <Spinner size="small" />}
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger>
              <Button appearance="subtle" onClick={onClose}>
                Cancelar
              </Button>
            </DialogTrigger>
            <Button
              appearance="primary"
              icon={<Save24Regular />}
              disabled={!form.name || submitting}
              onClick={onSubmit}
            >
              Crear regla
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

function BulkGenerateDialog({
  open,
  onClose,
  tributes,
  locations,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  tributes: { id: number; name: string }[];
  locations: { id: number; name: string }[];
  submitting: boolean;
  onSubmit: (payload: Record<string, unknown>) => void;
}) {
  const [startDate, setStartDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(15, 'day').format('YYYY-MM-DD'));
  const [weekdays, setWeekdays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [duration, setDuration] = useState(30);
  const [capacity, setCapacity] = useState(1);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [appliesToAll, setAppliesToAll] = useState(true);
  const [selectedTributes, setSelectedTributes] = useState<number[]>([]);

  return (
    <Dialog open={open} onOpenChange={(_, d) => (!d.open ? onClose() : null)}>
      <DialogSurface style={{ maxWidth: 720 }}>
        <DialogBody>
          <DialogTitle>Generación rápida de slots</DialogTitle>
          <DialogContent>
            <div className="af-stack" style={{ gap: 16 }}>
              <div className="af-row" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Field label="Desde">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(_, d) => setStartDate(d.value)}
                  />
                </Field>
                <Field label="Hasta">
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(_, d) => setEndDate(d.value)}
                  />
                </Field>
                <Field label="Sede">
                  <Dropdown
                    value={locations.find((l) => l.id === locationId)?.name ?? 'Seleccionar'}
                    selectedOptions={locationId ? [String(locationId)] : []}
                    onOptionSelect={(_, d) =>
                      setLocationId(d.optionValue ? Number(d.optionValue) : null)
                    }
                  >
                    {locations.map((l) => (
                      <Option key={l.id} value={String(l.id)}>
                        {l.name}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>
              </div>
              <Field label="Días">
                <div className="af-row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  {WEEKDAYS.map((w) => (
                    <Checkbox
                      key={w.id}
                      label={w.label}
                      checked={weekdays.includes(w.id)}
                      onChange={(_, d) =>
                        setWeekdays((prev) =>
                          d.checked ? [...prev, w.id] : prev.filter((id) => id !== w.id),
                        )
                      }
                    />
                  ))}
                </div>
              </Field>
              <div className="af-row" style={{ gap: 12, flexWrap: 'wrap' }}>
                <Field label="Hora inicio">
                  <Input type="time" value={startTime} onChange={(_, d) => setStartTime(d.value)} />
                </Field>
                <Field label="Hora fin">
                  <Input type="time" value={endTime} onChange={(_, d) => setEndTime(d.value)} />
                </Field>
                <Field label="Duración (min)">
                  <Input
                    type="number"
                    min={5}
                    value={String(duration)}
                    onChange={(_, d) => setDuration(Number(d.value) || 0)}
                  />
                </Field>
                <Field label="Cupo por turno">
                  <Input
                    type="number"
                    min={1}
                    value={String(capacity)}
                    onChange={(_, d) => setCapacity(Number(d.value) || 0)}
                  />
                </Field>
              </div>
              <Checkbox
                label="Aplicar a todos los tributos activos"
                checked={appliesToAll}
                onChange={(_, d) => {
                  setAppliesToAll(!!d.checked);
                  if (d.checked) setSelectedTributes([]);
                }}
              />
              {!appliesToAll && (
                <Dropdown
                  multiselect
                  placeholder="Seleccioná tributos"
                  value={
                    selectedTributes.length ? `${selectedTributes.length} seleccionados` : ''
                  }
                  selectedOptions={selectedTributes.map(String)}
                  onOptionSelect={(_, d) => {
                    const value = d.optionValue ? Number(d.optionValue) : null;
                    if (value) {
                      setSelectedTributes((prev) =>
                        prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value],
                      );
                    }
                  }}
                >
                  {tributes.map((t) => (
                    <Option key={t.id} value={String(t.id)}>
                      {t.name}
                    </Option>
                  ))}
                </Dropdown>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger>
              <Button appearance="subtle" onClick={onClose}>
                Cancelar
              </Button>
            </DialogTrigger>
            <Button
              appearance="primary"
              icon={<LockClosed24Regular />}
              disabled={submitting}
              onClick={() =>
                onSubmit({
                  start_date: startDate,
                  end_date: endDate,
                  weekdays,
                  start_time: startTime,
                  end_time: endTime,
                  slot_duration_minutes: duration,
                  capacity_per_slot: capacity,
                  location_id: locationId,
                  applies_to_all: appliesToAll,
                  tribute_type_ids: appliesToAll ? undefined : selectedTributes,
                })
              }
            >
              Generar
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
