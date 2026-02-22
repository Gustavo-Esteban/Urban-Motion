import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WooCommerceModule } from './woocommerce/woocommerce.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WooCommerceModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    ShippingModule,
  ],
})
export class AppModule {}
