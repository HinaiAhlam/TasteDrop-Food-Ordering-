import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';

const routes: Routes = [
  { path: 'menu', component: MenuListComponent },
  { path: 'cart', component: CartSummaryComponent },
  { path: '', redirectTo: '/menu', pathMatch: 'full' } // الصفحة الافتراضية
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }