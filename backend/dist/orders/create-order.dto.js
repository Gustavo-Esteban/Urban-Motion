"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderDto = exports.ShippingOptionDto = exports.AddressDto = exports.CustomerDto = exports.OrderItemDto = void 0;
class OrderItemDto {
    productId;
    size;
    quantity;
    unitPriceCents;
}
exports.OrderItemDto = OrderItemDto;
class CustomerDto {
    name;
    email;
    document;
    phone;
}
exports.CustomerDto = CustomerDto;
class AddressDto {
    cep;
    street;
    number;
    complement;
    neighborhood;
    city;
    state;
}
exports.AddressDto = AddressDto;
class ShippingOptionDto {
    name;
    days;
    priceCents;
}
exports.ShippingOptionDto = ShippingOptionDto;
class CreateOrderDto {
    items;
    customer;
    address;
    shippingOption;
}
exports.CreateOrderDto = CreateOrderDto;
//# sourceMappingURL=create-order.dto.js.map