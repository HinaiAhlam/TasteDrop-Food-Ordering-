import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent {
  // المتغيرات المطلوبة في ملف الـ HTML
  promoCode: string = '';
  discount: number = 0;
  deliveryFee: number = 1.500;
  
  // إضافة هذا المتغير للتحكم في نوع الدفع وإظهار حقل البطاقة
  paymentMethod: string = 'cash'; 

  constructor(public cartService: CartService) {}

  // جلب العناصر من السيرفس
  get cartItems() {
    return this.cartService.getItems();
  }

  // زيادة الكمية
  increaseQty(item: MenuItem) {
    this.cartService.addItem(item);
  }

  // تقليل الكمية
  decreaseQty(id: number) {
    this.cartService.decreaseItem(id);
  }

  // حذف عنصر تماماً
  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  // حساب المجموع الفرعي
  getTotal() {
    return this.cartService.getTotal();
  }

  // تطبيق كود الخصم
  applyPromo() {
    if (this.promoCode === 'TASTE10') {
      this.discount = this.getTotal() * 0.10;
      alert('تم تطبيق الخصم بنجاح (10%)!');
    } else {
      this.discount = 0;
      alert('كود الخصم غير صحيح');
    }
  }

  // حساب الإجمالي النهائي
  getGrandTotal() {
    return this.getTotal() - this.discount + this.deliveryFee;
  }

  // إتمام الطلب
  checkout() {
    // توليد رقم طلب عشوائي
    const orderId = Math.floor(10000 + Math.random() * 90000);
    
    // رسالة تأكيد بناءً على المتطلبات
    alert(`Order Placed Successfully!\nOrder ID: #${orderId}\nEstimated Time: 35 minutes`);
    
    // مسح السلة بعد الطلب
    this.cartService.clearCart();
    this.discount = 0;
    this.promoCode = '';
  }
}