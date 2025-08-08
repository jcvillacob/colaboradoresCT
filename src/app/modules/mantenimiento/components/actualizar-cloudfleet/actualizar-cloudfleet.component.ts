import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CloudfleetService } from '../../services/cloudfleet.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-actualizar-cloudfleet',
  templateUrl: './actualizar-cloudfleet.component.html',
  styleUrls: ['./actualizar-cloudfleet.component.scss'],
})
export class ActualizarCloudfleetComponent {
  isUpdating = false;
  logs: any[] = [];

  constructor(private cloudfleetService: CloudfleetService) {
    this.getLastLogs();
  }

  getLastLogs() {
    this.cloudfleetService.getLastLogs().subscribe((res: any) => {
      this.logs = res?.data ?? [];
      if (this.logs[0] && !this.logs[0].hora_final) {
        this.isUpdating = true;
      }
    });
  }

  onUpdateClick() {
    if (this.isUpdating) {
      Swal.fire({
        title:
          'Estás realizando una actualización actualmente, ¿seguro deseas hacer otra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) this.updateCloudfleet();
      });
    } else {
      this.updateCloudfleet();
    }
  }

  private updateCloudfleet() {
    this.isUpdating = true;
    this.cloudfleetService
      .updateCloudfleet()
      .pipe(finalize(() => (this.isUpdating = false)))
      .subscribe({
        next: () => {
          this.getLastLogs();
          Swal.fire({
            title: 'Actualización terminada',
            text: 'La actualización se completó exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error en la actualización',
            text: err?.error?.message || 'Revisa el log del servidor.',
            icon: 'error',
          });
        },
      });

    // pequeño refresh para ver el log “en curso”
    setTimeout(() => this.getLastLogs(), 1000);
  }

  // === NUEVO: botón para sync mensual ===
  onUpdateMonthlyClick() {
    if (this.isUpdating) {
      Swal.fire({
        title:
          'Hay una actualización en curso, ¿quieres ejecutar también la sincronización mensual?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
      }).then((r) => {
        if (r.isConfirmed) this.updateCloudfleetMonthly();
      });
    } else {
      this.updateCloudfleetMonthly();
    }
  }

  private updateCloudfleetMonthly() {
    this.isUpdating = true;
    this.cloudfleetService
      .updateCloudfleetMonthly()
      .pipe(finalize(() => (this.isUpdating = false)))
      .subscribe({
        next: () => {
          this.getLastLogs();
          Swal.fire({
            title: 'Sincronización mensual terminada',
            text: 'La sincronización del mes se completó exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error en la sincronización mensual',
            text: err?.error?.message || 'Revisa el log del servidor.',
            icon: 'error',
          });
        },
      });

    setTimeout(() => this.getLastLogs(), 1000);
  }
}
