import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/start/start.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' }, // redirigir a página de inicio
  { path: '', component: StartComponent }, // componente para página de inicio
  { path: 'home', component: HomeComponent }, // componente para página de inicio
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
