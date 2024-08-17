import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ProductService } from '../../view/products/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  @Output() searchQuery = new EventEmitter<string>();

  isLoggedIn = false; // This will be set to true after login
  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }
  onSearchInput(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    if (event.key === 'Enter') {
      this.productService.updateSearchTerm(inputElement.value);
    }
  }
}
