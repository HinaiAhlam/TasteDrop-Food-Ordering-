import { Injectable } from '@angular/core';
import { MenuItem } from '../models/menu-item.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  constructor() {
    // استرجاع السلة عند تشغيل التطبيق
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  addItem(item: MenuItem) {
    const existingItem = this.items.find(i => i.menuItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ menuItem: item, quantity: 1 });
    }
    this.saveToLocalStorage();
  }

  decreaseItem(id: number) {
    const existingItem = this.items.find(i => i.menuItem.id === id);
    if (existingItem) {
      existingItem.quantity -= 1;
      if (existingItem.quantity <= 0) {
        this.removeItem(id);
      }
    }
    this.saveToLocalStorage();
  }

  removeItem(id: number) {
    this.items = this.items.filter(i => i.menuItem.id !== id);
    this.saveToLocalStorage();
  }

  clearCart() {
    this.items = [];
    localStorage.removeItem('cart');
  }

  getItems() { return this.items; }

  getItemQuantity(id: number): number {
    const item = this.items.find(i => i.menuItem.id === id);
    return item ? item.quantity : 0;
  }

  getCartCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  }
}