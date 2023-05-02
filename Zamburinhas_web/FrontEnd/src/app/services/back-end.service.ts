import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  locations: string = 'http://localhost:8081';
  sun: string = 'http://localhost:8082';
  wind: string = 'http://localhost:8083';
  water: string = 'http://localhost:8084';
  geo: string = 'http://localhost:8085';
  coal: string = 'http://localhost:8086';

  consulta_api : string = 'http://localhost:3334';


  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  options = { headers: this.headers };


  constructor(private httpClient: HttpClient) { }

  getLocalizacaciones(){
    return this.httpClient.get(`${this.consulta_api}/list`);
  }

  getSunInfo(name:string){
    return this.httpClient.get(`${this.consulta_api}/item?item=`+name);
  }

  getGeoInfo(name:string){
    return this.httpClient.get(`${this.consulta_api}/item?item=`+name);
  }

  getWindInfo(name:string){
    return this.httpClient.get(`${this.consulta_api}/item?item=`+name);
  }

  getWaterInfo(name:string){
    return this.httpClient.get(`${this.consulta_api}/item?item=`+name);
  }

  getCoalInfo(name:string){
    return this.httpClient.get(`${this.consulta_api}/item?item=`+name);
  }

  /* // Create objects
  consulta(json:any):Observable<any>{
    return this.httpClient.post(`${this.consulta_api}/createActivities`, json);
} */
  consulta(fechas:string, areas : string, centrales:string):Observable<any>{
    console.log(`${this.consulta_api}/?fechas=${fechas}&areas=${areas}&centrales=${centrales}`);
    return this.httpClient.get(`${this.consulta_api}/?fechas=${fechas}&areas=${areas}&centrales=${centrales}`);
  }

}
