// Soporta "1.234,56", "1,234.56", "1234.56", "(1.234,56)", "-1,234.56", etc.
export function parseMoneyFlexible(input: any): number {
  if (typeof input === 'number') return input;
  let s = (input ?? '').toString().trim();
  if (!s) return 0;

  // Paréntesis para negativos
  const isNeg = /^\(.*\)$/.test(s);
  if (isNeg) s = s.slice(1, -1);

  // Quitar moneda/espacios
  s = s.replace(/[^\d.,-]/g, '');

  // Si tiene ambos separadores, el último símbolo es el decimal
  const lastComma = s.lastIndexOf(',');
  const lastDot   = s.lastIndexOf('.');
  let decimalSep: ',' | '.' | null = null;

  if (lastComma !== -1 && lastDot !== -1) {
    decimalSep = lastComma > lastDot ? ',' : '.';
  } else if (lastComma !== -1) {
    // Si hay exactamente 3 dígitos detrás -> probablemente miles
    decimalSep = s.length - lastComma - 1 === 2 ? ',' : null;
  } else if (lastDot !== -1) {
    decimalSep = s.length - lastDot - 1 === 2 ? '.' : null;
  }

  // Quitar separadores de miles
  if (decimalSep === ',') {
    s = s.replace(/\./g, ''); // puntos = miles
    s = s.replace(',', '.');  // coma = decimal
  } else if (decimalSep === '.') {
    s = s.replace(/,/g, '');  // comas = miles
  } else {
    s = s.replace(/[.,](?=\d{3}\b)/g, ''); // grupos de miles
  }

  const v = parseFloat(s);
  return (isNeg ? -1 : 1) * (isNaN(v) ? 0 : v);
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
