export function excelSerialToIso(serial: number): string {
  let days = Math.floor(serial);
  if (days > 59) days -= 1; // bug Excel 1900
  const epoch = new Date(Date.UTC(1899, 11, 30));
  const d = new Date(epoch.getTime() + days * 86400000);
  return d.toISOString().slice(0, 10);
}

export function normalizarFecha8(txt: string): string {
  const digits = (txt ?? '').toString().replace(/[^\d]/g, '');
  if (digits.length !== 8) return (txt ?? '').toString().slice(0, 10);
  const y = parseInt(digits.slice(0, 4), 10);
  if (y >= 1900) return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
  return `${digits.slice(4,8)}-${digits.slice(2,4)}-${digits.slice(0,2)}`;
}

export function fechaFromExcelValue(value: any): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const num = Number(value);
  if (!isNaN(num) && /^\d+(\.\d+)?$/.test((value ?? '').toString())) return excelSerialToIso(num);
  return normalizarFecha8((value ?? '').toString());
}
