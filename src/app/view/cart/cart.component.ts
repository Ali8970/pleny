import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/Product.model';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartProducts = this.cartService.getCartProducts();
  }
}
