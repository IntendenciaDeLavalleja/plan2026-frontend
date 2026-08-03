import { Button, Card, Text } from '@fluentui/react-components';
import { CalendarMonth24Regular } from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { AppointmentWizard } from '@/components/appointments/AppointmentWizard';
import { AdminLayout } from '@/components/layout/AdminLayout';

export function AdminPhoneBookingPage() {
  return (
    <AdminLayout
      pageTitle="Registrar turno por teléfono"
      pageSubtitle="Cargá la reserva de un vecino que llama por teléfono y necesita agendarse"
      topActions={
        <Link to="/admin/turnos" style={{ textDecoration: 'none' }}>
          <Button appearance="subtle" icon={<CalendarMonth24Regular />}>
            Ver agenda
          </Button>
        </Link>
      }
    >
      <Card style={{ borderRadius: 16, padding: 0 }}>
        <div className="af-stack" style={{ padding: 24, paddingBottom: 0 }}>
          <Text className="af-muted">
            Este formulario permite registrar manualmente una reserva para una persona
            que se comunica por teléfono. Completá el trámite, el horario y los datos
            del titular igual que en la reserva pública.
          </Text>
        </div>
        <AppointmentWizard
          breadcrumbItems={['Panel', 'Registrar turno']}
          title="Registrar una reserva asistida"
          description="Seleccioná el tributo, elegí día y hora y cargá los datos del vecino para dejar el turno confirmado desde el panel administrativo."
          cancelTo="/admin/turnos"
          cancelLabel="Cancelar y volver a turnos"
          successReturnTo="/admin/turnos"
          successReturnLabel="Volver a la agenda"
        />
      </Card>
    </AdminLayout>
  );
}