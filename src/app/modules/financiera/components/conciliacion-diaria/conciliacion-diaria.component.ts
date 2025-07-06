import { Component } from '@angular/core';
import { ConciliacionServiceService } from '../../services/conciliacion-service.service';

@Component({
  selector: 'app-conciliacion-diaria',
  templateUrl: './conciliacion-diaria.component.html',
  styleUrls: ['./conciliacion-diaria.component.scss'],
})
export class ConciliacionDiariaComponent {
  files: File[] = [];
  days: number = 1;

  constructor(private concService: ConciliacionServiceService) {}

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    Array.from(input.files).forEach((file) => {
      const exists = this.files.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (!exists) this.files.push(file);
    });
  }

  onCross(): void {
    if (!this.files.length) return;

    this.concService.getEgresos(this.days + 1).subscribe({
      next: (egresos) => {
        this.concService.obtenerMovimientos(this.files).then((documentos) => {
          const { faltanEnDocumentos, faltanEnEgresos } =
            this.concService.cruzarEgresosConDocumentos(egresos, documentos);

          // descarga inmediata
          this.concService.exportarResultado(
            faltanEnDocumentos,
            faltanEnEgresos
          );

          // Logging opcional
          console.log('🟠 Solo en Egresos:', faltanEnDocumentos);
          console.log('🔵 Solo en Documentos:', faltanEnEgresos);
        });
      },
      error: console.error,
    });
  }
}
