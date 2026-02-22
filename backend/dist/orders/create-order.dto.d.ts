export declare class OrderItemDto {
    productId: string;
    size: string;
    quantity: number;
    unitPriceCents: number;
}
export declare class CustomerDto {
    name: string;
    email: string;
    document: string;
    phone?: string;
}
export declare class AddressDto {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}
export declare class ShippingOptionDto {
    name: string;
    days: number;
    priceCents: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    customer: CustomerDto;
    address: AddressDto;
    shippingOption: ShippingOptionDto;
}
