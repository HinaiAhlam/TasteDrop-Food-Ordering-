import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; // 1. استيراد موديل الراوتر

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component'; // 2. استيراد النافبار
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component'; // 3. استيراد السلة

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,     // تأكدي من وجودها هنا
    MenuListComponent,
    MenuItemComponent,
    CartSummaryComponent // تأكدي من وجودها هنا
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([ // 4. إعداد المسارات (Routing)
      { path: '', redirectTo: '/menu', pathMatch: 'full' },
      { path: 'menu', component: MenuListComponent },
      { path: 'cart', component: CartSummaryComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }