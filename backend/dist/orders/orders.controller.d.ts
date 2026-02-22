import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<{
        orderId: string;
        checkoutUrl: string;
    }>;
    findOne(id: string): Promise<unknown>;
}
