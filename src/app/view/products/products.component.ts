import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { Category } from '../../interfaces/Category.model';
import { Product, ProductResponse } from '../../interfaces/Product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = []; // Store filtered products here
  currentPage: number = 1;
  totalPages!: number;
  pageSize: number = 6; // Number of items per page
  pages: number[] = [];
  categoryName: string = '';
  searchTerm: string = ''; // Store the current search term
  selectedCategory: string = '';

  breadcrumbLinks = [
    { name: 'Home', url: '#' },
    { name: 'Products', url: '#' },
    { name: 'Smart Phones', url: '#' },
    { name: 'iPhone', url: null },
  ];

  constructor(private productService: ProductService) {}

  /**
   * Initializes the component by fetching categories and products.
   * Also subscribes to search term updates to filter products accordingly.
   */
  ngOnInit(): void {
    this.productService.currentSearchTerm.subscribe((term) => {
      if (term) {
        this.searchTerm = term;
        this.categoryName = term;
        this.filterProductsBySearch();
      }
    });

    this.productService.getCategories().subscribe((data) => {
      this.categories = data;
    });

    this.getProducts();
  }

  /**
   * Fetches all products or filtered products based on the search term or category.
   */
  getProducts() {
    if (this.searchTerm) {
      this.filterProductsBySearch();
    } else if (this.categoryName) {
      this.filterProductsByCategory(this.categoryName);
    } else {
      this.productService
        .getAllProducts()
        .subscribe((data: ProductResponse) => {
          this.filteredProducts = data.products;
          this.paggination(this.filteredProducts);
        });
    }
  }
  getAllProducts() {
    this.searchTerm = '';
    this.categoryName = '';
    this.selectedCategory = '';
    this.getProducts();
  }
  /**
   * Filters products based on the current search term.
   * If no products are found, clears the search and category filters.
   */
  filterProductsBySearch() {
    this.productService
      .searchProducts(this.searchTerm)
      .subscribe((data: ProductResponse) => {
        if (this.filteredProducts.length !== 0) {
          this.filteredProducts = data.products;
          this.paggination(this.filteredProducts);
        } else {
          this.searchTerm = '';
          this.categoryName = '';
          this.getProducts();
        }
      });
  }

  /**
   * Filters products based on the selected category.
   * @param category - The slug of the selected category.
   */
  filterProductsByCategory(category: string) {
    this.productService
      .getProductsByCategory(category)
      .subscribe((data: ProductResponse) => {
        this.filteredProducts = data.products;
        this.paggination(this.filteredProducts);
      });
  }

  /**
   * Changes the current page and updates the displayed products accordingly.
   * @param page - The page number to navigate to.
   */
  goToPage(page: number) {
    this.currentPage = page;
    this.paggination(this.filteredProducts);
  }

  /**
   * Navigates to the previous page if available and updates the displayed products.
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paggination(this.filteredProducts);
    }
  }

  /**
   * Navigates to the next page if available and updates the displayed products.
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paggination(this.filteredProducts);
    }
  }

  /**
   * Filters products by the selected category and marks it as the active category.
   * Also clears any active search term.
   * @param category - The selected category.
   */
  filterByCategory(category: Category) {
    this.selectedCategory = category.name; // Set the selected category
    this.categoryName = category.name;
    this.searchTerm = '';
    this.filterProductsByCategory(category.slug);
  }

  /**
   * Paginates the provided products array based on the current page and page size.
   * @param products - The array of products to paginate.
   */
  paggination(products: Product[]) {
    this.totalPages = Math.ceil(products.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    this.products = products.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }
  onAddToCart(product: Product) {}
}
