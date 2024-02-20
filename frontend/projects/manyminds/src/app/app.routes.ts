import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //default route
  {
    path: 'home',
    loadComponent: () => import('./home/home.view').then((mod) => mod.HomeView),
  },
  {
    path: 'auth/create',
    loadComponent: () =>
      import('./auth/auth.create').then((mod) => mod.AuthCreate),
  },
  {
    path: 'auth/me',
    loadComponent: () => import('./auth/auth.view').then((mod) => mod.AuthView),
  },
  {
    path: 'profile/create',
    loadComponent: () =>
      import('./profile/profile.create').then((mod) => mod.ProfileCreate),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./profile/profile.view').then((mod) => mod.ProfileView),
  },
  {
    path: 'profile/list',
    loadComponent: () =>
      import('./profile/profile.list').then((mod) => mod.ProfileList),
  },
];
