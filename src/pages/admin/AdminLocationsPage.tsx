import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Body1,
  Body1Strong,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Subtitle1,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from '@fluentui/react-components';
import { Add24Regular, Delete24Regular, Edit24Regular, Location24Regular, Save24Regular } from '@fluentui/react-icons';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminApi } from '@/services/adminApi';
import { ApiError } from '@/services/apiClient';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export function AdminLocationsPage() {
  const queryClient = useQueryClient();
  const locationsQuery = useQuery({
    queryKey: ['admin-locations'],
    queryFn: () => adminApi.listLocations(),
  });
  const locations = locationsQuery.data ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ id?: number; name: string; address: string; phone: string; is_active: boolean }>(
    { name: '', address: '', phone: '', is_active: true },
  );
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const create = useMutation({
    mutationFn: (payload: { name: string; address: string; phone: string; is_active: boolean }) =>
      adminApi.createLocation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      setDialogOpen(false);
      setEditing({ name: '', address: '', phone: '', is_active: true });
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'No se pudo crear la sede'),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name: string; address: string; phone: string; is_active: boolean } }) =>
      adminApi.updateLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      setDialogOpen(false);
      setEditing({ name: '', address: '', phone: '', is_active: true });
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'No se pudo actualizar la sede'),
  });

  const remove = useMutation({
    mutationFn: (id: number) => adminApi.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      setConfirmDelete(null);
    },
  });

  const openCreate = () => {
    setEditing({ name: '', address: '', phone: '', is_active: true });
    setError(null);
    setDialogOpen(true);
  };
  const openEdit = (loc: { id: number; name: string; address: string; phone: string; is_active: boolean }) => {
    setEditing({ ...loc });
    setError(null);
    setDialogOpen(true);
  };

  return (
    <AdminLayout
      pageTitle="Sedes"
      pageSubtitle="Lugares físicos donde se atiende al vecino"
      topActions={
        <Button appearance="primary" icon={<Add24Regular />} onClick={openCreate}>
          Nueva sede
        </Button>
      }
    >
      {locationsQuery.isLoading && <LoadingState label="Cargando sedes…" />}
      {locationsQuery.isError && <ErrorState onRetry={() => locationsQuery.refetch()} />}
      {locations.length > 0 && (
        <Card style={{ borderRadius: 16, overflow: 'auto' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nombre</TableHeaderCell>
                <TableHeaderCell>Dirección</TableHeaderCell>
                <TableHeaderCell>Teléfono</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <Body1Strong>{l.name}</Body1Strong>
                  </TableCell>
                  <TableCell>{l.address}</TableCell>
                  <TableCell>{l.phone}</TableCell>
                  <TableCell>{l.is_active ? 'Activa' : 'Inactiva'}</TableCell>
                  <TableCell>
                    <div className="af-row" style={{ gap: 4 }}>
                      <Button appearance="subtle" icon={<Edit24Regular />} onClick={() => openEdit(l)}>
                        Editar
                      </Button>
                      <Button appearance="subtle" icon={<Delete24Regular />} onClick={() => setConfirmDelete(l.id)}>
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
      {locations.length === 0 && !locationsQuery.isLoading && (
        <Card style={{ borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <div className="af-text-block" style={{ alignItems: 'center' }}>
            <Location24Regular style={{ fontSize: 48, color: 'var(--af-muted)' }} />
            <Subtitle1>No hay sedes registradas</Subtitle1>
            <Text className="af-muted">Creá al menos una sede para empezar a generar disponibilidad.</Text>
          </div>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={(_, d) => setDialogOpen(d.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{editing.id ? 'Editar sede' : 'Nueva sede'}</DialogTitle>
            <DialogContent>
              <div className="af-stack" style={{ gap: 12, minWidth: 360 }}>
                <Field label="Nombre *">
                  <Input
                    value={editing.name}
                    onChange={(_, d) => setEditing((e) => ({ ...e, name: d.value }))}
                  />
                </Field>
                <Field label="Dirección">
                  <Input
                    value={editing.address}
                    onChange={(_, d) => setEditing((e) => ({ ...e, address: d.value }))}
                  />
                </Field>
                <Field label="Teléfono">
                  <Input
                    value={editing.phone}
                    onChange={(_, d) => setEditing((e) => ({ ...e, phone: d.value }))}
                  />
                </Field>
                {error && (
                  <MessageBar intent="error">
                    <MessageBarBody>
                      <Body1>{error}</Body1>
                    </MessageBarBody>
                  </MessageBar>
                )}
                {create.isPending && <Spinner size="small" />}
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="subtle" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                appearance="primary"
                icon={<Save24Regular />}
                disabled={!editing.name || create.isPending || update.isPending}
                onClick={() => {
                  if (editing.id) update.mutate({ id: editing.id, payload: editing });
                  else create.mutate(editing);
                }}
              >
                {editing.id ? 'Guardar' : 'Crear'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Eliminar sede"
        message="¿Eliminar la sede seleccionada? Esta acción no se puede deshacer."
        destructive
        confirmLabel="Eliminar"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && remove.mutate(confirmDelete)}
      />
    </AdminLayout>
  );
}
