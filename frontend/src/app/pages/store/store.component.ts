import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';
import { ProductsService, WooProduct } from '../../services/products.service';

@Component({
  selector: 'um-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent implements OnInit {
  products: WooProduct[] = [];
  loading = true;
  error = false;

  constructor(
    private productsService: ProductsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    console.log('StoreComponent: ngOnInit');

    this.loading = true;
    this.error = false;

    this.productsService
      .getAll({ per_page: 20 })
      .pipe(
        tap({
          next: (data) => {
          console.log('StoreComponent: produtos recebidos', data);
          },
          error: (err) => {
            console.error('StoreComponent: erro na requisição', err);
          },
        }),
        finalize(() => {
          console.log('StoreComponent: finalize chamado');
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.products = Array.isArray(data) ? data : [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar produtos', err);
          this.error = true;
          this.cdr.detectChanges();
        },
      });

    setTimeout(() => {
      if (this.loading) {
        console.warn('StoreComponent: timeout ainda em loading, forçando false');
        this.loading = false;
        this.cdr.detectChanges();
      }
    }, 5000);
  }

  getSizes(product: WooProduct): string[] {
    const attr = product.attributes.find(a => a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size');
    return attr?.options ?? [];
  }

  getImage(product: WooProduct): string {
    return product.images?.[0]?.src ?? '';
  }
}
