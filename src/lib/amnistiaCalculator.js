import { AMNISTIA_RULES } from '../config/amnistiaRules.js';

const BPS_SCALE = 10000n;
const HALF_UP_OFFSET = 5000n;

function assertNonNegativeCents(value, label) {
  if (typeof value !== 'bigint' || value < 0n) {
    throw new Error(`${label} debe ser un importe no negativo en centésimos.`);
  }
}

function assertInstallmentCount(installmentCount) {
  if (!Number.isInteger(installmentCount) || installmentCount < 1) {
    throw new Error('La cantidad de cuotas debe ser un entero positivo.');
  }
}

function assertDebt(debt) {
  for (const field of AMNISTIA_RULES.debtFields) {
    assertNonNegativeCents(debt?.[field], field);
  }
}

export function sumOriginalDebt(debt) {
  assertDebt(debt);
  return debt.principalDebtCents + debt.finesCents + debt.surchargesCents;
}

export function sumDiscountableConcepts(debt) {
  assertDebt(debt);
  return debt.finesCents + debt.surchargesCents;
}

export function sumNonDiscountableConcepts(debt) {
  assertDebt(debt);
  return debt.principalDebtCents;
}

export function calculateDiscount(amountCents, discountBps) {
  assertNonNegativeCents(amountCents, 'El monto bonificable');
  if (!Number.isInteger(discountBps) || discountBps < 0 || discountBps > 10000) {
    throw new Error('El porcentaje de quita es inválido.');
  }
  return (amountCents * BigInt(discountBps) + HALF_UP_OFFSET) / BPS_SCALE;
}

// Hacienda defines the minimum payment as 30% of the amount remaining after the discount.
export function calculateMinimumDownPaymentFromRegularizedTotal(regularizedTotalCents, downPaymentBps) {
  assertNonNegativeCents(regularizedTotalCents, 'El total regularizado');
  if (!Number.isInteger(downPaymentBps) || downPaymentBps < 0 || downPaymentBps > 10000) {
    throw new Error('El porcentaje de entrega inicial es inválido.');
  }
  return (regularizedTotalCents * BigInt(downPaymentBps) + (BPS_SCALE - 1n)) / BPS_SCALE;
}

export function distributeExactly(totalCents, installmentCount) {
  assertNonNegativeCents(totalCents, 'El saldo financiado');
  assertInstallmentCount(installmentCount);
  if (totalCents === 0n) {
    throw new Error('No se pueden generar cuotas sin saldo financiado.');
  }

  const count = BigInt(installmentCount);
  const baseInstallment = totalCents / count;
  const remainder = totalCents % count;
  const installments = Array.from({ length: installmentCount }, (_, index) => (
    BigInt(index) < remainder ? baseInstallment + 1n : baseInstallment
  ));

  const sum = installments.reduce((total, installment) => total + installment, 0n);
  const highest = installments[0];
  const lowest = installments[installments.length - 1];
  if (sum !== totalCents || highest - lowest > 1n || installments.some((value) => value <= 0n)) {
    throw new Error('No fue posible distribuir el saldo de forma exacta.');
  }
  return installments;
}

function selectionIsAllowed(modality, periodicity, installmentCount) {
  if (modality.financing === null) {
    return periodicity === null && installmentCount === 0;
  }
  const range = periodicity === 'monthly' ? modality.monthlyRange : modality.quarterlyRange;
  return Boolean(range)
    && Number.isInteger(installmentCount)
    && installmentCount >= range[0]
    && installmentCount <= range[1];
}

function effectiveInstallmentCount(financedBalanceCents, requestedInstallmentCount) {
  if (financedBalanceCents === 0n) return 0;
  return financedBalanceCents < BigInt(requestedInstallmentCount)
    ? Number(financedBalanceCents)
    : requestedInstallmentCount;
}

function calculateFromRule({ debt, regime, modalityKey, modality, discountBps, periodicity = null, installmentCount = 0 }) {
  assertDebt(debt);
  if (!selectionIsAllowed(modality, periodicity, installmentCount)) {
    throw new Error('La periodicidad o cantidad de cuotas no corresponde a la modalidad.');
  }

  const originalDebtCents = sumOriginalDebt(debt);
  const discountableAmountCents = sumDiscountableConcepts(debt);
  const nonDiscountableAmountCents = sumNonDiscountableConcepts(debt);
  const discountCents = calculateDiscount(discountableAmountCents, discountBps);
  const remainingFinesAndSurchargesCents = discountableAmountCents - discountCents;
  const regularizedTotalCents = nonDiscountableAmountCents + remainingFinesAndSurchargesCents;
  const isCash = periodicity === null;
  const minimumDownPaymentCents = modality.requiresDownPayment
    ? calculateMinimumDownPaymentFromRegularizedTotal(regularizedTotalCents, AMNISTIA_RULES.downPaymentBps)
    : 0n;
  const effectiveDownPaymentCents = isCash
    ? regularizedTotalCents
    : (minimumDownPaymentCents > regularizedTotalCents ? regularizedTotalCents : minimumDownPaymentCents);
  const financedBalanceCents = regularizedTotalCents - effectiveDownPaymentCents;
  const actualInstallmentCount = effectiveInstallmentCount(financedBalanceCents, installmentCount);
  const installments = financedBalanceCents > 0n
    ? distributeExactly(financedBalanceCents, actualInstallmentCount)
    : [];

  return {
    id: isCash ? `${regime}-${modalityKey}-cash` : `${regime}-${modalityKey}-${periodicity}-${installmentCount}`,
    regime,
    modality: modalityKey,
    modalityLabel: modality.label,
    discountBps,
    principalDebtCents: debt.principalDebtCents,
    finesCents: debt.finesCents,
    surchargesCents: debt.surchargesCents,
    originalDebtCents,
    discountableAmountCents,
    nonDiscountableAmountCents,
    discountCents,
    savingsCents: discountCents,
    remainingFinesAndSurchargesCents,
    regularizedTotalCents,
    minimumDownPaymentCents,
    effectiveDownPaymentCents,
    financedBalanceCents,
    periodicity,
    installmentCount: actualInstallmentCount,
    requestedInstallmentCount: isCash ? 0 : installmentCount,
    installments,
  };
}

function generateRangeScenarios({ debt, regime, modalityKey, modality, discountBps }) {
  const scenarios = [];
  for (const [periodicity, range] of [['monthly', modality.monthlyRange], ['quarterly', modality.quarterlyRange]]) {
    if (!range) continue;
    for (let installmentCount = range[0]; installmentCount <= range[1]; installmentCount += 1) {
      scenarios.push(calculateFromRule({ debt, regime, modalityKey, modality, discountBps, periodicity, installmentCount }));
    }
  }
  return scenarios;
}

export function calculateScenario({ debt, regime, modalityKey, periodicity = null, installmentCount = 0 }) {
  const modality = AMNISTIA_RULES.regimes.general.modalities[modalityKey];
  if (!modality || !AMNISTIA_RULES.regimes[regime]) throw new Error('La modalidad o el régimen no existe.');
  const discountBps = regime === 'singleProperty'
    ? AMNISTIA_RULES.regimes.singleProperty.overrideDiscountBps
    : modality.discountBps;
  return calculateFromRule({ debt, regime, modalityKey, modality, discountBps, periodicity, installmentCount });
}

function generateScenarios(debt, regime, overrideDiscountBps = null) {
  assertDebt(debt);
  return Object.entries(AMNISTIA_RULES.regimes.general.modalities).flatMap(([modalityKey, modality]) => {
    const discountBps = overrideDiscountBps ?? modality.discountBps;
    return modality.financing === null
      ? [calculateFromRule({ debt, regime, modalityKey, modality, discountBps })]
      : generateRangeScenarios({ debt, regime, modalityKey, modality, discountBps });
  });
}

export function generateGeneralScenarios(debt) {
  return generateScenarios(debt, 'general');
}

export function generateSinglePropertyScenarios(debt) {
  return generateScenarios(debt, 'singleProperty', AMNISTIA_RULES.regimes.singleProperty.overrideDiscountBps);
}

export function validateScenarioTotals(scenario) {
  const errors = [];
  const moneyFields = [
    'principalDebtCents', 'finesCents', 'surchargesCents', 'originalDebtCents', 'discountableAmountCents',
    'nonDiscountableAmountCents', 'discountCents', 'savingsCents', 'remainingFinesAndSurchargesCents',
    'regularizedTotalCents', 'minimumDownPaymentCents', 'effectiveDownPaymentCents', 'financedBalanceCents',
  ];
  for (const field of moneyFields) {
    if (typeof scenario?.[field] !== 'bigint' || scenario[field] < 0n) errors.push(`${field} es inválido.`);
  }
  if (scenario?.originalDebtCents !== scenario?.principalDebtCents + scenario?.finesCents + scenario?.surchargesCents) {
    errors.push('El total original no coincide con sus conceptos.');
  }
  if (scenario?.discountableAmountCents !== scenario?.finesCents + scenario?.surchargesCents) {
    errors.push('La base bonificable no coincide con multas y recargos.');
  }
  if (scenario?.discountCents + scenario?.remainingFinesAndSurchargesCents !== scenario?.discountableAmountCents) {
    errors.push('La quita y los conceptos restantes no coinciden.');
  }
  if (scenario?.principalDebtCents + scenario?.remainingFinesAndSurchargesCents !== scenario?.regularizedTotalCents) {
    errors.push('El total regularizado no conserva la deuda principal.');
  }
  if (scenario?.savingsCents !== scenario?.discountCents) errors.push('El ahorro no coincide con la quita.');
  if (scenario?.effectiveDownPaymentCents + scenario?.financedBalanceCents !== scenario?.regularizedTotalCents) {
    errors.push('La entrega efectiva y el saldo no coinciden con el total regularizado.');
  }
  if (scenario?.periodicity !== null
    && scenario?.minimumDownPaymentCents + scenario?.financedBalanceCents !== scenario?.regularizedTotalCents) {
    errors.push('La entrega mínima y el saldo no coinciden con el total regularizado.');
  }
  if (scenario?.periodicity === null) {
    if (scenario.installmentCount !== 0 || scenario.requestedInstallmentCount !== 0 || scenario.installments.length !== 0 || scenario.financedBalanceCents !== 0n) {
      errors.push('El pago al contado contiene financiación.');
    }
  } else {
    const installmentsTotal = scenario.installments.reduce((total, value) => total + value, 0n);
    if (scenario.financedBalanceCents === 0n && scenario.installments.length !== 0) errors.push('Hay cuotas sin saldo financiado.');
    if (scenario.financedBalanceCents > 0n && scenario.installments.length !== scenario.installmentCount) errors.push('La cantidad de cuotas no coincide.');
    if (installmentsTotal !== scenario.financedBalanceCents) errors.push('Las cuotas no suman el saldo financiado.');
    if (scenario.installments.some((value) => typeof value !== 'bigint' || value <= 0n)) errors.push('Hay cuotas inválidas.');
    if (scenario.installments.length > 0) {
      const highest = scenario.installments[0];
      const lowest = scenario.installments[scenario.installments.length - 1];
      if (highest - lowest > 1n) errors.push('La diferencia entre cuotas supera un centésimo.');
    }
  }
  return { isValid: errors.length === 0, errors };
}
