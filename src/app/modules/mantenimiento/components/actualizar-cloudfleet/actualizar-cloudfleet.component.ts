import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CloudfleetService } from '../../services/cloudfleet.service';

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
    this.cloudfleetService.getLastLogs().subscribe((data: any) => {
      this.logs = data.data;
      if(!this.logs[0].hora_final) {
        this.isUpdating = true;
      }
    })
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
        if (result.isConfirmed) {
          this.updateCloudfleet();
        }
      });
    } else {
      this.updateCloudfleet();
    }
  }

  updateCloudfleet() {
    this.isUpdating = true;
    this.cloudfleetService.updateCloudfleet().subscribe(data => {
      this.isUpdating = false;
      this.getLastLogs();
      Swal.fire({
        title: 'Actualización terminada',
        text: 'La actualización se completó exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    });
    setTimeout(() => {
      this.getLastLogs();
    }, 1000)
  }
}
