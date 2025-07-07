import { Component } from '@angular/core';
import { ConciliacionServiceService } from '../../services/conciliacion-service.service';
import { finalize } from 'rxjs/operators'; // ⬅️ importa finalize

@Component({
  selector: 'app-conciliacion-diaria',
  templateUrl: './conciliacion-diaria.component.html',
  styleUrls: ['./conciliacion-diaria.component.scss'],
})
export class ConciliacionDiariaComponent {
  files: File[] = [];
  days = 1;
  isLoading = false;   // ⬅️ nuevo flag

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
    if (!this.files.length || this.isLoading) return;

    this.isLoading = true; // ⬅️ activa carga

    this.concService
      .getEgresos(this.days + 1)
      .pipe(finalize(() => (this.isLoading = false))) // ⬅️ desactiva al final, éxito o error
      .subscribe({
        next: (egresos) => {
          this.concService.obtenerMovimientos(this.files).then((documentos) => {
            const { faltanEnDocumentos, faltanEnEgresos } =
              this.concService.cruzarEgresosConDocumentos(egresos, documentos);

            this.concService.exportarResultado(
              faltanEnDocumentos,
              faltanEnEgresos
            );
            console.log('🟠 Solo en Egresos:', faltanEnDocumentos);
            console.log('🔵 Solo en Documentos:', faltanEnEgresos);
          });
        },
        error: (err) => {
          console.error(err);
          // Podrías mostrar un toast aquí
        },
      });
  }
}
