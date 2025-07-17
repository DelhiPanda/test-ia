import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { CreateOrderDto, Order } from '../../models/order.interface';
import { OrderService } from '../../services/order.service';
import { forkJoin, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Checkout</h2>
      
      <!-- Resumen del carrito -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>Resumen del pedido</h5>
        </div>
        <div class="card-body">
          <div *ngFor="let item of cartItems" class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <strong>{{ item.product.name }}</strong>
              <br>
              <small class="text-muted">Cantidad: {{ item.quantity }}</small>
            </div>
            <div class="text-end">
              <strong>$ {{ (item.product.price * item.quantity) | number:'1.2-2' }}</strong>
            </div>
          </div>
          <hr>
          <div class="d-flex justify-content-between align-items-center"> 
            <h5>Total:</h5>
              <h5 class="text-success">$ {{ total | number:'1.2-2' }}</h5>
          </div>
        </div>
      </div>

      <!-- Formulario de checkout -->
      <div class="card">
        <div class="card-header">
          <h5>Información de contacto</h5>
        </div>
        <div class="card-body">
          <form #checkoutForm="ngForm" (ngSubmit)="submitOrder()">
            <div class="mb-3">
              <label class="form-label">Nombre completo *</label>
              <input 
                type="text" 
                class="form-control" 
                required 
                [(ngModel)]="name" 
                name="name"
                [class.is-invalid]="checkoutForm.submitted && !name"
              />
              <div class="invalid-feedback" *ngIf="checkoutForm.submitted && !name">
                El nombre es requerido
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Email *</label>
              <input 
                type="email" 
                class="form-control" 
                required 
                [(ngModel)]="email" 
                name="email"
                [class.is-invalid]="checkoutForm.submitted && !email"
              />
              <div class="invalid-feedback" *ngIf="checkoutForm.submitted && !email">
                El email es requerido y debe ser válido
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Dirección de envío *</label>
              <textarea 
                class="form-control" 
                rows="3"
                required 
                [(ngModel)]="address" 
                name="address"
                [class.is-invalid]="checkoutForm.submitted && !address"
              ></textarea>
              <div class="invalid-feedback" *ngIf="checkoutForm.submitted && !address">
                La dirección es requerida
              </div>
            </div>

            <!-- Estados de carga y error -->
            <div *ngIf="isLoading" class="alert alert-info">
              <i class="fas fa-spinner fa-spin"></i> Procesando tu pedido...
            </div>
            
            <div *ngIf="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <div class="d-grid gap-2">
              <button 
                class="btn btn-success btn-lg" 
                type="submit" 
                [disabled]="!checkoutForm.form.valid || isLoading || cartItems.length === 0"
              >
                <i class="fas fa-check"></i> Confirmar pedido
              </button>
              
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                (click)="goBack()"
                [disabled]="isLoading"
              >
                <i class="fas fa-arrow-left"></i> Volver al carrito
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: `
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .card {
      margin-bottom: 20px;
    }
  `
})
export class CheckoutComponent {
  name = '';
  email = '';
  address = '';
  isLoading = false;
  errorMessage = '';
  cartItems: any[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) {
    this.loadCartData();
  }

  private loadCartData() {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  async submitOrder() {
    if (this.cartItems.length === 0) {
      this.errorMessage = 'El carrito está vacío';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Preparar los datos de la orden
    const orderData: CreateOrderDto = {
      items: this.cartItems.map(item => ({
        itemId: item.product._id!,
        quantity: item.quantity
      })),
      customerName: this.name,
      customerEmail: this.email,
      shippingAddress: this.address
    };

    // Crear la orden en la API
    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        localStorage.setItem('lastOrder', JSON.stringify(this.cartItems));
        this.router.navigate(['/confirmation']);
      },
      error: (error: any) => {
        console.error('Error al crear la orden:', error);
        this.errorMessage = error.message || 'Error al procesar la orden. Por favor, intenta de nuevo.';
        alert(this.errorMessage);
      },
      complete: () => this.isLoading = false
    });
  }

  private updateProductStock() {
    const updatePromises = this.cartItems.map(item =>
      this.productService.updateStock(item.product._id!, item.quantity)
    );

    return forkJoin(updatePromises);
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
} 