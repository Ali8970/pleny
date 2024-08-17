import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { authGuard } from '../auth/auth.guard';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: 'products', canActivate: [authGuard], component: ProductsComponent },
  { path: 'cart', canActivate: [authGuard], component: CartComponent },
];
