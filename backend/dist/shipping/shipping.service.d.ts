export interface ShippingQuote {
    name: string;
    days: number;
    priceCents: number;
}
export declare class ShippingService {
    quote(_cepDestino: string, _items: any[]): ShippingQuote[];
}
