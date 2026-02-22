import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mercadopago')
  createPreference(@Body() body: { order_id: string }) {
    return this.paymentsService.createPreference(body.order_id);
  }

  @Post('mercadopago/webhook')
  webhook(@Body() body: unknown) {
    return this.paymentsService.handleWebhook(body);
  }
}
