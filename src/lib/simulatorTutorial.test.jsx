import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SSRProvider } from '@fluentui/react-components';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../app/routes.tsx';
import { TutorialNavigation } from '../components/simulator/tutorial/TutorialNavigation.jsx';
import {
  getNextTutorialStepIndex,
  getPreviousTutorialStepIndex,
  isLastTutorialStep,
  SIMULATOR_CALCULATOR_PATH,
} from '../components/simulator/tutorial/tutorialState.js';
import { simulatorTutorialSteps } from '../config/simulatorTutorialContent.js';
import { AppThemeProvider } from '../providers/AppThemeProvider.tsx';

function renderRoute(initialEntry) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderToStaticMarkup(createElement(SSRProvider, null,
    createElement(AppThemeProvider, null,
      createElement(QueryClientProvider, { client: queryClient },
        createElement(MemoryRouter, { initialEntries: [initialEntry] }, createElement(AppRoutes))))));
}

describe('tutorial del simulador', () => {
  it('mantiene los ocho pasos detectados en el prototipo', () => {
    expect(simulatorTutorialSteps).toHaveLength(8);
    expect(simulatorTutorialSteps.map((step) => step.id)).toEqual([
      'inicio', 'consulta', 'padron', 'resumen', 'restar', 'campos', 'calcular', 'modalidades',
    ]);
  });

  it('/simulador muestra el primer paso, el progreso y la omisión', () => {
    const html = renderRoute('/simulador');
    expect(html).toContain('Guía para estimar una quita');
    expect(html).toContain('Estimá tu quita antes de venir a la Intendencia');
    expect(html).toContain('Paso 1 de 8');
    expect(html).toContain('Omitir explicación e ir al simulador');
    expect(SIMULATOR_CALCULATOR_PATH).toBe('/simulador/calcular');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('disabled=""');
  });

  it('conserva límites de anterior, siguiente y último paso', () => {
    expect(getPreviousTutorialStepIndex(0)).toBe(0);
    expect(getNextTutorialStepIndex(0, simulatorTutorialSteps.length)).toBe(1);
    expect(getNextTutorialStepIndex(7, simulatorTutorialSteps.length)).toBe(7);
    expect(isLastTutorialStep(6, simulatorTutorialSteps.length)).toBe(false);
    expect(isLastTutorialStep(7, simulatorTutorialSteps.length)).toBe(true);
  });

  it('muestra comenzar simulación exclusivamente en el último paso', () => {
    const firstStep = renderToStaticMarkup(createElement(TutorialNavigation, {
      isFirstStep: true, isLastStep: false, onPrevious: () => {}, onNext: () => {}, onStart: () => {},
    }));
    const lastStep = renderToStaticMarkup(createElement(TutorialNavigation, {
      isFirstStep: false, isLastStep: true, onPrevious: () => {}, onNext: () => {}, onStart: () => {},
    }));
    expect(firstStep).toContain('Siguiente');
    expect(firstStep).not.toContain('Comenzar simulación');
    expect(lastStep).toContain('Comenzar simulación');
    expect(lastStep).not.toContain('Siguiente');
  });

  it('incluye marcas accesibles y no usa imágenes sin alternativa', () => {
    const html = renderRoute('/simulador');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('aria-label="Progreso del tutorial"');
    expect(html).not.toContain('<img');
  });

  it('/simulador/calcular reutiliza el simulador y conserva sus tres inputs', () => {
    const html = renderRoute('/simulador/calcular');
    expect(html).toContain('Simulador de quita de deudas');
    expect(html).toContain('Deuda tributaria principal');
    expect(html).toContain('Multas');
    expect(html).toContain('Recargos');
    expect(html).toContain('Ver cómo funciona el simulador');
    expect(html).toContain('href="/simulador"');
  });
});
