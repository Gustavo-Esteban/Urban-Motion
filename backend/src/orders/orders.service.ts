import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrdersService {
  async create(dto: CreateOrderDto) {
    // TODO: salvar pedido no Supabase e iniciar fluxo de pagamento
    return { message: 'Pedido recebido', dto };
  }

  async findOne(id: string) {
    // TODO: buscar pedido no Supabase
    return { id };
  }
}
