import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>Catálogo de Productos</h2>
      <div class="text-end mt-4">
        <a routerLink="/create-product" class="btn btn-success btn-sm mb-3">
          <i class="bi bi-plus-circle"></i> Crear Producto
        </a>
      </div>
      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let product of products" [class.d-none]="!product.isActive || product.stock <= 0">
          <div class="card h-100">
            <img [src]="product.image" class="card-img-top" [alt]="product.name">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">{{ product.description }}</p>
              <p class="card-text">Stock: {{ product.stock }}</p>
              <p class="card-text fw-bold">{{ product.price | currency:'USD' }}</p>
              <button class="btn btn-primary" (click)="addToCart(product)">
                <i class="bi bi-cart-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <a routerLink="/cart" class="btn btn-success">
          <i class="bi bi-cart"></i> Ver Carrito
        </a>
      </div>
    </div>
  `,
  styles: [
    `.card-img-top {
        height: 200px;
        object-fit: cover;
      }`]
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log(products);
        this.products = products;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar productos';
      },
      complete: () => this.loading = false
    });
  }

  addToCart(product: Product) {
    if (product.stock <= 0) {
      alert('No hay stock disponible');
      return;
    }
    try {
      this.cartService.addToCart(product, 1);
      alert('Producto agregado al carrito');
    } catch (e: any) {
      alert(e.message);
    }
  }
} 