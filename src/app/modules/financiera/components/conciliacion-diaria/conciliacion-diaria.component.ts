import { Component } from '@angular/core';

@Component({
  selector: 'app-conciliacion-diaria',
  templateUrl: './conciliacion-diaria.component.html',
  styleUrls: ['./conciliacion-diaria.component.scss']
})
export class ConciliacionDiariaComponent {
  files: File[] = [];
  days: number = 1;  // valor por defecto

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    Array.from(input.files).forEach(file => {
      const exists = this.files.some(f => f.name === file.name && f.size === file.size);
      if (!exists) this.files.push(file);
    });
  }

  onCross(): void {
    // aquí irá la lógica de cruce, usando this.files y this.days
    console.log('Cruzar', this.files.length, 'archivos con', this.days, 'días');
  }
}
