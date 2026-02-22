import { Injectable } from '@nestjs/common';
import { WooCommerceService } from '../woocommerce/woocommerce.service';

const mockProducts = [
  {
    id: 1,
    name: 'Camiseta Essential Preta',
    price: '89.90',
    permalink: 'https://orange-loris-176576.hostingersite.com/produto/camiseta-essential-preta/',
    images: [
      {
        src: '',
        alt: 'Camiseta Essential Preta',
      },
    ],
    attributes: [
      { name: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
    ],
    short_description: 'Camiseta preta básica Urban Motion.',
    stock_status: 'instock',
  },
  {
    id: 2,
    name: 'Camiseta Essential Branca',
    price: '89.90',
    permalink: 'https://orange-loris-176576.hostingersite.com/produto/camiseta-essential-branca/',
    images: [
      {
        src: '',
        alt: 'Camiseta Essential Branca',
      },
    ],
    attributes: [
      { name: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
    ],
    short_description: 'Camiseta branca básica Urban Motion.',
    stock_status: 'instock',
  },
];

@Injectable()
export class ProductsService {
  constructor(private readonly wc: WooCommerceService) {}

  async findAll(params?: { page?: number; per_page?: number; category?: string }) {
    if (process.env.NODE_ENV !== 'production') {
      return mockProducts;
    }
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page ?? 20));
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return this.wc.get(`products${qs ? '?' + qs : ''}`);
  }

  async findOne(id: number) {
    if (process.env.NODE_ENV !== 'production') {
      return mockProducts.find((p) => p.id === id);
    }
    return this.wc.get(`products/${id}`);
  }
}
