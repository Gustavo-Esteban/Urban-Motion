import { WooCommerceService } from '../woocommerce/woocommerce.service';
export declare class ProductsService {
    private wc;
    constructor(wc: WooCommerceService);
    findAll(): Promise<{
        id: string;
        name: string;
        description: string;
        priceCents: number;
        imageUrl: string;
        sizes: string[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        priceCents: number;
        imageUrl: string;
        sizes: string[];
    }>;
    private mapProduct;
}
