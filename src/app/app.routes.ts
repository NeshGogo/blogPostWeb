import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path:'auth/login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  }
];
