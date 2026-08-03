import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { RequireAdmin } from '@/app/RequireAdmin';
import { HomePage } from '@/pages/public/HomePage';
import { BookAppointmentPage } from '@/pages/public/BookAppointmentPage';
import { AppointmentLookupPage } from '@/pages/public/AppointmentLookupPage';
import { RequirementsPage } from '@/pages/public/RequirementsPage';
import { SimuladorPage } from '@/pages/SimuladorPage';
import { SimulatorTutorialPage } from '@/pages/simulator/SimulatorTutorialPage';
import { FaqPage } from '@/pages/FaqPage';
import { AdminLoginPage } from '@/pages/auth/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminTributeTypesPage } from '@/pages/admin/AdminTributeTypesPage';
import { AdminAvailabilityPage } from '@/pages/admin/AdminAvailabilityPage';
import { AdminAppointmentsPage } from '@/pages/admin/AdminAppointmentsPage';
import { AdminPhoneBookingPage } from '@/pages/admin/AdminPhoneBookingPage';
import { AdminLocationsPage } from '@/pages/admin/AdminLocationsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/agendar" element={<BookAppointmentPage />} />
      <Route path="/consultar" element={<AppointmentLookupPage />} />
      <Route path="/requisitos" element={<RequirementsPage />} />
      <Route path="/simulador" element={<SimulatorTutorialPage />} />
      <Route path="/simulador/calcular" element={<SimuladorPage />} />
      <Route path="/preguntas-frecuentes" element={<FaqPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="" element={<ProtectedAdminPage element={<AdminDashboardPage />} />} />
        <Route path="tributos" element={<ProtectedAdminPage element={<AdminTributeTypesPage />} />} />
        <Route path="disponibilidad" element={<ProtectedAdminPage element={<AdminAvailabilityPage />} />} />
        <Route path="turnos" element={<ProtectedAdminPage element={<AdminAppointmentsPage />} />} />
        <Route path="registrar-turno" element={<ProtectedAdminPage element={<AdminPhoneBookingPage />} />} />
        <Route path="sedes" element={<ProtectedAdminPage element={<AdminLocationsPage />} />} />
        <Route path="configuracion" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

function ProtectedAdminPage({ element }: { element: React.ReactNode }) {
  return <RequireAdmin>{element}</RequireAdmin>;
}
