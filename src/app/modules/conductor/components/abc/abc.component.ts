import { Component } from '@angular/core';
import { ConductoresService } from '../../services/conductores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abc',
  templateUrl: './abc.component.html',
  styleUrls: ['./abc.component.scss']
})
export class AbcComponent {
  capacitaciones!: any[];
  spinner: boolean = true;


  constructor(
    private conductoresService: ConductoresService,
    private router: Router
  ) {
    this.conductoresService.getAllCapacitaciones().subscribe(data => {
      this.capacitaciones = data;
      setTimeout(() => {
        this.spinner = false;
      }, 500);
    });
  }

  navigateToCapacitacion(capacitacionID: number) {
    this.router.navigate([`condutores/abc/videos/${capacitacionID}`]);
  }
}
