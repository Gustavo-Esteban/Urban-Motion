import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

export interface ShippingOption {
  id: string;
  name: string;
  price_cents: number;
  days: number;
}

@Component({
  selector: 'um-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = inject(CartService);
  private http = inject(HttpClient);

  // Form fields
  name = signal('');
  email = signal('');
  document = signal('');
  phone = signal('');
  cep = signal('');
  street = signal('');
  number = signal('');
  complement = signal('');
  neighborhood = signal('');
  city = signal('');
  state = signal('');

  // Shipping
  shippingOptions = signal<ShippingOption[]>([]);
  selectedShipping = signal<ShippingOption | null>(null);
  loadingShipping = signal(false);
  loadingCep = signal(false);

  // Submit state
  submitting = signal(false);
  submitted = signal(false);
  submitError = signal<string | null>(null);

  // Totals
  grandTotal = computed(() => {
    const shipping = this.selectedShipping()?.price_cents ?? 0;
    return this.cart.total() + shipping / 100;
  });

  onCepChange(value: string) {
    const digits = value.replace(/\D/g, '');
    this.cep.set(digits);
    if (digits.length === 8) {
      this.fillAddress(digits);
    }
  }

  private fillAddress(cep: string) {
    this.loadingCep.set(true);
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        if (!data.erro) {
          this.street.set(data.logradouro ?? '');
          this.neighborhood.set(data.bairro ?? '');
          this.city.set(data.localidade ?? '');
          this.state.set(data.uf ?? '');
        }
        this.loadingCep.set(false);
        this.quoteShipping(cep);
      },
      error: () => {
        this.loadingCep.set(false);
        this.quoteShipping(cep);
      },
    });
  }

  private quoteShipping(cep: string) {
    this.loadingShipping.set(true);
    this.http
      .post<ShippingOption[]>(`${environment.apiUrl}/shipping/quote`, {
        cep,
        items: this.cart.items().map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      })
      .subscribe({
        next: (options) => {
          this.shippingOptions.set(options);
          if (options.length > 0) this.selectedShipping.set(options[0]);
          this.loadingShipping.set(false);
        },
        error: () => this.loadingShipping.set(false),
      });
  }

  selectShipping(option: ShippingOption) {
    this.selectedShipping.set(option);
  }

  isFormValid(): boolean {
    return !!(
      this.name().trim() &&
      this.email().trim() &&
      this.document().trim() &&
      this.cep().length === 8 &&
      this.street().trim() &&
      this.number().trim() &&
      this.neighborhood().trim() &&
      this.city().trim() &&
      this.state().trim() &&
      this.selectedShipping() &&
      this.cart.items().length > 0
    );
  }

  submit() {
    if (!this.isFormValid()) return;

    const shipping = this.selectedShipping()!;
    const order = {
      customer: {
        name: this.name().trim(),
        email: this.email().trim(),
        document: this.document().replace(/\D/g, ''),
        phone: this.phone().trim() || undefined,
      },
      address: {
        cep: this.cep(),
        street: this.street().trim(),
        number: this.number().trim(),
        complement: this.complement().trim() || undefined,
        neighborhood: this.neighborhood().trim(),
        city: this.city().trim(),
        state: this.state().trim().toUpperCase(),
      },
      items: this.cart.items().map((i) => ({
        product_id: i.product.id,
        size: i.size ?? '',
        quantity: i.quantity,
        unit_price_cents: Math.round(parseFloat(i.product.price) * 100),
      })),
      shipping_option_id: shipping.id,
      shipping_price_cents: shipping.price_cents,
    };

    this.submitting.set(true);
    this.submitError.set(null);

    this.http.post(`${environment.apiUrl}/orders`, order).subscribe({
      next: () => {
        this.cart.clear();
        this.submitted.set(true);
        this.submitting.set(false);
      },
      error: () => {
        this.submitError.set('Erro ao processar pedido. Tente novamente.');
        this.submitting.set(false);
      },
    });
  }

  formatPrice(cents: number): string {
    return (cents / 100).toFixed(2).replace('.', ',');
  }
}
