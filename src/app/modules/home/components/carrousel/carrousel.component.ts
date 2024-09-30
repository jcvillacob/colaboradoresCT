import { AfterViewInit, Component } from '@angular/core';
import { ClienteExternoService } from 'src/app/modules/atencion-al-cliente/services/cliente-externo.service';
declare const Swiper: any;

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss']
})
export class CarrouselComponent implements AfterViewInit {
  slides: any = {};
  spinner: boolean = true;

  constructor(private clienteExternoService: ClienteExternoService) {
    this.clienteExternoService.getNoticias().subscribe(data => {
      this.slides = data.reverse().slice(1);
      setTimeout(() => {
        this.spinner = false;
      }, 500);
    });
  }

  ngAfterViewInit(): void {
    new Swiper(".mySwiper", {
      slidesPerView: 3,
      spaceBetween: 30,
      centeredSlides: true,
      initialSlide: 0,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
          initialSlide: 1
        }
      }
    });
  }

}
