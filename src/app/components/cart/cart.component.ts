import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="container mt-4">
      <h2>Carrito de Compras</h2>
      <div *ngIf="cartItems.length === 0" class="alert alert-info">
        El carrito está vacío.
      </div>
      <table *ngIf="cartItems.length > 0" class="table table-bordered">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of cartItems">
            <td>
              <img [src]="item.product.image" width="50" class="me-2" />
              {{ item.product.name }}
            </td>
            <td>{{ item.product.price | currency:'USD' }}</td>
            <td>
              <input type="number" min="1" [(ngModel)]="item.quantity" (change)="updateQuantity(item)" class="form-control" style="width:80px;" />
            </td>
            <td>{{ (item.product.price * item.quantity) | currency:'USD' }}</td>
            <td>
              <button class="btn btn-danger btn-sm" (click)="remove(item.product._id!)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="cartItems.length > 0" class="text-end">
        <h4>Total: {{ total | currency:'USD' }}</h4>
        <button class="btn btn-primary" (click)="goToCheckout()">Finalizar compra</button>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.product._id!, item.quantity);
    this.total = this.cartService.getTotal();
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId);
    this.total = this.cartService.getTotal();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
} 