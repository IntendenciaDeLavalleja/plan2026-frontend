export const DOWN_PAYMENT_BASE = 'REGULARIZED_TOTAL';

export const AMNISTIA_RULES = Object.freeze({
  policyVersion: 'AMNISTIA_LAVALLEJA_V1',
  debtFields: ['principalDebtCents', 'finesCents', 'surchargesCents'],
  downPaymentBps: 3000,
  downPaymentBase: DOWN_PAYMENT_BASE,
  discountRounding: 'HALF_UP_AGGREGATED',
  downPaymentRounding: 'CEILING',
  regimes: {
    general: {
      label: 'Régimen general',
      modalities: {
        cash: {
          label: 'Pago al contado',
          discountBps: 7000,
          requiresDownPayment: false,
          financing: null,
        },
        partialTwo: {
          label: 'Entrega inicial y saldo hasta en 2 cuotas',
          discountBps: 6000,
          requiresDownPayment: true,
          monthlyRange: [1, 2],
        },
        partialThirtySix: {
          label: 'Entrega inicial y saldo hasta en 36 cuotas',
          discountBps: 5000,
          requiresDownPayment: true,
          monthlyRange: [1, 36],
          quarterlyRange: [1, 12],
        },
        financedThirtySix: {
          label: 'Pago hasta en 36 cuotas',
          discountBps: 4000,
          requiresDownPayment: false,
          monthlyRange: [1, 36],
          quarterlyRange: [1, 12],
        },
      },
    },
    singleProperty: {
      label: 'Vivienda propia',
      overrideDiscountBps: 8000,
    },
  },
});

export const PERIODICITY_LABELS = Object.freeze({
  monthly: 'Mensual',
  quarterly: 'Trimestral',
});
