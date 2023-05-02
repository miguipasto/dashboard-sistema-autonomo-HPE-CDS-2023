import { Component, OnInit } from '@angular/core';
import { BackEndService } from 'src/app/services/back-end.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading: boolean = false;

  fechaInicio: string = '2030-01-01';
  fechaFin: string = '2030-01-05';
  fechaInicioPeticion = "";
  fechaFinPeticion = "";
  minDate = '2030-01-01';
  maxDate = '2030-01-31'

  areas: any = [];
  centrales: any = [];
  inicio: string = '';
  fin: string = '';

  central_name: string = "";
  centrales_info: any = [];
  centrales_keys: any;

  fechas: any = [];
  resultados: any = [];
  aportacionCentrales: any = [];
  costesCentrales: any = [];
  emisionesCarbon: any = [];
  emisionesSistema: any = [];
  nivelPantano1: any = [];
  nivelPantano2: any = [];
  penalizacionesIndustrial: any = [];
  penalizacionesResidencial: any = [];
  penalizacionesServicios: any = [];
  costesCentralesActivas : any = [];

  areas_seleccionadas : any = [];;
  centrales_seleccionadas : any = []


  constructor(private backendService: BackEndService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {

    this.backendService.getLocalizacaciones().subscribe((res: any) => {
      this.areas = res.filter((area: any) => area.startsWith('A'));
      this.centrales = res.filter((area: any) => !area.startsWith('A'));
    });
    this.onFechaChange();
    this.peticionInicial();
  }

  peticionInicial(){
    
    this.areas_seleccionadas.A001 = true;
    this.areas_seleccionadas.A002 = true;
    this.areas_seleccionadas.A003 = true;
    
    this.centrales_seleccionadas.WAT001 = true;
    this.centrales_seleccionadas.WAT002 = true;
    this.centrales_seleccionadas.SUN001 = true;
    this.centrales_seleccionadas.SUN002 = true;
    this.centrales_seleccionadas.SUN003 = true;
    this.centrales_seleccionadas.WIND001 = true;
    this.centrales_seleccionadas.WIND002 = true;
    this.centrales_seleccionadas.WIND003 = true;
    this.centrales_seleccionadas.GEO001 = true;
    this.centrales_seleccionadas.GEO002 = true;
    this.centrales_seleccionadas.COAL001 = true;

    this.peticionServidor();

  }

  parsearResultados() {

    this.aportacionCentrales = [];
    this.emisionesCarbon = [];
    this.emisionesSistema = [];
    this.costesCentrales = [];
    this.nivelPantano1 = [];
    this.nivelPantano2 = [];
    this.penalizacionesIndustrial = [];
    this.penalizacionesResidencial = [];
    this.penalizacionesServicios = [];
    this.costesCentralesActivas = [];
    this.fechas = []
    
    this.aportacionCentrales = this.resultados.centrales_activas;

    for (let i = 0; i < this.resultados.emisiones[0].length; i++) {
      let fecha = this.resultados.emisiones[0][i].split("/");
      fecha = Date.parse(fecha[1]+"/"+fecha[0]+"/"+fecha[2]);
      this.fechas.push(fecha);
      this.emisionesCarbon.push([fecha,this.resultados.emisiones[1][i]]);
      this.emisionesSistema.push([fecha,this.resultados.emisiones[2][i]]);
      this.costesCentrales.push([fecha,this.resultados.costes[i][1]]);
      this.nivelPantano1.push([fecha,this.resultados.niveles_pantanos[0][i]]);
      this.nivelPantano2.push([fecha,this.resultados.niveles_pantanos[1][i]]);

      let industrial = Object.create({});
      industrial.color = "#7cb5ec";
      industrial.y = this.resultados.penalizaciones[0][i];
      this.penalizacionesIndustrial.push(industrial);

      let residencial = Object.create({});
      residencial.color = "black";
      residencial.y = this.resultados.penalizaciones[1][i];
      this.penalizacionesResidencial.push(residencial);

      let servicios = Object.create({});
      servicios.color = "#90ee7e";
      servicios.y = this.resultados.penalizaciones[2][i];
      this.penalizacionesServicios.push(servicios);

      this.costesCentralesActivas = this.resultados.costes_diarios;

    }

    this.graficaCoste();
    this.graficaBarras();
    this.graficaCircular();
    this.graficaPantano();
    this.graficaPantano_2();
    this.graficaBarraHorizontal(); 

  }
  
  async peticionServidor() {
    let areas = "";
    for(let area in this.areas_seleccionadas){
      areas += area + ",";
    }
    let centrales = "";
    for(let central in this.centrales_seleccionadas){
      centrales += central + ",";
    }
    areas = areas.substring(0,areas.length-1).replace(" ","");
    centrales = centrales.substring(0,centrales.length-1).replace(" ","");
    var fechas = this.fechaInicioPeticion + "-" + this.fechaFinPeticion;

    this.backendService.consulta(fechas,areas,centrales).subscribe(res => {
      this.resultados = res;
      this.parsearResultados();
    });
  }


  onFechaChange() {
    const fechaInicioParts = this.fechaInicio.split('-');
    const diaInicio = fechaInicioParts[2];
    const mesInicio = fechaInicioParts[1];
    const anioInicio = fechaInicioParts[0];
    const fechaInicioReversa = diaInicio + '/' + mesInicio + '/' + anioInicio;
    this.fechaInicioPeticion = fechaInicioReversa;

    const fechaFinParts = this.fechaFin.split('-');
    const diaFin = fechaFinParts[2];
    const mesFin = fechaFinParts[1];
    const anioFin = fechaFinParts[0];
    const fechaFinReversa = diaFin + '/' + mesFin + '/' + anioFin;
    this.fechaFinPeticion = fechaFinReversa;

    console.log(this.areas_seleccionadas);
    console.log(this.centrales_seleccionadas);

    this.peticionServidor();
  }

  mostrarInfoCentral(nombre_central: string) {
    if (nombre_central.startsWith("SUN")) {
      this.backendService.getSunInfo(nombre_central).subscribe((res: any) => {
        this.centrales_info = res;
        const central_name = Object.keys(this.centrales_info)[0];
        this.centrales_keys = Object.keys(this.centrales_info[central_name]);
      });
    } else if (nombre_central.startsWith("GEO")) {
      this.backendService.getGeoInfo(nombre_central).subscribe((res: any) => {
        this.centrales_info = res;
        const central_name = Object.keys(this.centrales_info)[0];
        this.centrales_keys = Object.keys(this.centrales_info[central_name]);
      });
    } else if (nombre_central.startsWith("WIND")) {
      this.backendService.getWindInfo(nombre_central).subscribe((res: any) => {
        this.centrales_info = res;
        const central_name = Object.keys(this.centrales_info)[0];
        this.centrales_keys = Object.keys(this.centrales_info[central_name]);
      });
    } else if (nombre_central.startsWith("WAT")) {
      this.backendService.getWaterInfo(nombre_central).subscribe((res: any) => {
        this.centrales_info = res;
        const central_name = Object.keys(this.centrales_info)[0];
        this.centrales_keys = Object.keys(this.centrales_info[central_name]);
      });
    } else if (nombre_central.startsWith("COAL")) {
      this.backendService.getCoalInfo(nombre_central).subscribe((res: any) => {
        this.centrales_info = res;
        const central_name = Object.keys(this.centrales_info)[0];
        this.centrales_keys = Object.keys(this.centrales_info[central_name]);
      });
    }
  }

  openSideBar(central: string) {
    const estilos = (<HTMLDivElement>document.getElementById("todo_sidebar")).style.display;
    if (estilos === 'block' && this.central_name === central) {
      (<HTMLDivElement>document.getElementById("todo_sidebar")).style.display = "none";
      (<HTMLDivElement>document.getElementById("sidebar")).style.display = "none";
      this.central_name = "";
    } else {
      (<HTMLDivElement>document.getElementById("todo_sidebar")).style.display = "block";
      (<HTMLDivElement>document.getElementById("sidebar")).style.display = "block";
      this.central_name = central;
      this.mostrarInfoCentral(central);
      this.graficaBar(central);
    }
  }

  cerrarSideBar() {
    (<HTMLDivElement>document.getElementById("todo_sidebar")).style.display = "none";
    (<HTMLDivElement>document.getElementById("sidebar")).style.display = "none";

  }

  seleccionarAreas() {
    (<HTMLDivElement>document.getElementById("seleccionar_areas")).style.display = "block";
    

    let botones = document.getElementsByClassName("central_button");
    let seleccionadas = 0;
    for (let i = 0; i < botones.length; i++) {
      const boton = botones[i] as HTMLButtonElement;
      if (boton.classList.contains("button_seleccionado")) {
        seleccionadas++;
        break;
      }
      boton.classList.add("button_seleccionado");
    }
    if(seleccionadas==0){
      for (let i = 0; i < botones.length; i++) {
        const boton = botones[i] as HTMLButtonElement;
        boton.classList.add("button_seleccionado");
      }
    }
  }

  cerrarAreas() {
    (<HTMLDivElement>document.getElementById("seleccionar_areas")).style.display = "none";

    let botones = document.getElementsByClassName("area_button");
    for (let i = 0; i < botones.length; i++) {
      const boton = botones[i] as HTMLButtonElement;
      if (boton.classList.contains("button_seleccionado")) {
        this.areas_seleccionadas[boton.id] = true;
      } else {
        delete this.areas_seleccionadas[boton.id];
      }
    }

    let botones_centrales = document.getElementsByClassName("central_button");
    for (let i = 0; i < botones_centrales.length; i++) {
      const boton = botones_centrales[i] as HTMLButtonElement;
      if (boton.classList.contains("button_seleccionado")) {
        this.centrales_seleccionadas[boton.id] = true;
      } else {
        delete this.centrales_seleccionadas[boton.id];
      }
    }
    this.onFechaChange();
  }



  boton_selccionado(area: any) {
    document.getElementById(area)?.classList.toggle("button_seleccionado");
  }

  seleccionarRango() {
    const inicio = Number(this.inicio);
    const fin = Number(this.fin);
    if (inicio >= 0 || fin <= 95) {
      if (inicio === 0 && fin === 0) {
        for (let i = 1; i <= 95; i++) {
          const area = document.getElementById(this.areas[i - 1]);
          if (area) {
            area.classList.remove('button_seleccionado');
          }
        }
      }

      let botones = document.getElementsByClassName("area_button");
      for (let i = inicio; i <= fin; i++) {
        const area = document.getElementById(this.areas[i - 1]);
        if (area) {
          area.classList.toggle('button_seleccionado');
        }
      }
    }

  }

  graficaBar(central : string) {
    var datos = [];
    for (let i = 0; i < this.fechas.length; i++) {
      datos.push([this.fechas[i],this.costesCentralesActivas[central][i]])
    }
    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: 'graficaBarCostes',
        type: 'line',
      },
      title: {
        text: 'Costes diarios de la central',
        style: { "font-size": "20px" },
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha',
        },
      },
      yAxis: {
        title: {
          text: 'Nivel de reserva',
        },
        gridLineColor: "transparent"
      },
      series: [
        {
          name: 'Costes',
          type: 'line',
          data: datos,
          marker: {
            enabled: false
          }
        },
      ],
      credits: {
        enabled: false
      }
    });
  }


  graficaCoste() {
    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: 'grafica_coste',
        type: 'line',
      },
      title: {
        text: 'Costes diarios',
        style: { "font-size": "20px" },
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha',
        },
      },
      yAxis: {
        title: {
          text: 'Costes',
        },
        gridLineColor: "transparent"
      },
      series: [
        {
          name: 'Costes/Dia',
          type: 'line',
          data: this.costesCentrales,
          marker: {
            enabled: false
          }
        },
      ],
      credits: {
        enabled: false
      }
    }); 
  }
  

  graficaPantano() {

    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: 'grafica_pantano_1',
        type: 'line',
      },
      title: {
        text: 'Nivel del Pantano 1',
        style: { "font-size": "20px" },
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha',
        },
      },
      yAxis: {
        title: {
          text: 'Nivel de reserva',
        },
        gridLineColor: "transparent"
      },
      series: [
        {
          name: 'Reserva',
          type: 'line',
          data: this.nivelPantano1,
          marker: {
            enabled: false
          }
        },
      ],
      credits: {
        enabled: false
      }
    });
  }

  graficaPantano_2() {

    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: 'grafica_pantano_2',
        type: 'line',
      },
      title: {
        text: 'Nivel del Pantano 2',
        style: { "font-size": "20px" },
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha',
        },
      },
      yAxis: {
        title: {
          text: 'Nivel de reserva',
        },
        gridLineColor: "transparent"
      },
      series: [
        {
          name: 'Reserva',
          type: 'line',
          data: this.nivelPantano2,
          marker: {
            enabled: false
          }
        },
      ],
      credits: {
        enabled: false
      }
    });
  }


  graficaBarraHorizontal() {

    Highcharts.chart({
      chart: {
        type: 'column',
        renderTo: 'penalizacion',
        backgroundColor: "transparent",
      },
      title: {
        text: 'Scoring de uso energético'
      },
      xAxis: {
        title: {
          text: 'Zona',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        },
        gridLineColor: "transparent"
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          borderWidth: 0,
          lineWidth: 10
        }
      },
      series: [{
        type: 'column',
        name: 'Industrial',
        data: this.penalizacionesIndustrial
      },
      {
        type: 'column',
        name: 'Residencial',
        data:this.penalizacionesResidencial
      },
      {
        type: 'column',
        name: 'Servicios',
        data:this.penalizacionesServicios
      },]
    });


  }

  graficaCircular() {
    let self = this;
    Highcharts.chart({
      chart: {
        type: 'pie',
        renderTo: 'grafica_circular',
        backgroundColor: "transparent",
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: 'Centrales Activas',
        align: 'left'
      },
      subtitle: {
        text: 'Energía eléctrica total producida',
        align: 'left'
      },
      credits: {
        enabled: false,
      },
      plotOptions: {

        pie: {
          innerSize: 100,
          depth: 45
        },
        series: {
          cursor: 'pointer',
          events: {
            click: function (event) {
              const central_seleccionada = event.point.name.toString();
              self.openSideBar(central_seleccionada);
            }
          }
        },

      },
      series: [{
        name: 'Medals',
        type: 'pie',
        data: this.aportacionCentrales
      }]
    });
  }

  graficaBarras() {

    Highcharts.chart({
      chart: {
        backgroundColor: "transparent",
        renderTo: 'grafica_barras',
        type: 'column',
      },
      title: {
        text: 'Comparación emisiones',
        style: { "font-size": "20px" },
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Fecha',
        },
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          grouping: false // desactivar el agrupamiento de barras para que se solapen
        }
      },
      yAxis: {
        title: {
          text: 'Nivel de emisiones',
        },
        gridLineColor: "transparent"
      },
      series: [
        {
          name: 'Emisiones carbón',
          type: 'column',
          data: this.emisionesCarbon,
        },
        {
          name: 'Emisiones del sistema',
          type: 'column',
          data: this.emisionesSistema,
        },
      ],
    });


  }
}
