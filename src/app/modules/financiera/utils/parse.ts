export function excelSerialToIso(serial: number): string {
  let days = Math.floor(serial);
  if (days > 59) days -= 1;
  const epoch = new Date(Date.UTC(1899, 11, 30));
  const d = new Date(epoch.getTime() + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export function formatearFecha(value: any): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const num = Number(value);
  if (!isNaN(num) && /^\d+(\.\d+)?$/.test(value.toString())) {
    return excelSerialToIso(num);
  }
  return normalizarFecha8(value.toString());
}

export function parsearNumeroExcel(v: any): number {
  if (typeof v === 'number') return v;
  const limpio = v.toString().replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(limpio) || 0;
}

export function parsearNumeroCsv(v: any): number {
  if (typeof v === 'number') return v;
  return parseFloat(v.toString().trim()) || 0;
}

export function normalizarFecha8(txt: string): string {
  const digits = txt.replace(/[^\d]/g, '');
  if (digits.length !== 8) return txt.trim();

  const maybeYear = parseInt(digits.slice(0, 4), 10);
  if (maybeYear >= 1900) {
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    return `${y}-${m}-${d}`;
  } else {
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);
    return `${y}-${m}-${d}`;
  }
}
