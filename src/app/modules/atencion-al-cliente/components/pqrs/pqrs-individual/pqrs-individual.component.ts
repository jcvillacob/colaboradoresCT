import { Component, OnInit } from '@angular/core';
import { ClienteExternoService } from '../../../services/cliente-externo.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-pqrs-individual',
  templateUrl: './pqrs-individual.component.html',
  styleUrls: ['./pqrs-individual.component.scss']
})
export class PqrsIndividualComponent implements OnInit {
  spinner: boolean = true;
  PqrsID!: number;
  pqrs!: any;

  constructor(private clienteExternoService: ClienteExternoService, private route: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit(): void {
    const pqrsID = this.route.snapshot.paramMap.get('id');
    if (pqrsID) {
      this.PqrsID = +pqrsID;
      this.getPQRS();
    }

  }

  getPQRS() {
    this.spinner = true;
    this.clienteExternoService.getPqr(this.PqrsID).subscribe(data => {
      this.pqrs = data;
      console.log(this.pqrs)
      setTimeout(() => {
        this.spinner = false;
        initFlowbite();
      }, 500);
    });
  }

  getStateClass(estado: string): string {
    switch (estado) {
      case 'Recibido':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white';
      case 'Cerrado':
        return 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-white';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getFileIcon(file: any): string {
    const fileType = file.FileType;
    if (fileType.includes('pdf')) {
      return 'assets/Iconos files/pdf.svg';
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return 'assets/Iconos files/excel.svg';
    } else if (fileType.includes('word')) {
      return 'assets/Iconos files/word.svg';
    } else if (fileType.includes('image')) {
      return 'assets/Iconos files/imagen.svg';
    } else if (fileType.includes('video')) {
      return 'assets/Iconos files/vlc.svg';
    } else {
      return 'assets/Iconos files/imagen.svg';
    }
  }

  downloadFile(file: any): void {
    this.http.get(file.FileURL, { responseType: 'blob' }).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = file.FileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(objectUrl);
      document.body.removeChild(a);
    });
  }

  goBack() {
    window.history.back();
  }
}
