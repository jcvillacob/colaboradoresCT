import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConductoresService } from '../../services/conductores.service';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
  selector: 'app-subir-archivos',
  templateUrl: './subir-archivos.component.html',
  styleUrls: ['./subir-archivos.component.scss']
})
export class SubirArchivosComponent implements OnInit {
  formulario!: FormGroup;
  creadorID!: number;
  cargando: boolean = false;

  videoFile: File | null = null;
  imgFile: File | null = null;

  constructor(private fb: FormBuilder, private conductoresService: ConductoresService, private authService: AuthService) {
    this.creadorID = this.authService.getUsuarioID();
  }

  ngOnInit() {
    this.formulario = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      group: ['Todos', Validators.required],
      type: ['Video', Validators.required],
      test: ['', Validators.required]
    });
  }

  onVideoSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.videoFile = inputElement.files[0];
    }
  }

  onImgSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.imgFile = inputElement.files[0];
    }
  }

  resetVideoFile() {
    this.videoFile = null;
    const inputElement = document.getElementById('video') as HTMLInputElement;
    inputElement.value = '';
  }

  resetImgFile() {
    this.imgFile = null;
    const inputElement = document.getElementById('image') as HTMLInputElement;
    inputElement.value = '';
  }

  onSubmit() {
    if (!this.videoFile || !this.imgFile || !this.formulario.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes subir todos los archivos y completar el formulario antes de continuar.',
      });
      return;
    }

    this.cargando = true;

    // Datos del formulario para enviarlos
    const formData = new FormData();
    formData.append('titulo', this.formulario.get('title')?.value);
    formData.append('descripcion', this.formulario.get('description')?.value);
    formData.append('grupo', this.formulario.get('group')?.value);
    formData.append('tipo', this.formulario.get('type')?.value);
    formData.append('creadorID', this.creadorID.toString());
    formData.append('image', this.imgFile as Blob);
    formData.append('document', this.videoFile as Blob);
    formData.append('test', this.formulario.get('test')?.value);

    this.conductoresService.createCapacitacion(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Subido Correctamente',
          text: 'Su archivo se ha subido correctamente',
        });
        this.formulario.reset();
        this.resetVideoFile();
        this.resetImgFile();
        this.cargando = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'No Subido',
          text: 'Su archivo NO se ha subido correctamente',
        });
        this.cargando = false;
      }
    });
  }


}
