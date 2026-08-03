const EMPTY_VALUE = /^\s*$/;
const PLAIN_AMOUNT = /^\d+(?:[,.]\d{1,2})?$/;
const UY_THOUSANDS_AMOUNT = /^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/;

/**
 * Converts a positive Uruguayan currency input to integer cents.
 * Empty inputs are normalized to zero only after the syntax checks above.
 */
export function parseUyCurrency(value) {
  if (typeof value !== 'string') {
    throw new Error('El importe debe ser texto.');
  }

  const normalized = value.trim();
  if (EMPTY_VALUE.test(normalized)) {
    return 0n;
  }

  if (!PLAIN_AMOUNT.test(normalized) && !UY_THOUSANDS_AMOUNT.test(normalized)) {
    throw new Error('Ingresá un importe válido con hasta dos decimales.');
  }

  const usesUruguayanThousands = normalized.includes(',') && normalized.includes('.');
  let integerPart = normalized;
  let decimalPart = '';

  if (usesUruguayanThousands) {
    const parts = normalized.split(',');
    integerPart = parts[0].replaceAll('.', '');
    decimalPart = parts[1] ?? '';
  } else if (normalized.includes(',')) {
    const parts = normalized.split(',');
    integerPart = parts[0];
    decimalPart = parts[1] ?? '';
  } else if (normalized.includes('.') && !UY_THOUSANDS_AMOUNT.test(normalized)) {
    const parts = normalized.split('.');
    integerPart = parts[0];
    decimalPart = parts[1] ?? '';
  } else if (UY_THOUSANDS_AMOUNT.test(normalized)) {
    integerPart = normalized.replaceAll('.', '');
  }

  const centsPart = decimalPart.padEnd(2, '0');
  return BigInt(integerPart) * 100n + BigInt(centsPart || '0');
}

export function formatUyCurrency(cents) {
  if (typeof cents !== 'bigint') {
    throw new Error('El importe debe estar expresado en centésimos enteros.');
  }

  const isNegative = cents < 0n;
  const absoluteCents = isNegative ? -cents : cents;
  const pesos = absoluteCents / 100n;
  const decimals = (absoluteCents % 100n).toString().padStart(2, '0');
  const groupedPesos = pesos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${isNegative ? '-$' : '$'} ${groupedPesos},${decimals}`;
}

export function isValidUyCurrency(value) {
  try {
    parseUyCurrency(value);
    return true;
  } catch {
    return false;
  }
}
