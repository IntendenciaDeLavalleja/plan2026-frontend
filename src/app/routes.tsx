import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/public/HomePage';
import { BookAppointmentPage } from '@/pages/public/BookAppointmentPage';
import { AppointmentLookupPage } from '@/pages/public/AppointmentLookupPage';
import { RequirementsPage } from '@/pages/public/RequirementsPage';
import { SimuladorPage } from '@/pages/SimuladorPage';
import { SimulatorTutorialPage } from '@/pages/simulator/SimulatorTutorialPage';
import { FaqPage } from '@/pages/FaqPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/agendar" element={<BookAppointmentPage />} />
      <Route path="/consultar" element={<AppointmentLookupPage />} />
      <Route path="/requisitos" element={<RequirementsPage />} />
      <Route path="/simulador" element={<SimulatorTutorialPage />} />
      <Route path="/simulador/calcular" element={<SimuladorPage />} />
      <Route path="/preguntas-frecuentes" element={<FaqPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
