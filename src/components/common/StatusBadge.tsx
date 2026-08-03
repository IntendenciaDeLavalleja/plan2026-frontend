import { Badge } from '@fluentui/react-components';
import type { AppointmentStatus } from '@/types/api';

const STATUS_COLORS: Record<AppointmentStatus, { color: 'success' | 'warning' | 'danger' | 'informative' | 'subtle'; label: string }> = {
  reserved: { color: 'warning', label: 'Reservado' },
  confirmed: { color: 'informative', label: 'Confirmado' },
  attended: { color: 'success', label: 'Atendido' },
  cancelled: { color: 'subtle', label: 'Cancelado' },
  no_show: { color: 'danger', label: 'No asistió' },
};

interface Props {
  status: AppointmentStatus;
}

export function StatusBadge({ status }: Props) {
  const conf = STATUS_COLORS[status] ?? { color: 'subtle' as const, label: status };
  return <Badge color={conf.color}>{conf.label}</Badge>;
}
