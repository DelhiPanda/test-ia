import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Order, OrderItem } from '../../models/order.interface';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body text-center">
              <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
              </div>
              
              <h2 class="card-title text-success">¡Pedido confirmado!</h2>
              <p class="card-text">Tu pedido ha sido procesado exitosamente.</p>
              
              <div *ngIf="order" class="mt-4">
                <div class="row">
                  <div class="col-md-6">
                    <h5>Información del pedido</h5>
                    <p><strong>Número de pedido:</strong> {{ order._id }}</p>
                    <p><strong>Estado:</strong> 
                      <span class="badge bg-primary">{{ order.status }}</span>
                    </p>
                    <p><strong>Fecha:</strong> {{ order.createdAt | date:'medium' }}</p>
                    <p><strong>Total:</strong> {{ order.totalAmount | number:'1.2-2' }}</p>
                  </div>
                  
                  <div class="col-md-6">
                    <h5>Información de contacto</h5>
                    <p><strong>Nombre:</strong> {{ order.customerName }}</p>
                    <p><strong>Email:</strong> {{ order.customerEmail }}</p>
                    <p><strong>Dirección:</strong> {{ order.shippingAddress }}</p>
                  </div>
                </div>
                
                <div class="mt-4">
                  <h5>Productos ordenados</h5>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of order.items">
                          <td>{{ item.itemId }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>$ {{ (item.price / item.quantity) | number:'1.2-2' }}</td>
                          <td>$ {{ item.price | number:'1.2-2' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div class="mt-4">
                <p class="text-muted">
                  Te hemos enviado un email de confirmación a {{ order.customerEmail }}.
                </p>
              </div>
              
              <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <button class="btn btn-primary" (click)="goToCatalog()">
                  <i class="fas fa-shopping-bag"></i> Continuar comprando
                </button>
                <button class="btn btn-outline-secondary" (click)="goToHome()">
                  <i class="fas fa-home"></i> Ir al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  order: Order = {} as Order;
  items: OrderItem[] = [];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        this.order = JSON.parse(lastOrder);
        this.items = this.order.items;
      }
    }
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    // localStorage.removeItem('lastOrder');
  }
} 