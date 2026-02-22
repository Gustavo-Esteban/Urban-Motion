import { Injectable, signal, computed } from '@angular/core';
import { WooProduct } from './products.service';

export interface CartItem {
  product: WooProduct;
  size: string | null;
  quantity: number;
}

const STORAGE_KEY = 'um_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>(this.loadFromStorage());

  count = computed(() => this.items().reduce((sum, i) => sum + i.quantity, 0));

  total = computed(() =>
    this.items().reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0),
  );

  add(product: WooProduct, size: string | null) {
    const current = this.items();
    const idx = current.findIndex(
      (i) => i.product.id === product.id && i.size === size,
    );
    if (idx >= 0) {
      this.items.set(
        current.map((i, index) =>
          index === idx ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      this.items.set([...current, { product, size, quantity: 1 }]);
    }
    this.saveToStorage();
  }

  remove(productId: number, size: string | null) {
    this.items.set(
      this.items().filter((i) => !(i.product.id === productId && i.size === size)),
    );
    this.saveToStorage();
  }

  updateQuantity(productId: number, size: string | null, qty: number) {
    if (qty <= 0) {
      this.remove(productId, size);
      return;
    }
    this.items.set(
      this.items().map((i) =>
        i.product.id === productId && i.size === size ? { ...i, quantity: qty } : i,
      ),
    );
    this.saveToStorage();
  }

  clear() {
    this.items.set([]);
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
    } catch {}
  }

  private loadFromStorage(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
