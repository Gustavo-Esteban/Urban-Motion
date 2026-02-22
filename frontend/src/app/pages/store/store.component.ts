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
          this.renderFallback();
        }),
      )
      .subscribe({
        next: (data) => {
          this.products = Array.isArray(data) ? data : [];
          this.cdr.detectChanges();
          this.renderFallback();
        },
        error: (err) => {
          console.error('Erro ao carregar produtos', err);
          this.error = true;
          this.cdr.detectChanges();
          this.renderFallback();
        },
      });

    setTimeout(() => {
      if (this.loading) {
        console.warn('StoreComponent: timeout ainda em loading, forçando false');
        this.loading = false;
        this.cdr.detectChanges();
        this.renderFallback();
      }
    }, 5000);
  }

  private renderFallback() {
    if (typeof document === 'undefined') return;

    try {
      const countEl = document.querySelector('.store-header p');
      if (countEl && this.products.length) {
        countEl.textContent = `${this.products.length} produtos`;
      }

      const loadingEl = document.querySelector('.store__loading') as HTMLElement | null;
      if (loadingEl) {
        loadingEl.style.display = 'none';
      }

      const gridEl = document.querySelector('.store__grid');
      if (!gridEl || !this.products.length) return;

      if (gridEl.childElementCount > 0) return;

      for (const p of this.products) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const imgSrc = this.getImage(p);
        if (imgSrc) {
          const img = document.createElement('img');
          img.className = 'product-card__img';
          img.src = imgSrc;
          img.alt = p.name;
          card.appendChild(img);
        } else {
          const placeholder = document.createElement('div');
          placeholder.className = 'product-card__img product-card__img--placeholder';
          card.appendChild(placeholder);
        }

        const info = document.createElement('div');
        info.className = 'product-card__info';

        const name = document.createElement('span');
        name.className = 'product-card__name';
        name.textContent = p.name;
        info.appendChild(name);

        const price = document.createElement('span');
        price.className = 'product-card__price';
        price.textContent = `R$ ${p.price}`;
        info.appendChild(price);

        card.appendChild(info);

        gridEl.appendChild(card);
      }
    } catch (err) {
      console.error('StoreComponent: erro no fallback de renderização', err);
    }
  }


  getSizes(product: WooProduct): string[] {
    const attr = product.attributes.find(a => a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size');
    return attr?.options ?? [];
  }

  getImage(product: WooProduct): string {
    return product.images?.[0]?.src ?? '';
  }
}
