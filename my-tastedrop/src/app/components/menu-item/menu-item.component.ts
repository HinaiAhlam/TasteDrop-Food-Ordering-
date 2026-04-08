import { Component, Input } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent {
  @Input() item!: MenuItem;

  constructor(private cartService: CartService) {}

  onAdd(event: MouseEvent) {
    event.stopPropagation(); // يمنع تكرار الضغطة بشكل آلي
    this.cartService.addItem(this.item);
  }

  onRemove(event: MouseEvent) {
    event.stopPropagation(); // يمنع تكرار الضغطة بشكل آلي
    this.cartService.decreaseItem(this.item.id);
  }

  getQuantity(): number {
    return this.cartService.getItemQuantity(this.item.id);
  }
}