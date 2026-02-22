import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService, WooProduct } from '../../services/products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'um-product',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  product = signal<WooProduct | null>(null);
  loading = signal(true);
  error = signal(false);
  selectedSize = signal<string | null>(null);
  selectedImage = signal(0);
  addedToCart = signal(false);
  private cartService = inject(CartService);

  isInCart = computed(() =>
    this.cartService.items().some((i) => i.product.id === this.product()?.id),
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productsService.getOne(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  getSizes(): string[] {
    const p = this.product();
    if (!p) return [];
    const attr = p.attributes.find(
      (a) => a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size',
    );
    return attr?.options ?? [];
  }

  selectSize(size: string) {
    this.selectedSize.set(this.selectedSize() === size ? null : size);
  }

  getMainImage(): string {
    const p = this.product();
    return p?.images?.[this.selectedImage()]?.src ?? '';
  }

  stripHtml(html: string): string {
    return html?.replace(/<[^>]*>/g, '').trim() ?? '';
  }

  installment(price: string): string {
    const value = parseFloat(price) / 3;
    return value.toFixed(2).replace('.', ',');
  }

  addToCart() {
    const p = this.product();
    if (!p) return;
    this.cartService.add(p, this.selectedSize());
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2000);
  }
}
