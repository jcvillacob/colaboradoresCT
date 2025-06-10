import {
  Component, OnInit, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { VentasService } from '../../services/ventas.service';

Chart.register(...registerables);

interface Venta {
  Año: string;
  DesCliente: string;
  Mes: string;     // "01"…"12"
  Total: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss'],
})
export class VentasComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') chartRef!: ElementRef<HTMLCanvasElement>;

  private readonly defaultYear = '2025';

  datosVentas: Venta[] = [];
  clientesUnicos: string[] = [];

  // buscador
  busqueda = '';
  sugerencias: string[] = [];
  clientesSeleccionados: string[] = [];

  chart!: Chart;

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.ventasService.getDatosVentas().subscribe((data: Venta[]) => {
      this.datosVentas = data;
      this.clientesUnicos = Array.from(
        new Set(data.map(v => v.DesCliente))
      ).sort();
    });
  }

  ngAfterViewInit(): void {
    this.dibujarGrafica(); // vacía
  }

  /* ---------- buscador ---------- */
  filtrarClientes(): void {
    const q = this.busqueda.toLowerCase().trim();
    this.sugerencias = !q
      ? []
      : this.clientesUnicos
          .filter(c =>
            c.toLowerCase().includes(q) &&
            !this.clientesSeleccionados.includes(c)
          )
          .slice(0, 10);
  }

  agregarCliente(cliente: string): void {
    if (
      cliente &&
      !this.clientesSeleccionados.includes(cliente) &&
      this.clientesUnicos.includes(cliente)
    ) {
      this.clientesSeleccionados.push(cliente);
      this.dibujarGrafica();
    }
    this.busqueda = '';
    this.sugerencias = [];
  }

  quitarCliente(cliente: string): void {
    this.clientesSeleccionados =
      this.clientesSeleccionados.filter(c => c !== cliente);
    this.dibujarGrafica();
  }

  /* ---------- gráfico ---------- */
  private dibujarGrafica(): void {
    const meses = Array.from({ length: 12 }, (_, i) =>
      ('0' + (i + 1)).slice(-2)
    );

    const datasets: any[] = [];

    if (this.clientesSeleccionados.length) {
      // datos por combinación cliente-año
      const filtrado = this.datosVentas.filter(v =>
        this.clientesSeleccionados.includes(v.DesCliente)
      );

      const años = Array.from(new Set(filtrado.map(v => v.Año))).sort();

      this.clientesSeleccionados.forEach((cliente, cIdx) => {
        años.forEach((año, aIdx) => {
          const data = meses.map(m =>
            (filtrado.find(
              f => f.DesCliente === cliente && f.Año === año && f.Mes === m
            ) || { Total: 0 }).Total
          );

          datasets.push({
            label: `${cliente} - ${año}`,
            data,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            fill: false,
            borderColor: this.getColor(cIdx, aIdx),
            hidden: año !== this.defaultYear // solo 2025 visible
          });
        });
      });
    }

    this.renderChart(meses, datasets);
  }

  private renderChart(labels: string[], datasets: any[]): void {
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, padding: 20 },
          },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { title: { display: true, text: 'Mes' } },
          y: {
            title: { display: true, text: 'Total Facturado' },
            beginAtZero: true,
          },
        },
      },
    });
  }

  /** Paleta combinada cliente-año (suficiente para docenas de líneas) */
  private getColor(clienteIdx: number, añoIdx: number): string {
    const base = [
      [75, 192, 192],   // turquesa
      [255, 99, 132],   // rosa
      [54, 162, 235],   // azul
      [255, 206, 86],   // amarillo
      [153, 102, 255],  // morado
      [255, 159, 64],   // naranja
    ];
    const [r, g, b] = base[clienteIdx % base.length];
    const factor = 1 - 0.25 * (añoIdx % 3); // aclara/oscurece por año
    return `rgb(${r * factor}, ${g * factor}, ${b * factor})`;
  }
}
