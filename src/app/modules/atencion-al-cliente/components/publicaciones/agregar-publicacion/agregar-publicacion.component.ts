import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-agregar-publicacion',
  templateUrl: './agregar-publicacion.component.html',
  styleUrls: ['./agregar-publicacion.component.scss']
})
export class AgregarPublicacionComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }

}
