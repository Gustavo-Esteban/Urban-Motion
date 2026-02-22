import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService, WooProduct } from '../../services/products.service';

@Component({
  selector: 'um-product',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  product: WooProduct | null = null;
  loading = true;
  error = false;
  selectedSize: string | null = null;
  selectedImage = 0;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productsService.getOne(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  getSizes(): string[] {
    if (!this.product) return [];
    const attr = this.product.attributes.find(
      (a) => a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size',
    );
    return attr?.options ?? [];
  }

  selectSize(size: string) {
    this.selectedSize = this.selectedSize === size ? null : size;
  }

  getMainImage(): string {
    return this.product?.images?.[this.selectedImage]?.src ?? '';
  }

  stripHtml(html: string): string {
    return html?.replace(/<[^>]*>/g, '').trim() ?? '';
  }
}
