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
var PaymentsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_service_1 = require("../supabase/supabase.service");
const MercadoPago = require('mercadopago');
let PaymentsService = PaymentsService_1 = class PaymentsService {
    config;
    supabase;
    logger = new common_1.Logger(PaymentsService_1.name);
    mp;
    constructor(config, supabase) {
        this.config = config;
        this.supabase = supabase;
        this.mp = new MercadoPago.default({
            accessToken: this.config.get('MERCADOPAGO_ACCESS_TOKEN') ?? '',
        });
    }
    async handleWebhook(body) {
        const type = body.type ?? body.topic;
        if (type !== 'payment')
            return { received: true };
        const paymentId = body.data?.id ?? body.resource?.split('/').pop();
        if (!paymentId)
            return { received: true };
        try {
            const payment = await this.mp.payment.get({ id: paymentId });
            const orderId = payment.external_reference;
            const status = payment.status;
            const paymentStatus = status === 'approved' ? 'approved' :
                status === 'rejected' ? 'rejected' : 'pending';
            const orderStatus = paymentStatus === 'approved' ? 'paid' :
                paymentStatus === 'rejected' ? 'canceled' : 'pending';
            await this.supabase.db
                .from('orders')
                .update({ payment_status: paymentStatus, status: orderStatus })
                .eq('id', orderId);
            this.logger.log(`Order ${orderId} updated: ${orderStatus}`);
        }
        catch (err) {
            this.logger.error('Webhook error', err);
        }
        return { received: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, supabase_service_1.SupabaseService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map