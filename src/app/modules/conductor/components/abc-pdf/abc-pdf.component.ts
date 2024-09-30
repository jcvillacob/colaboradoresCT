import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ConductoresService } from '../../services/conductores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-abc-pdf',
  templateUrl: './abc-pdf.component.html',
  styleUrls: ['./abc-pdf.component.scss']
})
export class AbcPdfComponent  implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  CapacitacionId!: number;
  capacitacion: any;
  capacitaciones!: any[];
  spinner: boolean = true;
  private routeSub!: Subscription;

  constructor(
    private conductoresService: ConductoresService,
    private route: ActivatedRoute,
    private router: Router
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
