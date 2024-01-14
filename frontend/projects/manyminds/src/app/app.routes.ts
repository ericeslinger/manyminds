import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //default route
  {
    path: 'home',
    loadComponent: () => import('./home/home.view').then((mod) => mod.HomeView),
  },
];
