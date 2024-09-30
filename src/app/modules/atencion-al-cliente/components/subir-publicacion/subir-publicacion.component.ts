import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import ClassicEditor from '../../ckeditor5-41.3.1-ns87wj6migar/build/ckeditor';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { ClienteExternoService } from '../../services/cliente-externo.service';

@Component({
  selector: 'app-subir-publicacion',
  templateUrl: './subir-publicacion.component.html',
  styleUrls: ['./subir-publicacion.component.scss']
})
export class SubirPublicacionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public Editor = ClassicEditor;
  public editorInstance: any;
  blogForm!: FormGroup;
  archivoSeleccionado: File | null = null;
  showToast: boolean = false;
  htmlContent = '<p>Creemos un nuevo Blog!</p>';
  uploadUrl = 'https://ctapp.coorditanques.com/colaboradoresBack/api/v1/blogs/upload';
  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
      ]
    },
    simpleUpload: {
      uploadUrl: this.uploadUrl
    },
    image: {
      toolbar: [
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'imageTextAlternative'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    }
  };
  imagePreview!: SafeUrl;

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private clienteExternoService: ClienteExternoService) {
    this.uploadUrl = this.clienteExternoService.getApiUpload();
  }

  ngOnInit(): void {
    this.blogForm = new FormGroup({
      title: new FormControl('', Validators.required),
      autor: new FormControl('', Validators.required),
      ocupacion: new FormControl('', Validators.required),
      summary: new FormControl('', Validators.required)
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

  subirBlog() {
    if (!this.archivoSeleccionado) {
      alert('Por favor, seleccione un archivo');
      return;
    }
    const creadorID = this.authService.getUsuarioID();
    const formData = new FormData();
    formData.append('titulo', this.blogForm.value.title);
    formData.append('autor', this.blogForm.value.autor);
    formData.append('ocupacion', this.blogForm.value.ocupacion);
    formData.append('resumen', this.blogForm.value.summary);
    formData.append('creadorID', creadorID);
    formData.append('blog', this.htmlContent);
    formData.append('image', this.archivoSeleccionado);

    this.clienteExternoService.crearBlog(formData).subscribe(data => {
      console.log(data);
      this.blogForm = new FormGroup({
        title: new FormControl('', Validators.required),
        autor: new FormControl('', Validators.required),
        ocupacion: new FormControl('', Validators.required),
        summary: new FormControl('', Validators.required)
      });
      this.imagePreview = '';
      this.archivoSeleccionado = null;
      this.htmlContent = '<p>Creemos un nuevo Blog!</p>';
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
