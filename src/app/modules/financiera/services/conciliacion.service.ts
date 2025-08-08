import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Egreso } from '../models/egreso.model';
import { MovimientoDTO, ReconciliacionParams, ReconciliacionResult } from '../models/movimiento.model';
import { CUENTAS, Empresa } from '../config/cuentas.config';
import { EXCLUDE_PATTERNS } from '../config/exclusion.config';
import { getParserFor } from '../parsers/parser.factory';
import { cruzarEgresosConDocumentos } from '../domain/reconciliacion.domain';
import { ExportService } from './export.service';

@Injectable({ providedIn: 'root' })
export class ConciliacionService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient, private exporter: ExportService) {}

  getEgresos(days: number): Observable<Egreso[]> {
    return this.http.get<Egreso[]>(`${this.apiUrl}/egresos/egresosdias?days=${days}`);
  }

  private detectarEmpresa(fileName: string): Empresa {
    return /codiesel/i.test(fileName) ? 'codiesel' : 'coorditanques';
  }

  private filtrarExcluidos(lista: MovimientoDTO[]): MovimientoDTO[] {
    return lista.filter(m => !EXCLUDE_PATTERNS.some(p => m.DescMot.toUpperCase().trim().startsWith(p)));
  }

  async obtenerMovimientos(files: File[]): Promise<MovimientoDTO[]> {
    const out: MovimientoDTO[] = [];
    for (const file of files) {
      const parser = getParserFor(file.name);
      if (!parser) continue;
      const empresa = this.detectarEmpresa(file.name);
      const bancoKey = parser.banco.toLowerCase() as 'davivienda'|'bancolombia';
      const cuenta = CUENTAS[empresa][bancoKey];
      const movimientos = await parser.parse(file, empresa, cuenta);
      out.push(...this.filtrarExcluidos(movimientos));
    }
    return out;
  }

  cruzar(egresos: Egreso[], documentos: MovimientoDTO[], params?: ReconciliacionParams): ReconciliacionResult {
    return cruzarEgresosConDocumentos(egresos, documentos, params);
  }

  exportar(resultado: ReconciliacionResult): void {
    this.exporter.exportarConciliacion(resultado.faltanEnDocumentos, resultado.faltanEnEgresos);
  }
}
