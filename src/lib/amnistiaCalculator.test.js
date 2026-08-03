import { describe, expect, it } from 'vitest';
import { AMNISTIA_RULES, DOWN_PAYMENT_BASE } from '../config/amnistiaRules.js';
import { formatUyCurrency, parseUyCurrency } from './currency.js';
import {
  calculateMinimumDownPaymentFromRegularizedTotal,
  calculateScenario,
  distributeExactly,
  generateGeneralScenarios,
  generateSinglePropertyScenarios,
  sumDiscountableConcepts,
  sumOriginalDebt,
  validateScenarioTotals,
} from './amnistiaCalculator.js';

const MAIN_DEBT = Object.freeze({
  principalDebtCents: 10000000n,
  finesCents: 2000000n,
  surchargesCents: 3000000n,
});

function findScenario(scenarios, id) {
  const scenario = scenarios.find((item) => item.id === id);
  if (!scenario) throw new Error(`No existe el escenario ${id}`);
  return scenario;
}

describe('motor de cálculo de amnistía', () => {
  it('calcula contado con quita exclusiva sobre multas y recargos', () => {
    const scenario = findScenario(generateGeneralScenarios(MAIN_DEBT), 'general-cash-cash');
    expect(sumOriginalDebt(MAIN_DEBT)).toBe(15000000n);
    expect(sumDiscountableConcepts(MAIN_DEBT)).toBe(5000000n);
    expect(scenario.discountCents).toBe(3500000n);
    expect(scenario.remainingFinesAndSurchargesCents).toBe(1500000n);
    expect(scenario.regularizedTotalCents).toBe(11500000n);
    expect(scenario.effectiveDownPaymentCents).toBe(11500000n);
    expect(scenario.financedBalanceCents).toBe(0n);
    expect(scenario.installments).toEqual([]);
  });

  it('calcula entrega y hasta dos cuotas sobre el total regularizado', () => {
    const scenario = findScenario(generateGeneralScenarios(MAIN_DEBT), 'general-partialTwo-monthly-2');
    expect(scenario.discountCents).toBe(3000000n);
    expect(scenario.regularizedTotalCents).toBe(12000000n);
    expect(scenario.minimumDownPaymentCents).toBe(3600000n);
    expect(scenario.effectiveDownPaymentCents).toBe(3600000n);
    expect(scenario.financedBalanceCents).toBe(8400000n);
    expect(scenario.installments).toEqual([4200000n, 4200000n]);
  });

  it('calcula planes largos con entrega y conserva la distribución exacta', () => {
    const scenarios = generateGeneralScenarios(MAIN_DEBT);
    const monthly = findScenario(scenarios, 'general-partialThirtySix-monthly-36');
    const quarterly = findScenario(scenarios, 'general-partialThirtySix-quarterly-12');
    for (const scenario of [monthly, quarterly]) {
      expect(scenario.discountCents).toBe(2500000n);
      expect(scenario.regularizedTotalCents).toBe(12500000n);
      expect(scenario.minimumDownPaymentCents).toBe(3750000n);
      expect(scenario.financedBalanceCents).toBe(8750000n);
      expect(scenario.installments.reduce((total, value) => total + value, 0n)).toBe(8750000n);
    }
    expect(monthly.installments).toHaveLength(36);
    expect(quarterly.installments).toHaveLength(12);
  });

  it('calcula financiación sin entrega inicial', () => {
    const scenarios = generateGeneralScenarios(MAIN_DEBT);
    for (const id of ['general-financedThirtySix-monthly-36', 'general-financedThirtySix-quarterly-12']) {
      const scenario = findScenario(scenarios, id);
      expect(scenario.discountCents).toBe(2000000n);
      expect(scenario.regularizedTotalCents).toBe(13000000n);
      expect(scenario.effectiveDownPaymentCents).toBe(0n);
      expect(scenario.financedBalanceCents).toBe(13000000n);
    }
  });

  it('aplica exactamente 80% para vivienda propia, sin acumular descuentos', () => {
    const scenarios = generateSinglePropertyScenarios(MAIN_DEBT);
    const cash = findScenario(scenarios, 'singleProperty-cash-cash');
    const partial = findScenario(scenarios, 'singleProperty-partialTwo-monthly-2');
    expect(cash.discountBps).toBe(8000);
    expect(cash.discountCents).toBe(4000000n);
    expect(cash.regularizedTotalCents).toBe(11000000n);
    expect(partial.minimumDownPaymentCents).toBe(3300000n);
    expect(partial.effectiveDownPaymentCents).toBe(3300000n);
    expect(partial.financedBalanceCents).toBe(7700000n);
  });

  it('nunca aplica quita a la deuda principal', () => {
    const onlyPrincipal = { principalDebtCents: 10000000n, finesCents: 0n, surchargesCents: 0n };
    const onlyFines = { principalDebtCents: 10000000n, finesCents: 1000000n, surchargesCents: 0n };
    const onlySurcharges = { principalDebtCents: 10000000n, finesCents: 0n, surchargesCents: 1000000n };
    const higherPrincipal = { principalDebtCents: 20000000n, finesCents: 1000000n, surchargesCents: 0n };
    expect(findScenario(generateGeneralScenarios(onlyPrincipal), 'general-cash-cash').regularizedTotalCents).toBe(10000000n);
    expect(findScenario(generateGeneralScenarios(onlyFines), 'general-cash-cash').discountCents).toBe(700000n);
    expect(findScenario(generateGeneralScenarios(onlyFines), 'general-cash-cash').regularizedTotalCents).toBe(10300000n);
    expect(findScenario(generateGeneralScenarios(onlySurcharges), 'general-cash-cash').discountCents).toBe(700000n);
    expect(findScenario(generateGeneralScenarios(onlySurcharges), 'general-cash-cash').regularizedTotalCents).toBe(10300000n);
    expect(findScenario(generateGeneralScenarios(higherPrincipal), 'general-cash-cash').discountCents).toBe(700000n);
  });

  it('genera 99 alternativas por régimen y conserva sus invariantes', () => {
    const scenarios = [...generateGeneralScenarios(MAIN_DEBT), ...generateSinglePropertyScenarios(MAIN_DEBT)];
    expect(scenarios).toHaveLength(198);
    expect(scenarios.every((scenario) => validateScenarioTotals(scenario).isValid)).toBe(true);
  });

  it('mantiene alternativas válidas para 1, 2, 3, 12, 13 y 36 cuotas', () => {
    const requests = [
      ['partialTwo', 'monthly', 1],
      ['partialTwo', 'monthly', 2],
      ['partialThirtySix', 'monthly', 3],
      ['partialThirtySix', 'quarterly', 12],
      ['partialThirtySix', 'monthly', 13],
      ['financedThirtySix', 'monthly', 36],
    ];
    for (const [modalityKey, periodicity, installmentCount] of requests) {
      const scenario = calculateScenario({ debt: MAIN_DEBT, regime: 'general', modalityKey, periodicity, installmentCount });
      expect(scenario.requestedInstallmentCount).toBe(installmentCount);
      expect(validateScenarioTotals(scenario).isValid).toBe(true);
    }
  });

  it('no crea cuotas de cero cuando la entrega cubre el total regularizado', () => {
    const debt = { principalDebtCents: 0n, finesCents: 1n, surchargesCents: 0n };
    const scenario = findScenario(generateSinglePropertyScenarios(debt), 'singleProperty-partialTwo-monthly-2');
    expect(scenario.minimumDownPaymentCents).toBe(0n);
    expect(scenario.regularizedTotalCents).toBe(0n);
    expect(scenario.effectiveDownPaymentCents).toBe(0n);
    expect(scenario.financedBalanceCents).toBe(0n);
    expect(scenario.installments).toEqual([]);
    expect(validateScenarioTotals(scenario).isValid).toBe(true);
  });

  it('usa la misma entrega cuando el total regularizado coincide aunque cambie la deuda original', () => {
    const noDiscountableAmounts = { principalDebtCents: 700000n, finesCents: 0n, surchargesCents: 0n };
    const mixedAmounts = { principalDebtCents: 660000n, finesCents: 100000n, surchargesCents: 0n };
    const first = findScenario(generateGeneralScenarios(noDiscountableAmounts), 'general-partialTwo-monthly-2');
    const second = findScenario(generateGeneralScenarios(mixedAmounts), 'general-partialTwo-monthly-2');
    expect(first.originalDebtCents).toBe(700000n);
    expect(second.originalDebtCents).toBe(760000n);
    expect(first.regularizedTotalCents).toBe(700000n);
    expect(second.regularizedTotalCents).toBe(700000n);
    expect(first.minimumDownPaymentCents).toBe(210000n);
    expect(second.minimumDownPaymentCents).toBe(210000n);
  });

  it('valida franjas, distribución y redondeos', () => {
    expect(calculateMinimumDownPaymentFromRegularizedTotal(10001n, 3000)).toBe(3001n);
    expect(distributeExactly(10000n, 3)).toEqual([3334n, 3333n, 3333n]);
    expect(() => distributeExactly(0n, 1)).toThrow();
    expect(() => calculateScenario({ debt: MAIN_DEBT, regime: 'general', modalityKey: 'partialTwo', periodicity: 'monthly', installmentCount: 3 })).toThrow();
    expect(() => calculateScenario({ debt: MAIN_DEBT, regime: 'general', modalityKey: 'partialThirtySix', periodicity: 'monthly', installmentCount: 37 })).toThrow();
    expect(() => calculateScenario({ debt: MAIN_DEBT, regime: 'general', modalityKey: 'partialThirtySix', periodicity: 'quarterly', installmentCount: 13 })).toThrow();
  });

  it('reduce la cantidad efectiva cuando el saldo no alcanza para cuotas positivas', () => {
    const debt = { principalDebtCents: 0n, finesCents: 2n, surchargesCents: 0n };
    const scenario = findScenario(generateGeneralScenarios(debt), 'general-financedThirtySix-monthly-36');
    expect(scenario.requestedInstallmentCount).toBe(36);
    expect(scenario.installmentCount).toBe(1);
    expect(scenario.installments).toEqual([1n]);
  });

  it('calcula el ejemplo de total regularizado $7.000 en dos cuotas exactas', () => {
    const debt = { principalDebtCents: 500000n, finesCents: 500000n, surchargesCents: 0n };
    const scenario = findScenario(generateGeneralScenarios(debt), 'general-partialTwo-monthly-2');
    expect(scenario.discountCents).toBe(300000n);
    expect(scenario.regularizedTotalCents).toBe(700000n);
    expect(scenario.minimumDownPaymentCents).toBe(210000n);
    expect(scenario.financedBalanceCents).toBe(490000n);
    expect(scenario.installments).toEqual([245000n, 245000n]);
  });

  it('acepta importes vacíos como cero y rechaza formatos no válidos', () => {
    expect(parseUyCurrency('')).toBe(0n);
    expect(parseUyCurrency('1.669,77')).toBe(166977n);
    for (const value of ['-1', 'abc', '1e10', '12,345']) expect(() => parseUyCurrency(value)).toThrow();
  });

  it('soporta deuda cero en el motor sin crear cuotas ni importes negativos', () => {
    const zeroDebt = { principalDebtCents: 0n, finesCents: 0n, surchargesCents: 0n };
    const scenarios = generateGeneralScenarios(zeroDebt);
    expect(scenarios).toHaveLength(99);
    expect(scenarios.every((scenario) => scenario.installments.length === 0)).toBe(true);
    expect(scenarios.every((scenario) => validateScenarioTotals(scenario).isValid)).toBe(true);
    expect(() => generateGeneralScenarios({ ...zeroDebt, finesCents: -1n })).toThrow();
  });

  it('conserva precisión BigInt en importes extremadamente grandes', () => {
    const large = 9007199254740993123456789n;
    const scenario = findScenario(generateGeneralScenarios({ principalDebtCents: large, finesCents: 1n, surchargesCents: 0n }), 'general-cash-cash');
    expect(scenario.principalDebtCents).toBe(large);
    expect(scenario.discountCents).toBe(1n);
    expect(validateScenarioTotals(scenario).isValid).toBe(true);
    expect(formatUyCurrency(large)).toContain('$');
  });

  it('mantiene las constantes normativas centralizadas', () => {
    expect(AMNISTIA_RULES.downPaymentBps).toBe(3000);
    expect(AMNISTIA_RULES.downPaymentBase).toBe(DOWN_PAYMENT_BASE);
    expect(AMNISTIA_RULES.regimes.general.modalities.cash.discountBps).toBe(7000);
    expect(AMNISTIA_RULES.regimes.singleProperty.overrideDiscountBps).toBe(8000);
  });
});
