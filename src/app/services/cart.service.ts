import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../models/product.interface';
import { ProductService } from './product.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private isBrowser: boolean;

  constructor(private productService: ProductService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadCartFromStorage();
  }

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  addToCart(product: Product, quantity: number = 1): void {
    // Verificar stock disponible
    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
    }

    const existingItem = this.cartItems.find(item => item.product._id === product._id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new Error(`Stock insuficiente. Solo puedes agregar ${product.stock - existingItem.quantity} unidades más.`);
      }
      existingItem.quantity = newQuantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.updateCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.product._id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else if (quantity > item.product.stock) {
        alert(`Stock insuficiente. Solo hay ${item.product.stock} unidades disponibles.`);
        throw new Error(`Stock insuficiente. Solo hay ${item.product.stock} unidades disponibles.`);
      } else {
        item.quantity = quantity;
        this.updateCart();
      }
    }
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product._id !== productId);
    this.updateCart();
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  // Procesar la compra y actualizar stock en la API
  async processPurchase(): Promise<void> {
    const updatePromises = this.cartItems.map(item => 
      this.productService.updateStock(item.product._id!, item.quantity)
    );
    
    await Promise.all(updatePromises);
    this.clearCart();
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  private loadCartFromStorage(): void {
    if (this.isBrowser) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }
} 