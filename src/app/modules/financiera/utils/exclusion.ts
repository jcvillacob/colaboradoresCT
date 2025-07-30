import EXCLUDE_PATTERNS_JSON from './conceptos-excluir.json';

export const EXCLUDE_PATTERNS = (EXCLUDE_PATTERNS_JSON as string[]).map((s) =>
  s.toUpperCase().trim()
);

import { MovimientoDTO } from '../models/movimiento.dto';

export function filtrarExcluidos(lista: MovimientoDTO[]): MovimientoDTO[] {
  return lista.filter(
    (m) =>
      !EXCLUDE_PATTERNS.some((p) =>
        m.DescMot.toUpperCase().trim().startsWith(p)
      )
  );
}