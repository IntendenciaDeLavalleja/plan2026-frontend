import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppointmentWizard } from '@/components/appointments/AppointmentWizard';

export function BookAppointmentPage() {
  return (
    <PublicLayout>
      <AppointmentWizard />
    </PublicLayout>
  );
}
