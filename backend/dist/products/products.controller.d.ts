import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
}
