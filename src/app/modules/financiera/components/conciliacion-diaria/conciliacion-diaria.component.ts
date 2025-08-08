import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ConciliacionService } from '../../services/conciliacion.service';
import { ReconciliacionParams } from '../../models/movimiento.model';

@Component({
  selector: 'app-conciliacion-diaria',
  templateUrl: './conciliacion-diaria.component.html',
  styleUrls: ['./conciliacion-diaria.component.scss'],
})
export class ConciliacionDiariaComponent {
  files: File[] = [];
  days = 1;
  isLoading = false;
  tolerancia = 0; // por si quieres exponerlo en UI

  constructor(private concService: ConciliacionService) {}

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    for (const file of Array.from(input.files)) {
      const exists = this.files.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (!exists) this.files.push(file);
    }
  }

  onCross(): void {
    if (!this.files.length || this.isLoading) return;
    this.isLoading = true;

    this.concService
      .getEgresos(this.days + 1)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: async (egresos) => {
          try {
            const documentos = await this.concService.obtenerMovimientos(
              this.files
            );
            const params: ReconciliacionParams = {
              tolerancia: this.tolerancia,
              invertirSignoEgresos: true,
            };
            const resultado = this.concService.cruzar(
              egresos,
              documentos,
              params
            );
            this.concService.exportar(resultado);
            console.log('🟠 Solo en Egresos:', resultado.faltanEnDocumentos);
            console.log('🔵 Solo en Bancos:', resultado.faltanEnEgresos);
          } catch (e) {
            console.error('Error procesando archivos:', e);
          }
        },
        error: (err) => console.error('Error obteniendo egresos:', err),
      });
  }
}
