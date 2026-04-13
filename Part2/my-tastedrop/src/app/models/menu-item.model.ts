export interface MenuItem {
  id: number;
  name: string;
  category: 'Starters' | 'Main Course' | 'Burgers' | 'Pizza' | 'Desserts' | 'Drinks';
  price: number;
  available: boolean;
  description: string;
  rating: number;
  image: string;
}