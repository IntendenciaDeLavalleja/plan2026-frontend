import { useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SimulatorTutorial } from '@/components/simulator/tutorial/SimulatorTutorial';

export function SimulatorTutorialPage() {
  useEffect(() => {
    document.title = 'Cómo usar el simulador | Plan 2026';
    return () => {
      document.title = 'Amnistía Financiera · Intendencia de Lavalleja';
    };
  }, []);

  return <PublicLayout><SimulatorTutorial /></PublicLayout>;
}
