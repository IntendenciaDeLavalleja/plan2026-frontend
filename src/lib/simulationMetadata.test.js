import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DebtInputs } from '../components/simulador/DebtInputs.jsx';
import { ModalityCard } from '../components/simulador/ModalityCard.jsx';
import { ResultSummary } from '../components/simulador/ResultSummary.jsx';
import { generateGeneralScenarios, generateSinglePropertyScenarios } from './amnistiaCalculator.js';
import {
  createSimulationSnapshot,
  formatSimulationDate,
  SIMULATION_DATE_NOTICE,
  SIMULATION_RESULT_NOTICE,
} from './simulationMetadata.js';

const DEBT = { principalDebtCents: 10000000n, finesCents: 2000000n, surchargesCents: 3000000n };

function findScenario(scenarios, id) {
  return scenarios.find((scenario) => scenario.id === id);
}

function renderWithRouter(element) {
  return renderToStaticMarkup(createElement(MemoryRouter, null, element));
}

describe('metadatos y avisos de fecha de simulación', () => {
  it('muestra el aviso completo antes del botón de cálculo sin agregar inputs', () => {
    const html = renderWithRouter(createElement(DebtInputs, {
      values: { principalDebt: '', fines: '', surcharges: '' },
      errors: {},
      preview: { originalDebtCents: 0n, discountableAmountCents: 0n },
      formMessage: '',
      principalDebtInputRef: null,
      onChange: () => {},
      onCalculate: () => {},
      onClear: () => {},
      onLoadExample: () => {},
    }));
    expect(html).toContain(SIMULATION_DATE_NOTICE.split('\n\n')[0]);
    expect(html.indexOf('El importe definitivo será')).toBeLessThan(html.indexOf('Calcular'));
    expect((html.match(/aria-label="(Deuda tributaria principal|Multas|Recargos)"/g) ?? [])).toHaveLength(3);
  });

  it('registra la fecha al calcular y no la altera al reutilizar el resultado', () => {
    const firstDate = new Date(2026, 6, 20);
    const snapshot = createSimulationSnapshot(DEBT, firstDate);
    firstDate.setDate(21);
    expect(formatSimulationDate(snapshot.simulationDate)).toBe('20/07/2026');
    expect(formatSimulationDate(snapshot.simulationDate)).toBe('20/07/2026');

    const nextSnapshot = createSimulationSnapshot(DEBT, new Date(2026, 6, 21));
    expect(formatSimulationDate(nextSnapshot.simulationDate)).toBe('21/07/2026');
  });

  it('muestra el aviso breve y la fecha en resultados generales y de vivienda propia', () => {
    const simulationDate = new Date(2026, 6, 20);
    const scenarios = [
      [findScenario(generateGeneralScenarios(DEBT), 'general-cash-cash'), 'general'],
      [findScenario(generateGeneralScenarios(DEBT), 'general-financedThirtySix-monthly-36'), 'general'],
      [findScenario(generateSinglePropertyScenarios(DEBT), 'singleProperty-cash-cash'), 'singleProperty'],
    ];
    for (const [scenario, regime] of scenarios) {
      const html = renderWithRouter(createElement(ResultSummary, { scenario, regime, simulationDate }));
      expect(html).toContain(SIMULATION_RESULT_NOTICE);
      expect(html).toContain('Fecha de la simulación');
      expect(html).toContain('20/07/2026');
      if (scenario.minimumDownPaymentCents > 0n) expect(html).toContain('Corresponde al 30% del total regularizado después de la quita.');
    }
  });

  it('conserva el aviso de Unidades Indexadas en una alternativa financiada', () => {
    const scenario = findScenario(generateGeneralScenarios(DEBT), 'general-financedThirtySix-monthly-36');
    const html = renderWithRouter(createElement(ModalityCard, {
      regime: 'general',
      modalityKey: 'financedThirtySix',
      scenarios: [scenario],
      selectedScenario: scenario,
      isActive: true,
      isExpanded: false,
      onActivate: () => {},
      onSelectScenario: () => {},
      onToggleAlternatives: () => {},
    }));
    expect(html).toContain('El saldo financiado será convertido a Unidades Indexadas al momento de suscribir el convenio.');
    const partialScenario = findScenario(generateGeneralScenarios(DEBT), 'general-partialTwo-monthly-2');
    const partialHtml = renderWithRouter(createElement(ModalityCard, {
      regime: 'general', modalityKey: 'partialTwo', scenarios: [partialScenario], selectedScenario: partialScenario,
      isActive: true, isExpanded: false, onActivate: () => {}, onSelectScenario: () => {}, onToggleAlternatives: () => {},
    }));
    expect(partialHtml).toContain('30% del total regularizado después de la quita.');
  });
});
