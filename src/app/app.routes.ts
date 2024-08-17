import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },

  {
    path: 'view',
    canActivate: [authGuard],
    loadChildren: () => import('./view/view.routes').then((m) => m.routes),
  },
];
