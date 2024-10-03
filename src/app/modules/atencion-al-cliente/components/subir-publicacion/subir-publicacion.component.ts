import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import ClassicEditor from '../../ckeditor5-41.3.1-ns87wj6migar/build/ckeditor';
import { ClienteExternoService } from '../../services/cliente-externo.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/core/authentication/store/auth.reducer';
import * as BlogsActions from '../../store/blogs.actions';
import { BlogsState } from '../../store/blogs.reducer';

@Component({
  selector: 'app-subir-publicacion',
  templateUrl: './subir-publicacion.component.html',
  styleUrls: ['./subir-publicacion.component.scss']
})
export class SubirPublicacionComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  public Editor = ClassicEditor;
  public editorInstance: any;
  blogForm!: FormGroup;
  archivoSeleccionado: File | null = null;
  showToast: boolean = false;
  htmlContent = '<p>Creemos un nuevo Blog!</p>';
  uploadUrl = 'https://ctapp.coorditanques.com/colaboradoresBack/api/v1/blogs/upload';
  public editorConfig: any;
  imagePreview!: SafeUrl;
  userLogged$!: Observable<any>;

  // Arreglo para almacenar las URLs de las imágenes temporales
  private temporaryImages: string[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private clienteExternoService: ClienteExternoService,
    private store: Store<{ auth: AuthState, blogs: BlogsState }>,
  ) {
    this.userLogged$ = this.store.select(state => state.auth.user);
    this.uploadUrl = this.clienteExternoService.getApiUpload();
  }

  ngOnInit(): void {
    this.blogForm = new FormGroup({
      title: new FormControl('', Validators.required),
      autor: new FormControl('', Validators.required),
      ocupacion: new FormControl('', Validators.required),
      summary: new FormControl('', Validators.required),
      htmlContent: new FormControl('<p>Creemos un nuevo Blog!</p>', Validators.required)
    });

    // Configuración del editor
    this.editorConfig = {
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
  }

  // Capturamos la instancia del editor cuando está listo
  public onReady(editor: any): void {
    this.editorInstance = editor;

    // Personalizamos el adaptador de carga para capturar las URLs de las imágenes
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader, this.uploadUrl, this.temporaryImages);
    };
  }

  ngOnDestroy(): void {
    // Llamamos al método para eliminar las imágenes temporales si no se guardó el blog
    this.deleteTemporaryImages();
  }

  private deleteTemporaryImages(): void {
    if (this.temporaryImages.length > 0) {
      console.log(this.temporaryImages);
      this.store.dispatch(BlogsActions.deleteTemporaryImages({ imageUrls: this.temporaryImages }));
      /* this.clienteExternoService.deleteTemporaryImages(this.temporaryImages).subscribe(
        () => {
        },
        (error) => {
          console.error('Error al eliminar imágenes temporales:', error);
        }
      ); */
    }
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
      alert('Por favor, seleccione una imagen de portada');
      return;
    }

    let creadorID: any | null = null;
    this.userLogged$.subscribe(user => {
      creadorID = user?.UsuarioID;
    }).unsubscribe();

    if (!creadorID) {
      alert('No se pudo obtener el ID del usuario. Por favor, inténtalo de nuevo.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.blogForm.value.title);
    formData.append('autor', this.blogForm.value.autor);
    formData.append('ocupacion', this.blogForm.value.ocupacion);
    formData.append('resumen', this.blogForm.value.summary);
    formData.append('creadorID', creadorID.toString());
    formData.append('blog', this.blogForm.get('htmlContent')?.value);
    formData.append('image', this.archivoSeleccionado);

    this.clienteExternoService.crearBlog(formData).subscribe(
      data => {
        console.log(data);
        // Reiniciamos el formulario y variables
        this.blogForm.reset({
          title: '',
          autor: '',
          ocupacion: '',
          summary: '',
          htmlContent: '<p>Creemos un nuevo Blog!</p>'
        });
        // Limpiamos el arreglo de imágenes temporales ya que el blog se guardó
        this.temporaryImages = [];
        setTimeout(() => {
          this.showToast = false;
        }, 5000);
      },
      error => {
        console.error('Error al crear el blog:', error);
        alert('Hubo un error al crear el blog. Por favor, inténtalo de nuevo más tarde.');
      }
    );
  }

  goBack() {
    window.history.back();
  }
}

// Adaptador personalizado para CKEditor
class UploadAdapter {
  loader: any;
  uploadUrl: string;
  temporaryImages: string[];

  constructor(loader: any, uploadUrl: string, temporaryImages: string[]) {
    this.loader = loader;
    this.uploadUrl = uploadUrl;
    this.temporaryImages = temporaryImages;
  }

  upload() {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('upload', file);

      fetch(this.uploadUrl, {
        method: 'POST',
        body: data,
      })
        .then(response => response.json())
        .then(result => {
          // Almacenamos la URL de la imagen temporal
          this.temporaryImages.push(result.url);
          resolve({
            default: result.url
          });
        })
        .catch(error => {
          reject(error);
        });
    }));
  }

  abort() {
    // Implementar si es necesario
  }
}
