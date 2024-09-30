import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ConductoresService } from '../../services/conductores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-abc-videos',
  templateUrl: './abc-videos.component.html',
  styleUrls: ['./abc-videos.component.scss']
})
export class AbcVideosComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  CapacitacionId!: number;
  capacitacion: any;
  capacitaciones!: any[];
  spinner: boolean = true;
  zoom: number = 1;
  safeUrl!: SafeResourceUrl;
  private routeSub!: Subscription;

  pdfSrc!: any;

  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private conductoresService: ConductoresService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.CapacitacionId = +id;
        this.getCapacitacion();
        this.getCapacitaciones();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  getCapacitacion() {
    this.conductoresService.getCapacitacionById(this.CapacitacionId).subscribe(data => {
      this.capacitacion = data;
      console.log(data);
      // Sanitiza la URL aquí
      if (this.capacitacion.Tipo === 'PDF') {
        /* this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.capacitacion.UrlFile); */
        this.pdfSrc = this.conductoresService.returnPDF(this.capacitacion.UrlFile);
      };
      this.reloadVideo();
    });
  }

  getCapacitaciones() {
    this.conductoresService.getAllCapacitaciones().subscribe(data => {
      this.capacitaciones = data.filter((c: any) => c.capacitacionID !== this.CapacitacionId);
    });
  }

  reloadVideo() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const video: HTMLVideoElement = this.videoPlayer.nativeElement;
      video.load();
    }
    setTimeout(() => {
      this.spinner = false;
    }, 500);
  }

  goBack() {
    window.history.back();
  }
}
