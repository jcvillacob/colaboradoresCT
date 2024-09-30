import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ClienteExternoService } from '../../services/cliente-externo.service';

@Component({
  selector: 'app-subir-noticias',
  templateUrl: './subir-noticias.component.html',
  styleUrls: ['./subir-noticias.component.scss']
})
export class SubirNoticiasComponent implements OnInit {
  noticiaForm!: FormGroup;
  imagePreview!: SafeUrl;
  archivoSeleccionado: File | null = null;
  showToast: boolean = false;

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private clienteExternoService: ClienteExternoService) { }

  ngOnInit() {
    this.noticiaForm = new FormGroup({
      title: new FormControl('', Validators.required),
      autor: new FormControl('', Validators.required),
      summary: new FormControl('', Validators.required),
      cover: new FormControl(null, Validators.required)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (event.target.files && event.target.files.length) {
      this.archivoSeleccionado = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  subirNoticia() {
    if (!this.archivoSeleccionado) {
      alert('Por favor, seleccione un archivo');
      return;
    }
    const creadorID = this.authService.getUsuarioID();
    const formData = new FormData();
    formData.append('titulo', this.noticiaForm.value.title);
    formData.append('autor', this.noticiaForm.value.autor);
    formData.append('descripcion', this.noticiaForm.value.summary);
    formData.append('creadorID', creadorID);
    formData.append('image', this.archivoSeleccionado);

    this.clienteExternoService.crearNoticia(formData).subscribe(data => {
      this.noticiaForm = new FormGroup({
        title: new FormControl('', Validators.required),
        autor: new FormControl('', Validators.required),
        summary: new FormControl('', Validators.required),
        cover: new FormControl(null, Validators.required)
      });
      this.imagePreview = '';
      this.archivoSeleccionado = null;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 5000);
    })
  }

  goBack() {
    window.history.back();
  }

}
