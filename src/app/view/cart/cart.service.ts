import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../interfaces/Product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Product[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);

  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {
    // Load cart from localStorage if it exists
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartItemCount.next(this.cartItems.length);
    }
  }

  /**
   * Adds a product to the cart and updates localStorage.
   * @param product - The product to add.
   */
  addToCart(product: Product) {
    this.cartItems.push(product);
    this.updateCartData();
  }

  /**
   * Retrieves the products in the cart.
   * @returns An array of products in the cart.
   */
  getCartProducts(): Product[] {
    return this.cartItems;
  }

  /**
   * Updates the cart in localStorage and the cart item count.
   */
  private updateCartData() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartItemCount.next(this.cartItems.length);
  }
}
