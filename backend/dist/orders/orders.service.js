"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const woocommerce_service_1 = require("../woocommerce/woocommerce.service");
let OrdersService = class OrdersService {
    wc;
    config;
    constructor(wc, config) {
        this.wc = wc;
        this.config = config;
    }
    async create(dto) {
        const nameParts = dto.customer.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '-';
        const billingAddress = {
            first_name: firstName,
            last_name: lastName,
            email: dto.customer.email,
            phone: dto.customer.phone ?? '',
            address_1: `${dto.address.street}, ${dto.address.number}`,
            address_2: dto.address.complement ?? '',
            city: dto.address.city,
            state: dto.address.state,
            postcode: dto.address.cep.replace(/\D/g, ''),
            country: 'BR',
        };
        const wcOrder = await this.wc.post('orders', {
            status: 'pending',
            set_paid: false,
            billing: billingAddress,
            shipping: {
                first_name: firstName,
                last_name: lastName,
                address_1: billingAddress.address_1,
                address_2: billingAddress.address_2,
                city: dto.address.city,
                state: dto.address.state,
                postcode: billingAddress.postcode,
                country: 'BR',
            },
            line_items: dto.items.map((i) => ({
                product_id: parseInt(i.productId, 10),
                quantity: i.quantity,
                meta_data: [{ key: 'Tamanho', value: i.size }],
            })),
            shipping_lines: [
                {
                    method_id: dto.shippingOption.name.toLowerCase().includes('sedex')
                        ? 'correios_sedex'
                        : 'flat_rate',
                    method_title: dto.shippingOption.name,
                    total: (dto.shippingOption.priceCents / 100).toFixed(2),
                },
            ],
            meta_data: [
                { key: '_customer_document', value: dto.customer.document },
            ],
        });
        const wcUrl = this.config.get('WC_URL', '').replace(/\/$/, '');
        const checkoutUrl = wcOrder.payment_url ||
            `${wcUrl}/checkout/order-pay/${wcOrder.id}/?pay_for_order=true&key=${wcOrder.order_key}`;
        return {
            orderId: String(wcOrder.id),
            checkoutUrl,
        };
    }
    async findOne(id) {
        return this.wc.get(`orders/${id}`);
    }
    async updateStatus(id, status) {
        return this.wc.put(`orders/${id}`, { status });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [woocommerce_service_1.WooCommerceService, typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], OrdersService);
//# sourceMappingURL=orders.service.js.map