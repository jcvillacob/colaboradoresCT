import { Egreso } from '../models/egreso.model';
import { MovimientoDTO, ReconciliacionParams, ReconciliacionResult } from '../models/movimiento.model';
import { round2 } from '../utils/number.utils';

export function cruzarEgresosConDocumentos(
  egresos: Egreso[],
  documentos: MovimientoDTO[],
  params: ReconciliacionParams = { tolerancia: 0, invertirSignoEgresos: true }
): ReconciliacionResult {
  const tol = params.tolerancia ?? 0;
  const inv = params.invertirSignoEgresos ?? true;

  const key = (c: string, f: string, v: number) => `${c}|${f}|${round2(v).toFixed(2)}`;

  const normCuenta = (x: any) => (x ?? '').toString().trim();
  const normFecha  = (x: any) => (x ?? '').toString().slice(0, 10);

  const docs = new Set(
    documentos.map(d => key(normCuenta(d.Cuenta), normFecha(d.Fecha), d.ValorTotal))
  );

  const egrs = new Set(
    egresos.map(e => {
      const raw = Number(e.VALOR);
      const val = inv ? -raw : raw;
      const cuenta = normCuenta(e.NROCTA || e.CUENTA || '');
      return key(cuenta, normFecha(e.FECHA), val);
    })
  );

  const cmpTol = (set: Set<string>, c: string, f: string, v: number) => {
    if (!tol) return set.has(key(c, f, v));
    const target = `${c}|${f}|`;
    // Busca coincidencias por cuenta/fecha y compara valor con tolerancia
    for (const k of set) {
      if (k.startsWith(target)) {
        const kv = parseFloat(k.split('|')[2]);
        if (Math.abs(kv - round2(v)) <= tol) return true;
      }
    }
    return false;
  };

  return {
    faltanEnDocumentos: egresos.filter(e => {
      const raw = Number(e.VALOR);
      const val = inv ? -raw : raw;
      const c = normCuenta(e.NROCTA || e.CUENTA || '');
      const f = normFecha(e.FECHA);
      return !cmpTol(docs, c, f, val);
    }),
    faltanEnEgresos: documentos.filter(d => {
      const c = normCuenta(d.Cuenta);
      const f = normFecha(d.Fecha);
      const v = d.ValorTotal;
      return !cmpTol(egrs, c, f, v);
    }),
  };
}
