import { Injectable } from '@nestjs/common';
import { WooCommerceService } from '../woocommerce/woocommerce.service';

@Injectable()
export class ProductsService {
  constructor(private readonly wc: WooCommerceService) {}

  async findAll(params?: { page?: number; per_page?: number; category?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page ?? 20));
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return this.wc.get(`products${qs ? '?' + qs : ''}`);
  }

  async findOne(id: number) {
    return this.wc.get(`products/${id}`);
  }
}
