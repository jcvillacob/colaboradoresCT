import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ComercialService } from 'src/app/modules/comercial/services/comercial.service';

@Component({
  selector: 'app-novedades-cartera',
  templateUrl: './novedades-cartera.component.html',
  styleUrls: ['./novedades-cartera.component.scss']
})
export class NovedadesCarteraComponent {
  solicitudes: any[] = [];
  solicitudesSelected: any[] = [];
  filtro!: string;
  filtroEmpresa: string = 'Coorditanques';
  empresas = ['Coorditanques', 'Codiesel', 'Lance'];

  constructor(private comercialService: ComercialService) {
    this.getSolicitudes();
  }

  getSolicitudes(){
    this.comercialService.getSolicitudes().subscribe(data => {
      this.solicitudes = data.reverse();
      this.solicitudesSelected = this.solicitudes;
      setTimeout(() => {
        initFlowbite();
      }, 200);
    })
  }

  filtrarEmpresa(empresa: string) {
    this.filtroEmpresa = empresa;
  }


  filtroCartera() {
    if (this.filtro) {
      this.solicitudesSelected = this.solicitudes.filter(elemento => {
        const filtroMinuscula = this.filtro.toLowerCase();
        const empresaContieneFiltro = elemento.Empresa.toLowerCase().includes(filtroMinuscula);
        const origenContieneFiltro = elemento.Origen.toLowerCase().includes(filtroMinuscula);
        const NITContieneFiltro = elemento.NIT.toLowerCase().includes(filtroMinuscula);
        const destinoContieneFiltro = elemento.Destino.toLowerCase().includes(filtroMinuscula);
        return empresaContieneFiltro || origenContieneFiltro || destinoContieneFiltro || NITContieneFiltro;
      });
    } else {
      this.solicitudesSelected = this.solicitudes;
      initFlowbite();
    }

  }

}
