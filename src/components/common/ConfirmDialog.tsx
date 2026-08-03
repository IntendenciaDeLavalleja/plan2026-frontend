import {
  Body1Strong,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components';
import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  destructive,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(_, data) => (!data.open ? onCancel() : null)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Body1Strong style={{ fontWeight: 'normal' }}>{message}</Body1Strong>
          </DialogContent>
          <DialogActions>
            <DialogTrigger>
              <Button appearance="subtle" onClick={onCancel}>
                {cancelLabel}
              </Button>
            </DialogTrigger>
            <Button
              appearance="primary"
              onClick={onConfirm}
              style={destructive ? { background: 'var(--af-danger)' } : undefined}
            >
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
