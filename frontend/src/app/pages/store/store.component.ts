import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { ProductsService, WooProduct } from '../../services/products.service';
import { environment } from '../../../environments/environment';

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

  constructor(private productsService: ProductsService) {}

  openProduct(product: WooProduct) {
    if (!product?.permalink) return;
    window.open(product.permalink, '_blank');
  }

  ngOnInit() {
    this.loading = true;
    this.error = false;

    this.productsService
      .getAll({ per_page: 20 })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.renderProdFallback();
        }),
      )
      .subscribe({
        next: (data) => {
          this.products = Array.isArray(data) ? data : [];
          this.renderProdFallback();
        },
        error: () => {
          this.error = true;
          this.renderProdFallback();
        },
      });
  }

  getSizes(product: WooProduct): string[] {
    const attr = product.attributes.find(a => a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size');
    return attr?.options ?? [];
  }

  getImage(product: WooProduct): string {
    return product.images?.[0]?.src ?? '';
  }

  private renderProdFallback() {
    if (!environment.production) return;
    if (typeof document === 'undefined') return;

    try {
      const section = document.querySelector('section.store') as HTMLElement | null;
      const loadingEl = document.querySelector('.store__loading') as HTMLElement | null;
      const countEl = document.querySelector('.store-header p');

      if (loadingEl) {
        loadingEl.style.display = this.loading ? 'block' : 'none';
      }

      if (countEl) {
        countEl.textContent = `${this.products.length} produtos`;
      }

      if (!section) return;

      let gridEl = section.querySelector('.store__grid') as HTMLElement | null;

      if (!gridEl) {
        section.innerHTML = '';
        gridEl = document.createElement('div');
        gridEl.className = 'store__grid';
        section.appendChild(gridEl);
      }

      gridEl.style.display = 'grid';
      gridEl.style.gap = '2rem 1.5rem';
      gridEl.style.gridTemplateColumns = 'repeat(3, 1fr)';

      if (!this.products.length) {
        gridEl.innerHTML = '';
        return;
      }

      if (gridEl.childElementCount === this.products.length) return;

      gridEl.innerHTML = '';

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

        if (Array.isArray(p.attributes)) {
          const sizeAttr = p.attributes.find(
            (a) =>
              a.name &&
              (a.name.toLowerCase() === 'tamanho' || a.name.toLowerCase() === 'size'),
          );
          if (sizeAttr?.options?.length) {
            const sizes = document.createElement('div');
            sizes.className = 'product-card__sizes';
            for (const s of sizeAttr.options) {
              const span = document.createElement('span');
              span.textContent = s;
              sizes.appendChild(span);
            }
            card.appendChild(sizes);
          }
        }

        const btn = document.createElement('a');
        btn.className = 'btn btn--primary product-card__btn';
        btn.textContent = 'Ver produto';
        btn.href = p.permalink;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        card.appendChild(btn);

        gridEl.appendChild(card);
      }
    } catch {
      // silencioso em produção
    }
  }
}
