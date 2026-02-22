import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async createPreference(orderId: string) {
    // TODO: integrar Mercado Pago
    return { order_id: orderId, init_point: null };
  }

  async handleWebhook(body: unknown) {
    // TODO: processar notificação do Mercado Pago e atualizar pedido
    return { received: true };
  }
}
