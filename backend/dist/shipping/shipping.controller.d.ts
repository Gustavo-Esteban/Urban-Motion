import { ShippingService } from './shipping.service';
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    quote(body: {
        cepDestino: string;
        items: any[];
    }): import("./shipping.service").ShippingQuote[];
}
