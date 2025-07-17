import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'create-product', component: ProductCreateComponent },
  { path: '**', redirectTo: '' }
];
