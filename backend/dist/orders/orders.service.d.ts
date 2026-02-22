import { ConfigService } from '@nestjs/config';
import { WooCommerceService } from '../woocommerce/woocommerce.service';
import { CreateOrderDto } from './create-order.dto';
export declare class OrdersService {
    private wc;
    private config;
    constructor(wc: WooCommerceService, config: ConfigService);
    create(dto: CreateOrderDto): Promise<{
        orderId: string;
        checkoutUrl: string;
    }>;
    findOne(id: string): Promise<unknown>;
    updateStatus(id: string, status: string): Promise<unknown>;
}
