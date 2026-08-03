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
import { Add24Regular, Edit24Regular, Delete24Regular, Save24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/adminApi';
import { ApiError } from '@/services/apiClient';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { getIcon } from '@/theme/iconMap';
import type { TributeType } from '@/types/api';

const ICON_OPTIONS = [
  { value: 'document', label: 'Documento' },
  { value: 'home', label: 'Inmueble' },
  { value: 'building', label: 'Edificio / Comercio' },
  { value: 'vehicle', label: 'Vehículo' },
  { value: 'money', label: 'Dinero' },
  { value: 'warning', label: 'Advertencia' },
  { value: 'person', label: 'Persona' },
  { value: 'receipt', label: 'Recibo' },
  { value: 'shield', label: 'Seguridad' },
];

interface FormState {
  name: string;
  slug: string;
  description: string;
  icon_key: string;
  requirements_text: string;
  default_duration_minutes: number;
  requires_padron: boolean;
  requires_matricula: boolean;
  requires_document: boolean;
  is_active: boolean;
  sort_order: number;
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  description: '',
  icon_key: 'document',
  requirements_text: '',
  default_duration_minutes: 20,
  requires_padron: false,
  requires_matricula: false,
  requires_document: true,
  is_active: true,
  sort_order: 100,
};

export function AdminTributeTypesPage() {
  const queryClient = useQueryClient();
  const tributesQuery = useQuery({
    queryKey: ['admin-tributes'],
    queryFn: () => adminApi.listTributes({ per_page: 200, include_inactive: true }),
  });
  const tributes = tributesQuery.data?.items ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TributeType | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TributeType | null>(null);

  const upsert = useMutation({
    mutationFn: async (payload: FormState) => {
      const cleaned = {
        ...payload,
        slug: payload.slug || payload.name.toLowerCase().replace(/\s+/g, '-'),
      };
      if (editing) return adminApi.updateTribute(editing.id, cleaned);
      return adminApi.createTribute(cleaned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tributes'] });
      setDialogOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : 'No se pudo guardar el tributo');
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteTribute(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-tributes'] });
      setConfirmDelete(null);
      if (data.soft_deleted) {
        setErrorMsg('El tributo tenía reservas asociadas: se desactivó en lugar de eliminarse.');
        setTimeout(() => setErrorMsg(null), 4000);
      }
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrorMsg(null);
    setDialogOpen(true);
  };
  const openEdit = (t: TributeType) => {
    setEditing(t);
    setForm({
      name: t.name,
      slug: t.slug,
      description: t.description ?? '',
      icon_key: t.icon_key ?? 'document',
      requirements_text: t.requirements_text ?? '',
      default_duration_minutes: t.default_duration_minutes,
      requires_padron: t.requires_padron,
      requires_matricula: t.requires_matricula,
      requires_document: t.requires_document,
      is_active: t.is_active,
      sort_order: t.sort_order,
    });
    setErrorMsg(null);
    setDialogOpen(true);
  };

  return (
    <AdminLayout
      pageTitle="Tipos de tributo / adeudo"
      pageSubtitle="Administrá los tributos que los vecinos pueden reservar"
      topActions={
        <Button appearance="primary" icon={<Add24Regular />} onClick={openCreate}>
          Nuevo tributo
        </Button>
      }
    >
      {tributesQuery.isLoading && <LoadingState label="Cargando tributos…" />}
      {tributesQuery.isError && <ErrorState onRetry={() => tributesQuery.refetch()} />}
      {errorMsg && (
        <MessageBar intent="info" style={{ marginBottom: 16 }}>
          <MessageBarBody>
            <Body1>{errorMsg}</Body1>
          </MessageBarBody>
        </MessageBar>
      )}
      {tributesQuery.data && tributes.length === 0 && (
        <EmptyState
          icon={<Add24Regular />}
          title="Aún no hay tributos publicados"
          description="Creá el primer tributo para que los vecinos puedan reservar turnos."
          action={
            <Button appearance="primary" icon={<Add24Regular />} onClick={openCreate}>
              Crear tributo
            </Button>
          }
        />
      )}
      {tributes.length > 0 && (
        <Card style={{ borderRadius: 16, overflow: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Tributo</TableHeaderCell>
                <TableHeaderCell>Requisitos</TableHeaderCell>
                <TableHeaderCell>Duración</TableHeaderCell>
                <TableHeaderCell>Orden</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tributes.map((t) => {
                const Icon = getIcon(t.icon_key);
                return (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="af-row" style={{ gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: 'var(--af-brand-soft)',
                            color: 'var(--af-primary)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <Icon />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <Body1Strong>{t.name}</Body1Strong>
                          <Caption1 className="af-muted">{t.slug}</Caption1>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Caption1>
                        {t.requires_padron && 'Padrón · '}
                        {t.requires_matricula && 'Matrícula · '}
                        {t.requires_document && 'Documento'}
                      </Caption1>
                    </TableCell>
                    <TableCell>{t.default_duration_minutes} min</TableCell>
                    <TableCell>{t.sort_order}</TableCell>
                    <TableCell>
                      {t.is_active ? (
                        <Caption1 style={{ color: 'var(--af-success)' }}>Activo</Caption1>
                      ) : (
                        <Caption1 className="af-muted">Inactivo</Caption1>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="af-row" style={{ gap: 4 }}>
                        <Button
                          appearance="subtle"
                          icon={<Edit24Regular />}
                          onClick={() => openEdit(t)}
                        >
                          Editar
                        </Button>
                        <Button
                          appearance="subtle"
                          icon={<Delete24Regular />}
                          onClick={() => setConfirmDelete(t)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={(_, data) => setDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{editing ? 'Editar tributo' : 'Nuevo tributo'}</DialogTitle>
            <DialogContent>
              <div className="af-stack" style={{ gap: 12, minWidth: 360 }}>
                <Field label="Nombre *">
                  <Input
                    value={form.name}
                    onChange={(_, d) => setForm((f) => ({ ...f, name: d.value }))}
                  />
                </Field>
                <Field label="Slug (se genera automáticamente si se deja vacío)">
                  <Input
                    value={form.slug}
                    onChange={(_, d) => setForm((f) => ({ ...f, slug: d.value }))}
                    placeholder="padrón-de-rodados"
                  />
                </Field>
                <Field label="Descripción">
                  <Input
                    value={form.description}
                    onChange={(_, d) => setForm((f) => ({ ...f, description: d.value }))}
                  />
                </Field>
                <Field label="Ícono">
                  <Dropdown
                    value={ICON_OPTIONS.find((o) => o.value === form.icon_key)?.label ?? ''}
                    selectedOptions={[form.icon_key]}
                    onOptionSelect={(_, data) =>
                      setForm((f) => ({ ...f, icon_key: String(data.optionValue ?? 'document') }))
                    }
                  >
                    {ICON_OPTIONS.map((o) => (
                      <Option key={o.value} value={o.value}>
                        {o.label}
                      </Option>
                    ))}
                  </Dropdown>
                </Field>
                <Field label="Requisitos / notas visibles para el vecino">
                  <Input
                    value={form.requirements_text}
                    onChange={(_, d) => setForm((f) => ({ ...f, requirements_text: d.value }))}
                  />
                </Field>
                <div className="af-row" style={{ gap: 12, flexWrap: 'wrap' }}>
                  <Field label="Duración (min)">
                    <Input
                      type="number"
                      min={5}
                      max={480}
                      value={String(form.default_duration_minutes)}
                      onChange={(_, d) =>
                        setForm((f) => ({ ...f, default_duration_minutes: Number(d.value) || 0 }))
                      }
                    />
                  </Field>
                  <Field label="Orden">
                    <Input
                      type="number"
                      value={String(form.sort_order)}
                      onChange={(_, d) => setForm((f) => ({ ...f, sort_order: Number(d.value) || 0 }))}
                    />
                  </Field>
                </div>
                <div className="af-row" style={{ gap: 16, flexWrap: 'wrap' }}>
                  <Checkbox
                    label="Requiere padrón"
                    checked={form.requires_padron}
                    onChange={(_, d) => setForm((f) => ({ ...f, requires_padron: !!d.checked }))}
                  />
                  <Checkbox
                    label="Requiere matrícula"
                    checked={form.requires_matricula}
                    onChange={(_, d) => setForm((f) => ({ ...f, requires_matricula: !!d.checked }))}
                  />
                  <Checkbox
                    label="Requiere documento"
                    checked={form.requires_document}
                    onChange={(_, d) => setForm((f) => ({ ...f, requires_document: !!d.checked }))}
                  />
                  <Checkbox
                    label="Activo"
                    checked={form.is_active}
                    onChange={(_, d) => setForm((f) => ({ ...f, is_active: !!d.checked }))}
                  />
                </div>
                {errorMsg && (
                  <MessageBar intent="error">
                    <MessageBarBody>
                      <Body1>{errorMsg}</Body1>
                    </MessageBarBody>
                  </MessageBar>
                )}
                {upsert.isPending && <Spinner size="small" />}
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger>
                <Button appearance="subtle" icon={<Dismiss24Regular />} onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                icon={<Save24Regular />}
                onClick={() => upsert.mutate(form)}
                disabled={!form.name}
              >
                {editing ? 'Guardar cambios' : 'Crear tributo'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Eliminar tributo"
        message={
          confirmDelete
            ? `¿Seguro que querés eliminar "${confirmDelete.name}"? Si tiene turnos asociados se desactivará en lugar de eliminarse.`
            : ''
        }
        confirmLabel="Eliminar"
        destructive
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove.mutate(confirmDelete.id)}
      />
    </AdminLayout>
  );
}
