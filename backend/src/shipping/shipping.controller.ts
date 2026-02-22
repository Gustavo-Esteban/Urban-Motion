import { Body, Controller, Post } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('quote')
  quote(@Body() body: { cep: string; items: unknown[] }) {
    return this.shippingService.quote(body.cep, body.items);
  }
}
