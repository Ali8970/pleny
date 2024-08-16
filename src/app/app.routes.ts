import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },

  {
    path: 'view',
    loadChildren: () => import('./view/view.routes').then((m) => m.routes),
  },
];
