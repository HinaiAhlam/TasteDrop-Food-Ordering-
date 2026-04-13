import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // استيراد الـ HttpClient
import { MenuItem } from '../../models/menu-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  menuItems: MenuItem[] = []; // مصفوفة فارغة في البداية
  filteredItems: MenuItem[] = [];
  selectedCategory: string = 'All';
  searchTerm: string = '';
  sortOption: string = 'default';

  constructor(private http: HttpClient, private cartService: CartService) { }

  ngOnInit(): void {
    // جلب البيانات من ملف الـ JSON
    this.http.get<any>('assets/data/data.json').subscribe(data => {
      this.menuItems = data.menu; // تخزين البيانات القادمة من "menu"
      this.filteredItems = [...this.menuItems];
    });
  }

  filterItems() {
    this.filteredItems = this.menuItems.filter(item => {
      const categoryMatch = this.selectedCategory === 'All' || item.category === this.selectedCategory;
      const searchMatch = !this.searchTerm || 
                          item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
    this.applySort();
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.filterItems();
  }

  applySort() {
    if (this.sortOption === 'lowToHigh') {
      this.filteredItems.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'highToLow') {
      this.filteredItems.sort((a, b) => b.price - a.price);
    }
  }

  addToCart(item: MenuItem) {
    if (item.available) {
      this.cartService.addItem(item);
    }
  }
}