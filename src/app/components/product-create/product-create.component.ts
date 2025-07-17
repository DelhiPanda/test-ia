import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CreateProductDto } from '../../models/product.interface';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="bi bi-plus-circle me-2"></i>
                Crear Nuevo Producto
              </h3>
            </div>
            <div class="card-body">
              <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
                
                <!-- Nombre del producto -->
                <div class="mb-3">
                  <label for="name" class="form-label">
                    <i class="bi bi-tag me-1"></i>Nombre del Producto *
                  </label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name"
                    formControlName="name"
                    [class.is-invalid]="isFieldInvalid('name')"
                    placeholder="Ej: Laptop Gaming Pro">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                    <span *ngIf="productForm.get('name')?.errors?.['required']">
                      El nombre es requerido
                    </span>
                    <span *ngIf="productForm.get('name')?.errors?.['minlength']">
                      El nombre debe tener al menos 3 caracteres
                    </span>
                  </div>
                </div>

                <!-- Descripción -->
                <div class="mb-3">
                  <label for="description" class="form-label">
                    <i class="bi bi-card-text me-1"></i>Descripción *
                  </label>
                  <textarea 
                    class="form-control" 
                    id="description"
                    formControlName="description"
                    [class.is-invalid]="isFieldInvalid('description')"
                    rows="3"
                    placeholder="Describe las características del producto"></textarea>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('description')">
                    <span *ngIf="productForm.get('description')?.errors?.['required']">
                      La descripción es requerida
                    </span>
                    <span *ngIf="productForm.get('description')?.errors?.['minlength']">
                      La descripción debe tener al menos 10 caracteres
                    </span>
                  </div>
                </div>

                <!-- URL de la imagen -->
                <div class="mb-3">
                  <label for="image" class="form-label">
                    <i class="bi bi-image me-1"></i>URL de la Imagen *
                  </label>
                  <input 
                    type="url" 
                    class="form-control" 
                    id="image"
                    formControlName="image"
                    [class.is-invalid]="isFieldInvalid('image')"
                    placeholder="https://ejemplo.com/imagen.jpg">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('image')">
                    <span *ngIf="productForm.get('image')?.errors?.['required']">
                      La URL de la imagen es requerida
                    </span>
                    <span *ngIf="productForm.get('image')?.errors?.['pattern']">
                      Ingresa una URL válida (http:// o https://)
                    </span>
                  </div>
                  <!-- Vista previa de la imagen -->
                  <div class="mt-2" *ngIf="productForm.get('image')?.value && !isFieldInvalid('image')">
                    <img 
                      [src]="productForm.get('image')?.value"
                      class="img-thumbnail" 
                      style="max-width: 200px; max-height: 150px;"
                      (error)="onImageError($event)"
                      alt="Vista previa">
                  </div>
                </div>

                <!-- Precio y Stock en fila -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="price" class="form-label">
                      <i class="bi bi-currency-dollar me-1"></i>Precio *
                    </label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="price"
                        formControlName="price"
                        [class.is-invalid]="isFieldInvalid('price')"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00">
                    </div>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('price')">
                      <span *ngIf="productForm.get('price')?.errors?.['required']">
                        El precio es requerido
                      </span>
                      <span *ngIf="productForm.get('price')?.errors?.['min']">
                        El precio debe ser mayor a 0
                      </span>
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="stock" class="form-label">
                      <i class="bi bi-boxes me-1"></i>Stock *
                    </label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="stock"
                      formControlName="stock"
                      [class.is-invalid]="isFieldInvalid('stock')"
                      min="0"
                      placeholder="0">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('stock')">
                      <span *ngIf="productForm.get('stock')?.errors?.['required']">
                        El stock es requerido
                      </span>
                      <span *ngIf="productForm.get('stock')?.errors?.['min']">
                        El stock debe ser 0 o mayor
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Estado activo -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="isActive"
                      formControlName="isActive">
                    <label class="form-check-label" for="isActive">
                      <i class="bi bi-toggle-on me-1"></i>Producto Activo
                    </label>
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    class="btn btn-secondary me-md-2" 
                    (click)="goBack()">
                    <i class="bi bi-arrow-left me-1"></i>Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="productForm.invalid || loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    <i *ngIf="!loading" class="bi bi-check-circle me-1"></i>
                    {{ loading ? 'Creando...' : 'Crear Producto' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductCreateComponent {
  productForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  onSubmit() {
    if (this.productForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const product: CreateProductDto = this.productForm.value;
    
    this.productService.createProduct(product).subscribe({
      next: (createdProduct) => {
        alert('¡Producto creado exitosamente!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Error al crear producto: ' + (err.message || 'Error desconocido'));
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
