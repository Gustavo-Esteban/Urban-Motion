export class CreateOrderDto {
  customer: {
    name: string;
    email: string;
    document: string;
    phone?: string;
  };
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: {
    product_id: number;
    size: string;
    quantity: number;
    unit_price_cents: number;
  }[];
  shipping_option_id: string;
  shipping_price_cents: number;
}
