import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingService {
  async quote(cep: string, items: unknown[]) {
    // TODO: integrar Correios ou Melhor Envio
    // Por enquanto retorna opções fixas
    return [
      { id: 'pac', name: 'PAC', price_cents: 1500, days: 10 },
      { id: 'sedex', name: 'SEDEX', price_cents: 2800, days: 3 },
    ];
  }
}
